import { Ghost, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const sampleComponents = [
  "API Gateway",
  "Auth Service",
  "User Service",
  "Project Service",
  "PostgreSQL",
  "Redis Cache",
  "Message Queue",
  "Spec Worker",
  "Blob Storage",
  "CDN",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <header className="flex items-center gap-2">
        <Ghost className="h-5 w-5 text-brand" aria-hidden />
        <h1 className="text-lg font-semibold text-copy-primary">Ghost AI</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>New project</CardTitle>
            <CardDescription>Describe the system you want to design.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Project name" aria-label="Project name" />
            <Textarea
              placeholder="A real-time chat app with presence and message history…"
              aria-label="System description"
            />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                <Plus className="h-5 w-5" aria-hidden />
                Template
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Import a template</DialogTitle>
                  <DialogDescription>
                    Start from a prebuilt system design and refine it on the canvas.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                  <Button>Import</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button>
              <Sparkles className="h-5 w-5" aria-hidden />
              Generate
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
            <CardDescription>Components and generated spec.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="components">
              <TabsList>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="spec">Spec</TabsTrigger>
              </TabsList>
              <TabsContent value="components">
                <ScrollArea className="h-40 rounded-xl border border-surface-border">
                  <ul className="flex flex-col p-2">
                    {sampleComponents.map((name) => (
                      <li
                        key={name}
                        className="rounded-xl px-2 py-1.5 text-sm text-copy-secondary"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="spec">
                <p className="text-sm text-copy-muted">
                  The <span className="text-copy-ai">AI-generated</span> technical
                  specification will appear here.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
