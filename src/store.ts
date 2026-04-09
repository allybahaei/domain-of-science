export interface Notebook {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

const NOTEBOOKS_KEY = "exploreai_notebooks";
const SCENE_PREFIX = "exploreai_scene_";

function readNotebooks(): Notebook[] {
  try {
    return JSON.parse(localStorage.getItem(NOTEBOOKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeNotebooks(notebooks: Notebook[]) {
  localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebooks));
}

export function getNotebooks(): Notebook[] {
  return readNotebooks().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function createNotebook(title: string): Notebook {
  const notebook: Notebook = {
    id: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const all = readNotebooks();
  all.push(notebook);
  writeNotebooks(all);
  return notebook;
}

export function deleteNotebook(id: string) {
  writeNotebooks(readNotebooks().filter((n) => n.id !== id));
  localStorage.removeItem(SCENE_PREFIX + id);
}

export function renameNotebook(id: string, title: string) {
  const all = readNotebooks();
  const nb = all.find((n) => n.id === id);
  if (nb) {
    nb.title = title;
    nb.updatedAt = Date.now();
    writeNotebooks(all);
  }
}

export function getScene(id: string) {
  try {
    return JSON.parse(localStorage.getItem(SCENE_PREFIX + id) || "null");
  } catch {
    return null;
  }
}

export function saveScene(id: string, data: unknown) {
  localStorage.setItem(SCENE_PREFIX + id, JSON.stringify(data));
  const all = readNotebooks();
  const nb = all.find((n) => n.id === id);
  if (nb) {
    nb.updatedAt = Date.now();
    writeNotebooks(all);
  }
}
