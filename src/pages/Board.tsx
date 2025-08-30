import { Layout } from "@/components/Layout";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Board() {
  return (
    <Layout>
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Project Board</h1>
          <p className="text-muted-foreground">Manage and track your team's work with drag-and-drop simplicity</p>
        </div>
        <KanbanBoard />
      </div>
    </Layout>
  );
}