import { Sidebar } from "@/components/Sidebar";

const Alma = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 bg-background overflow-y-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Anotações</h1>
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          <p>Conteúdo de Anotações em breve...</p>
        </div>
      </main>
    </div>
  );
};

export default Alma;
