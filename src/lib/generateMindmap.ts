import Anthropic from "@anthropic-ai/sdk";

export interface MindmapNode {
  id: string;
  parentId: string | null;
  label: string;
  depth: number;
  bullets?: string[];
}

export interface VideoSuggestion {
  nodeId: string;
  searchQuery: string;
}

export interface MindmapData {
  title: string;
  nodes: MindmapNode[];
  videos?: VideoSuggestion[];
}

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateMindmap(topic: string): Promise<MindmapData> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `You are a mind-map generator. Given a topic, return ONLY a JSON object with no markdown, no backticks, no explanation. The JSON must match this exact structure:
{
  "title": "Topic Name",
  "nodes": [
    { "id": "1", "parentId": null, "label": "Main Topic", "depth": 0 },
    { "id": "2", "parentId": "1", "label": "Subtopic", "depth": 1 },
    { "id": "3", "parentId": "2", "label": "Leaf Node", "depth": 2, "bullets": ["Key point one", "Key point two", "Key point three"] }
  ],
  "videos": [
    { "nodeId": "3", "searchQuery": "leaf node topic explained" }
  ]
}
Rules:
- Generate 20-30 nodes
- Maximum depth is 3 (depths 0, 1, 2, 3)
- Each label must be 2-5 words
- There must be exactly one root node with parentId null and depth 0
- Every non-root node must reference a valid parentId
- Leaf nodes (nodes that have NO children) MUST include a "bullets" array with 2-4 short bullet points (each 3-8 words) that elaborate on that leaf's topic
- Non-leaf nodes must NOT include bullets
- Also return a "videos" array. Only include LEAF nodes (nodes with no children) where a YouTube video would genuinely help the user learn more — not every leaf, only where video explanation adds real value (e.g. complex processes, visual concepts, tutorials). Never include non-leaf nodes. For each, return: { "nodeId": "<id of relevant leaf node>", "searchQuery": "<specific YouTube search query to find the best video on that subtopic>" }
- Output raw JSON only, no surrounding text`,
    messages: [
      { role: "user", content: `Generate a mind map for the topic: ${topic}` },
    ],
  });

  const text = response.content[0];
  if (text.type !== "text") {
    throw new Error("Unexpected response type from Anthropic API");
  }

  return JSON.parse(text.text) as MindmapData;
}
