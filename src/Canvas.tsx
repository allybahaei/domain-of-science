import { useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { getScene, saveScene, getNotebooks } from "./store";

export default function Canvas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const notebook = getNotebooks().find((n) => n.id === id);
  if (!id || !notebook) {
    return (
      <div style={{ padding: 48, fontFamily: "system-ui", textAlign: "center" }}>
        <p>Notebook not found.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const savedScene = getScene(id);
  const initialData = savedScene
    ? { elements: savedScene.elements, appState: { ...savedScene.appState, collaborators: [] } }
    : undefined;

  const handleChange = useCallback(() => {
    if (!apiRef.current) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const elements = apiRef.current!.getSceneElements();
      const appState = apiRef.current!.getAppState();
      saveScene(id, {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          zoom: appState.zoom,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
        },
      });
    }, 400);
  }, [id]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Excalidraw
        excalidrawAPI={(api) => { apiRef.current = api; }}
        initialData={initialData}
        onChange={handleChange}
      >
        <MainMenu>
          <MainMenu.Item onSelect={() => navigate("/")}>
            Back to Dashboard
          </MainMenu.Item>
          <MainMenu.Separator />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
