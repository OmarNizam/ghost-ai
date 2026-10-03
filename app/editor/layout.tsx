import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";

export default async function EditorLayout({ children }: LayoutProps<"/editor">) {
  await auth.protect();

  return <EditorShell>{children}</EditorShell>;
}
