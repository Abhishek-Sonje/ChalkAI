"use client";

import { useCallback, useEffect, useRef } from "react";
import { Tldraw, Editor, AssetRecordType, createShapeId, TLShapeId, Box } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { getTldrawLicenseKey } from "@/lib/tldraw-license";
import { applySnapshot, takePersistableSnapshot } from "@/lib/example-sketches";

interface WhiteboardProps {
  onExportReady: (exportFn: () => Promise<string | null>) => void;
  generatedImage: string | null;
  onAcceptSuggestion: () => void;
  onBindAccept?: (accept: (() => void) | null) => void;
  onDrawingActivity?: () => void;
  licenseKey?: string;
  snapshot?: unknown;
  onSnapshot?: (snapshot: unknown, opts?: { immediate?: boolean }) => void;
  onEditor?: (editor: Editor) => void;
  readOnly?: boolean;
}

interface ExportContext {
  shapeIds: TLShapeId[];
  bounds: Box;
}

function unionShapeBounds(editor: Editor, ids: TLShapeId[]): Box | null {
  let combined: Box | null = null;
  for (const id of ids) {
    const shapeBounds = editor.getShapePageBounds(id);
    if (!shapeBounds) continue;
    combined = combined ? combined.expand(shapeBounds) : shapeBounds.clone();
  }
  return combined;
}

export function Whiteboard({
  onExportReady,
  generatedImage,
  onAcceptSuggestion,
  onBindAccept,
  onDrawingActivity,
  licenseKey,
  snapshot,
  onSnapshot,
  onEditor,
  readOnly = false,
}: WhiteboardProps) {
  const editorRef = useRef<Editor | null>(null);
  const exportContextRef = useRef<ExportContext | null>(null);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;
  const generatedImageRef = useRef(generatedImage);
  generatedImageRef.current = generatedImage;
  const onAcceptSuggestionRef = useRef(onAcceptSuggestion);
  onAcceptSuggestionRef.current = onAcceptSuggestion;
  const placingRef = useRef(false);

  const persistNow = useCallback(async (editor: Editor) => {
    const snap = await takePersistableSnapshot(editor);
    onSnapshotRef.current?.(snap, { immediate: true });
  }, []);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      onEditor?.(editor);

      if (snapshotRef.current) {
        applySnapshot(editor, snapshotRef.current);
      }

      if (readOnly) {
        editor.updateInstanceState({ isReadonly: true });
      }

      if (onDrawingActivity) {
        editor.store.listen((entry) => {
          const hasShapeChanges =
            Object.keys(entry.changes.added).some((k) => k.startsWith("shape:")) ||
            Object.keys(entry.changes.updated).some((k) => k.startsWith("shape:"));

          if (hasShapeChanges) {
            onDrawingActivity();
          }
        }, { source: "user", scope: "document" });
      }

      if (onSnapshotRef.current && !readOnly) {
        editor.store.listen(() => {
          void takePersistableSnapshot(editor).then((snap) => {
            onSnapshotRef.current?.(snap);
          });
        }, { scope: "document" });
      }

      const exportCanvas = async (): Promise<string | null> => {
        const selectedIds = editor.getSelectedShapeIds();
        const allIds = Array.from(editor.getCurrentPageShapeIds());
        const sketchIds = allIds.filter((id) => editor.getShape(id)?.type !== "image");
        const idsToExport: TLShapeId[] =
          selectedIds.length > 0
            ? [...selectedIds]
            : sketchIds.length > 0
              ? sketchIds
              : allIds;

        if (!idsToExport.length) return null;

        const combinedBounds = unionShapeBounds(editor, idsToExport);
        if (!combinedBounds) return null;

        exportContextRef.current = {
          shapeIds: idsToExport,
          bounds: combinedBounds,
        };

        const result = await editor.toImage(idsToExport, {
          format: "png",
          background: true,
          scale: 2,
        });

        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(result.blob);
        });
      };

      onExportReady(exportCanvas);
    },
    [onExportReady, onDrawingActivity, onEditor, readOnly]
  );

  const placeGeneratedImage = useCallback(async () => {
    const editor = editorRef.current;
    const image = generatedImageRef.current;
    if (!editor || !image || placingRef.current) return;
    placingRef.current = true;

    const context = exportContextRef.current;
    const dataUrl = `data:image/png;base64,${image}`;

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Failed to load generated image"));
        el.src = dataUrl;
      });

      const width = img.width || 800;
      const height = img.height || 600;
      const sourceIds = context?.shapeIds.length
        ? context.shapeIds
        : Array.from(editor.getCurrentPageShapeIds());
      const sketchIds = sourceIds.filter((id) => editor.getShape(id)?.type !== "image");
      const sketchBounds = unionShapeBounds(editor, sketchIds);
      const targetBounds =
        sketchBounds || context?.bounds || editor.getViewportPageBounds();
      const scale = Math.min(targetBounds.w / width, targetBounds.h / height, 1);
      const w = width * scale;
      const h = height * scale;
      let x = targetBounds.x + targetBounds.w / 2 - w / 2;
      let y = targetBounds.y + targetBounds.h / 2 - h / 2;
      if (!sketchIds.length) {
        const pageBounds = editor.getCurrentPageBounds();
        x = (pageBounds ? pageBounds.x + pageBounds.w : targetBounds.x + targetBounds.w) + 40;
        y = pageBounds?.y ?? targetBounds.y;
      }
      const assetId = AssetRecordType.createId();
      const shapeId = createShapeId();

      const apply = () => {
        if (sketchIds.length) editor.deleteShapes(sketchIds);
        editor.createAssets([
          {
            id: assetId,
            type: "image",
            typeName: "asset",
            props: {
              name: "ai-generated.png",
              src: dataUrl,
              w: width,
              h: height,
              mimeType: "image/png",
              isAnimated: false,
            },
            meta: {},
          },
        ]);
        editor.createShape({
          id: shapeId,
          type: "image",
          x,
          y,
          props: {
            w,
            h,
            assetId,
          },
        });
      };

      const runner = editor as Editor & { run?: (fn: () => void) => void };
      if (typeof runner.run === "function") runner.run(apply);
      else apply();

      exportContextRef.current = null;
      await persistNow(editor);
      onAcceptSuggestionRef.current();
    } catch (err) {
      console.error(err);
    } finally {
      placingRef.current = false;
    }
  }, [persistNow]);

  useEffect(() => {
    onBindAccept?.(placeGeneratedImage);
    return () => onBindAccept?.(null);
  }, [onBindAccept, placeGeneratedImage]);

  useEffect(() => {
    if (!generatedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      void placeGeneratedImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatedImage, placeGeneratedImage]);

  return (
    <div className="absolute inset-0">
      <Tldraw
        onMount={handleMount}
        licenseKey={getTldrawLicenseKey(licenseKey)}
        hideUi={readOnly}
      />
    </div>
  );
}
