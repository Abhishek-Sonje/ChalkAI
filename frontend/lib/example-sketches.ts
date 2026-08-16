import { createShapeId, type Editor } from "@tldraw/tldraw";

export function takeSnapshot(editor: Editor) {
  const anyEditor = editor as Editor & {
    getSnapshot?: () => unknown;
  };
  if (typeof anyEditor.getSnapshot === "function") {
    return anyEditor.getSnapshot();
  }
  return editor.store.getStoreSnapshot();
}

export function applySnapshot(editor: Editor, snapshot: unknown) {
  if (!snapshot) return;
  const anyEditor = editor as Editor & {
    loadSnapshot?: (snapshot: unknown) => void;
  };
  if (typeof anyEditor.loadSnapshot === "function") {
    anyEditor.loadSnapshot(snapshot);
    return;
  }
  editor.store.loadStoreSnapshot(snapshot as Parameters<typeof editor.store.loadStoreSnapshot>[0]);
}

async function blobUrlToDataUrl(blobUrl: string) {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Snapshot that keeps image bytes as data URLs so refresh / Mongo persist works. */
export async function takePersistableSnapshot(editor: Editor) {
  const raw = takeSnapshot(editor) as {
    document?: { store?: Record<string, { typeName?: string; props?: { src?: string | null } }> };
    store?: Record<string, { typeName?: string; props?: { src?: string | null } }>;
  };
  const cloned = JSON.parse(JSON.stringify(raw)) as typeof raw;
  const store = cloned.document?.store ?? cloned.store;
  if (store) {
    await Promise.all(
      Object.values(store).map(async (record) => {
        const src = record?.props?.src;
        if (typeof src === "string" && src.startsWith("blob:")) {
          try {
            record.props!.src = await blobUrlToDataUrl(src);
          } catch {
            // leave as-is; better a missing image than a failed save
          }
        }
      })
    );
  }
  if (cloned.document) return { document: cloned.document };
  return cloned;
}

export const EXAMPLE_SKETCHES = [
  {
    id: "triangle",
    title: "Geometry triangle",
    blurb: "A labeled right triangle to try AI cleanup.",
  },
  {
    id: "flowchart",
    title: "Simple flowchart",
    blurb: "Start → process → decision boxes.",
  },
] as const;

export type ExampleSketchId = (typeof EXAMPLE_SKETCHES)[number]["id"];

function toRichText(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  };
}

function geo(
  editor: Editor,
  x: number,
  y: number,
  props: { geo: string; w: number; h: number; text?: string; color?: string }
) {
  editor.createShape({
    id: createShapeId(),
    type: "geo",
    x,
    y,
    props: {
      geo: props.geo,
      w: props.w,
      h: props.h,
      color: props.color ?? "black",
      richText: toRichText(props.text ?? ""),
    },
  });
}

export function loadExampleSketch(editor: Editor, id: ExampleSketchId) {
  const apply = () => {
    const ids = Array.from(editor.getCurrentPageShapeIds());
    if (ids.length) editor.deleteShapes(ids);

    if (id === "triangle") {
      geo(editor, 220, 140, {
        geo: "triangle",
        w: 280,
        h: 240,
        text: "ABC",
      });
      editor.createShape({
        id: createShapeId(),
        type: "text",
        x: 250,
        y: 400,
        props: {
          richText: toRichText("Area = 1/2 × b × h"),
          autoSize: true,
          w: 280,
        },
      });
    } else {
      geo(editor, 180, 80, { geo: "rectangle", w: 200, h: 72, text: "Start", color: "blue" });
      geo(editor, 180, 220, { geo: "rectangle", w: 200, h: 72, text: "Teach a concept" });
      geo(editor, 180, 360, { geo: "diamond", w: 200, h: 96, text: "Clear?", color: "violet" });
    }

    const zoomable = editor as Editor & { zoomToFit?: (opts?: unknown) => void };
    zoomable.zoomToFit?.({ animation: { duration: 220 } });
  };

  const runner = editor as Editor & { run?: (fn: () => void) => void };
  if (typeof runner.run === "function") {
    runner.run(apply);
  } else {
    apply();
  }
}
