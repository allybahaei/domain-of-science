import type { MindmapData, MindmapNode } from "./generateMindmap";

interface TreeNode {
  node: MindmapNode;
  children: TreeNode[];
  leafCount: number;
  angle: number;
  angleSpan: number;
}

const ROOT_COLOR = { bg: "#FFD700", stroke: "#B8860B" };

const SUBTREE_PALETTE: { bg: string; stroke: string }[] = [
  { bg: "#6B8CFF", stroke: "#3A5BD9" },
  { bg: "#FF6B8C", stroke: "#D93A5B" },
  { bg: "#6BFFB8", stroke: "#3AD98A" },
  { bg: "#C084FC", stroke: "#7C3AED" },
  { bg: "#FB923C", stroke: "#C2410C" },
  { bg: "#38BDF8", stroke: "#0369A1" },
  { bg: "#F472B6", stroke: "#BE185D" },
  { bg: "#A3E635", stroke: "#4D7C0F" },
  { bg: "#FACC15", stroke: "#A16207" },
  { bg: "#2DD4BF", stroke: "#0F766E" },
];

const NODE_DIMS: Record<number, { width: number; height: number; fontSize: number }> = {
  0: { width: 320, height: 90, fontSize: 36 },
  1: { width: 240, height: 70, fontSize: 22 },
  2: { width: 220, height: 65, fontSize: 20 },
  3: { width: 200, height: 60, fontSize: 18 },
};

const RADII = [0, 300, 580, 850];
const ARROW_GAP = 8;

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Find where the ray from a rectangle's centre toward (tx, ty) exits the
 * rectangle, then push the point outward by `gap` pixels along the same
 * direction.  Returns the arrow-attachment point just outside the edge.
 */
function rectEdgePoint(
  cx: number, cy: number,
  halfW: number, halfH: number,
  tx: number, ty: number,
  gap: number,
): { x: number; y: number } {
  const dx = tx - cx;
  const dy = ty - cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: cx + halfW + gap, y: cy };

  const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const s = Math.min(scaleX, scaleY);

  return {
    x: cx + dx * s + (dx / len) * gap,
    y: cy + dy * s + (dy / len) * gap,
  };
}

function buildTree(nodes: MindmapNode[]): TreeNode {
  const childrenMap = new Map<string, MindmapNode[]>();
  let root: MindmapNode | undefined;

  for (const node of nodes) {
    if (node.parentId === null) {
      root = node;
    } else {
      const siblings = childrenMap.get(node.parentId) || [];
      siblings.push(node);
      childrenMap.set(node.parentId, siblings);
    }
  }

  if (!root) throw new Error("No root node found");

  function toTree(n: MindmapNode): TreeNode {
    const kids = (childrenMap.get(n.id) || []).map(toTree);
    const leafCount =
      kids.length === 0 ? 1 : kids.reduce((s, k) => s + k.leafCount, 0);
    return { node: n, children: kids, leafCount, angle: 0, angleSpan: 0 };
  }

  return toTree(root);
}

function assignAngles(tree: TreeNode): void {
  tree.angle = 0;
  tree.angleSpan = 2 * Math.PI;

  function recurse(parent: TreeNode) {
    if (parent.children.length === 0) return;

    const totalLeaves = parent.children.reduce(
      (s, c) => s + c.leafCount,
      0,
    );

    // Root distributes children starting from angle 0 across the full circle.
    // Deeper nodes centre their children within the parent's angular wedge.
    let cursor =
      parent.node.depth === 0
        ? 0
        : parent.angle - parent.angleSpan / 2;

    for (const child of parent.children) {
      const span = (child.leafCount / totalLeaves) * parent.angleSpan;
      child.angle = cursor + span / 2;
      child.angleSpan = span;
      cursor += span;
      recurse(child);
    }
  }

  recurse(tree);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildExcalidrawElements(data: MindmapData): any[] {
  const tree = buildTree(data.nodes);
  assignAngles(tree);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements: any[] = [];
  const rectIdMap = new Map<string, string>();
  const posMap = new Map<string, { x: number; y: number }>();

  function emitNode(t: TreeNode, color: { bg: string; stroke: string }) {
    const r = RADII[t.node.depth] ?? RADII[RADII.length - 1];
    const pos = {
      x: r * Math.cos(t.angle),
      y: r * Math.sin(t.angle),
    };
    posMap.set(t.node.id, pos);

    const dims = NODE_DIMS[t.node.depth] ?? NODE_DIMS[3];
    const rectId = randomId();
    const textId = randomId();
    rectIdMap.set(t.node.id, rectId);

    const x = pos.x - dims.width / 2;
    const y = pos.y - dims.height / 2;

    elements.push({
      id: rectId,
      type: "rectangle",
      x,
      y,
      width: dims.width,
      height: dims.height,
      strokeColor: color.stroke,
      backgroundColor: color.bg,
      fillStyle: "solid",
      roughness: 2,
      opacity: 100,
      roundness: { type: 3 },
      boundElements: [{ id: textId, type: "text" }],
      isDeleted: false,
      groupIds: [],
      locked: false,
      version: 1,
    });

    elements.push({
      id: textId,
      type: "text",
      x: x + 10,
      y: y + dims.height / 2 - dims.fontSize / 2,
      width: dims.width - 20,
      height: dims.fontSize,
      text: t.node.label,
      fontSize: dims.fontSize,
      fontFamily: 5,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: rectId,
      originalText: t.node.label,
      autoResize: true,
      isDeleted: false,
      groupIds: [],
      locked: false,
      version: 1,
    });

    for (const child of t.children) {
      emitNode(child, color);
    }
  }

  // Emit root alone with its own colour (no recursion needed — emitNode
  // recurses into children, so we call it only for the root-level node
  // by temporarily detaching children, then emit each subtree separately).
  const rootChildren = tree.children;
  tree.children = [];
  emitNode(tree, ROOT_COLOR);
  tree.children = rootChildren;

  tree.children.forEach((child, i) => {
    emitNode(child, SUBTREE_PALETTE[i % SUBTREE_PALETTE.length]);
  });

  function emitEdges(t: TreeNode) {
    for (const child of t.children) {
      const sourceRectId = rectIdMap.get(t.node.id);
      const targetRectId = rectIdMap.get(child.node.id);
      if (!sourceRectId || !targetRectId) continue;

      const sp = posMap.get(t.node.id)!;
      const cp = posMap.get(child.node.id)!;
      const arrowId = randomId();

      const sDims = NODE_DIMS[t.node.depth] ?? NODE_DIMS[3];
      const cDims = NODE_DIMS[child.node.depth] ?? NODE_DIMS[3];

      const start = rectEdgePoint(
        sp.x, sp.y, sDims.width / 2, sDims.height / 2,
        cp.x, cp.y, ARROW_GAP,
      );
      const end = rectEdgePoint(
        cp.x, cp.y, cDims.width / 2, cDims.height / 2,
        sp.x, sp.y, ARROW_GAP,
      );

      const sourceRect = elements.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el: any) => el.id === sourceRectId && el.type === "rectangle",
      );
      if (sourceRect) {
        sourceRect.boundElements = sourceRect.boundElements || [];
        sourceRect.boundElements.push({ id: arrowId, type: "arrow" });
      }

      const targetRect = elements.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el: any) => el.id === targetRectId && el.type === "rectangle",
      );
      if (targetRect) {
        targetRect.boundElements = targetRect.boundElements || [];
        targetRect.boundElements.push({ id: arrowId, type: "arrow" });
      }

      elements.push({
        id: arrowId,
        type: "arrow",
        x: start.x,
        y: start.y,
        width: end.x - start.x,
        height: end.y - start.y,
        points: [
          [0, 0],
          [end.x - start.x, end.y - start.y],
        ],
        strokeColor: "#333333",
        roughness: 2,
        opacity: 100,
        fillStyle: "solid",
        startBinding: {
          elementId: sourceRectId,
          focus: 0,
          gap: ARROW_GAP,
          fixedPoint: null,
        },
        endBinding: {
          elementId: targetRectId,
          focus: 0,
          gap: ARROW_GAP,
          fixedPoint: null,
        },
        startArrowhead: null,
        endArrowhead: "arrow",
        isDeleted: false,
        groupIds: [],
        locked: false,
        version: 1,
      });

      emitEdges(child);
    }
  }

  emitEdges(tree);

  return elements;
}
