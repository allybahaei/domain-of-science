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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notebook = getNotebooks().find((n) => n.id === id);
  if (!id || !notebook) {
    return (
      <div className="p-12 text-center">
        <p>Notebook not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const savedScene = getScene(id);
  const initialData = savedScene
    ? {
        elements: savedScene.elements,
        appState: { ...savedScene.appState, collaborators: [] },
        files: savedScene.files || {},
      }
    : undefined;

  const shouldFitView = !savedScene?.appState?.zoom;

  const handleChange = useCallback(() => {
    if (!apiRef.current) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const elements = apiRef.current!.getSceneElements();
      const appState = apiRef.current!.getAppState();
      const files = apiRef.current!.getFiles();
      saveScene(id, {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          zoom: appState.zoom,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
        },
        files,
      });
    }, 400);
  }, [id]);

  return (
    <div className="w-screen h-screen">
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
          if (shouldFitView) {
            setTimeout(() => {
              api.scrollToContent(api.getSceneElements(), {
                fitToViewport: true,
                viewportZoomFactor: 0.85,
              });
            }, 300);
          }
        }}
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
