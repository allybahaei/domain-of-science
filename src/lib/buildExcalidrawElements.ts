import type { MindmapData, MindmapNode } from "./generateMindmap";
import type { YouTubeResult } from "./youtubeApi";

interface TreeNode {
  node: MindmapNode;
  children: TreeNode[];
  leafCount: number;
  angle: number;
  angleSpan: number;
}

const ROOT_COLOR = { bg: "#FFF1C4", stroke: "#C4A574" };

const SUBTREE_PALETTE: { bg: string; stroke: string }[] = [
  { bg: "#D6E4FF", stroke: "#7A8EB8" },
  { bg: "#FFDDE8", stroke: "#B88A9A" },
  { bg: "#D4F5E9", stroke: "#6FA090" },
  { bg: "#E8DCFA", stroke: "#8F7BA8" },
  { bg: "#FFE8D6", stroke: "#B89278" },
  { bg: "#D4EEFC", stroke: "#6E96B0" },
  { bg: "#F8D8EC", stroke: "#A87E96" },
  { bg: "#E8F5D4", stroke: "#8AA06E" },
  { bg: "#FFF4C8", stroke: "#B0A060" },
  { bg: "#D6F5F2", stroke: "#6E9E98" },
];

const NODE_DIMS: Record<number, { width: number; height: number; fontSize: number }> = {
  0: { width: 340, height: 90, fontSize: 36 },
  1: { width: 260, height: 70, fontSize: 22 },
  2: { width: 240, height: 60, fontSize: 18 },
  3: { width: 220, height: 55, fontSize: 16 },
};

const LEAF_MIN_WIDTH = 340;
const LEAF_INNER_PADDING_X = 14;
const LEAF_TEXT_TOP = 12;
const LEAF_PADDING_BOTTOM = 14;
/** Blank line count between title and bullet list in leaf nodes */
const LEAF_TITLE_BODY_GAP_LINES = 1;
const LEAF_LINE_HEIGHT = 1.4;

const RADII = [0, 320, 620, 950];
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

export interface BuildResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elements: any[];
  posMap: Map<string, { x: number; y: number }>;
  dimsMap: Map<string, { width: number; height: number }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildExcalidrawElements(data: MindmapData): BuildResult {
  const tree = buildTree(data.nodes);
  assignAngles(tree);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements: any[] = [];
  const rectIdMap = new Map<string, string>();
  const posMap = new Map<string, { x: number; y: number }>();
  const dimsMap = new Map<string, { width: number; height: number }>();

  function emitNode(t: TreeNode, color: { bg: string; stroke: string }) {
    const r = RADII[t.node.depth] ?? RADII[RADII.length - 1];
    const pos = {
      x: r * Math.cos(t.angle),
      y: r * Math.sin(t.angle),
    };
    posMap.set(t.node.id, pos);

    const baseDims = NODE_DIMS[t.node.depth] ?? NODE_DIMS[3];
    const isLeaf = t.children.length === 0 && t.node.bullets && t.node.bullets.length > 0;
    const labelText =
      t.node.depth === 0 ? t.node.label.toUpperCase() : t.node.label;

    const bulletText = isLeaf
      ? t.node.bullets!.map((b) => `• ${b}`).join("\n")
      : "";
    const bulletLineCount = isLeaf ? t.node.bullets!.length : 0;
    const leafContentLineCount = isLeaf
      ? 1 + LEAF_TITLE_BODY_GAP_LINES + bulletLineCount
      : 0;
    const leafTextBlockHeight = isLeaf
      ? leafContentLineCount * baseDims.fontSize * LEAF_LINE_HEIGHT
      : 0;

    const width = isLeaf ? Math.max(baseDims.width, LEAF_MIN_WIDTH) : baseDims.width;
    const height = isLeaf
      ? LEAF_TEXT_TOP + leafTextBlockHeight + LEAF_PADDING_BOTTOM
      : baseDims.height;
    dimsMap.set(t.node.id, { width, height });

    const rectId = randomId();
    const textId = randomId();
    rectIdMap.set(t.node.id, rectId);

    const x = pos.x - width / 2;
    const y = pos.y - height / 2;

    const boundElements: { id: string; type: string }[] = [{ id: textId, type: "text" }];
    const isRoot = t.node.depth === 0;

    elements.push({
      id: rectId,
      type: "rectangle",
      x,
      y,
      width,
      height,
      strokeColor: isRoot ? "#000000" : color.stroke,
      backgroundColor: color.bg,
      fillStyle: "solid",
      roughness: 2,
      opacity: 100,
      roundness: isRoot ? null : { type: 3 },
      boundElements,
      isDeleted: false,
      groupIds: [],
      locked: false,
      version: 1,
    });

    if (isLeaf) {
      const combinedText = `${labelText}\n\n${bulletText}`;
      elements.push({
        id: textId,
        type: "text",
        x: x + LEAF_INNER_PADDING_X,
        y: y + LEAF_TEXT_TOP,
        width: width - 2 * LEAF_INNER_PADDING_X,
        height: leafTextBlockHeight,
        text: combinedText,
        fontSize: baseDims.fontSize,
        fontFamily: 5,
        textAlign: "left",
        verticalAlign: "top",
        lineHeight: LEAF_LINE_HEIGHT,
        containerId: rectId,
        originalText: combinedText,
        autoResize: true,
        isDeleted: false,
        groupIds: [],
        locked: false,
        version: 1,
      });
    } else {
      elements.push({
        id: textId,
        type: "text",
        x: x + 10,
        y: y + height / 2 - baseDims.fontSize / 2,
        width: width - 20,
        height: baseDims.fontSize,
        text: labelText,
        fontSize: baseDims.fontSize,
        fontFamily: 5,
        textAlign: "center",
        verticalAlign: "middle",
        containerId: rectId,
        originalText: labelText,
        autoResize: true,
        isDeleted: false,
        groupIds: [],
        locked: false,
        version: 1,
      });
    }

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

      const sDims = dimsMap.get(t.node.id) ?? NODE_DIMS[t.node.depth] ?? NODE_DIMS[3];
      const cDims = dimsMap.get(child.node.id) ?? NODE_DIMS[child.node.depth] ?? NODE_DIMS[3];

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

  return { elements, posMap, dimsMap };
}

const VIDEO_CARD_WIDTH = 200;
const VIDEO_THUMB_HEIGHT = 112;
const VIDEO_CARD_PADDING = 6;
const VIDEO_CARD_GAP = 40;
const VIDEO_TITLE_FONT_SIZE = 12;
const VIDEO_TITLE_HEIGHT = VIDEO_TITLE_FONT_SIZE * 2;
const VIDEO_CARD_TOTAL_HEIGHT =
  VIDEO_CARD_PADDING + VIDEO_THUMB_HEIGHT + VIDEO_CARD_PADDING + VIDEO_TITLE_HEIGHT + VIDEO_CARD_PADDING;
const VIDEO_CARD_OUTER_WIDTH = VIDEO_CARD_WIDTH + VIDEO_CARD_PADDING * 2;
const VIDEO_TITLE_MAX_CHARS = 50;

export interface VideoCardInput {
  nodeId: string;
  result: YouTubeResult;
}

export function buildVideoCardElements(
  cards: VideoCardInput[],
  posMap: Map<string, { x: number; y: number }>,
  dimsMap: Map<string, { width: number; height: number }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { elements: any[]; files: Record<string, any> } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files: Record<string, any> = {};

  for (const { nodeId, result } of cards) {
    const pos = posMap.get(nodeId);
    const dims = dimsMap.get(nodeId);
    if (!pos || !dims) continue;

    const onRightHalf = pos.x >= 0;
    const rectX = onRightHalf
      ? pos.x - dims.width / 2 - VIDEO_CARD_GAP - VIDEO_CARD_OUTER_WIDTH
      : pos.x + dims.width / 2 + VIDEO_CARD_GAP;
    const rectY = pos.y - VIDEO_CARD_TOTAL_HEIGHT / 2;

    const groupId = randomId();
    const rectId = randomId();
    const imageId = randomId();
    const textId = randomId();

    elements.push({
      id: rectId,
      type: "rectangle",
      x: rectX,
      y: rectY,
      width: VIDEO_CARD_OUTER_WIDTH,
      height: VIDEO_CARD_TOTAL_HEIGHT,
      strokeColor: "#d4d4d8",
      backgroundColor: "#ffffff",
      fillStyle: "solid",
      roughness: 0,
      opacity: 100,
      roundness: { type: 3 },
      boundElements: [
        { id: imageId, type: "image" },
        { id: textId, type: "text" },
      ],
      isDeleted: false,
      groupIds: [groupId],
      locked: false,
      version: 1,
    });

    const fileId = randomId();
    files[fileId] = {
      mimeType: "image/jpeg",
      id: fileId,
      dataURL: result.thumbnail,
      created: Date.now(),
    };

    elements.push({
      id: imageId,
      type: "image",
      x: rectX + VIDEO_CARD_PADDING,
      y: rectY + VIDEO_CARD_PADDING,
      width: VIDEO_CARD_WIDTH,
      height: VIDEO_THUMB_HEIGHT,
      fileId,
      status: "saved",
      link: `https://youtube.com/watch?v=${result.videoId}`,
      opacity: 100,
      roundness: { type: 3 },
      isDeleted: false,
      groupIds: [groupId],
      locked: false,
      version: 1,
    });

    const truncatedTitle =
      result.title.length > VIDEO_TITLE_MAX_CHARS
        ? result.title.slice(0, VIDEO_TITLE_MAX_CHARS) + "..."
        : result.title;

    elements.push({
      id: textId,
      type: "text",
      x: rectX + VIDEO_CARD_PADDING,
      y: rectY + VIDEO_CARD_PADDING + VIDEO_THUMB_HEIGHT + VIDEO_CARD_PADDING,
      width: VIDEO_CARD_WIDTH,
      height: VIDEO_TITLE_HEIGHT,
      text: truncatedTitle,
      fontSize: VIDEO_TITLE_FONT_SIZE,
      fontFamily: 6,
      textAlign: "left",
      verticalAlign: "top",
      containerId: rectId,
      originalText: truncatedTitle,
      autoResize: true,
      isDeleted: false,
      groupIds: [groupId],
      locked: false,
      version: 1,
    });
  }

  return { elements, files };
}
