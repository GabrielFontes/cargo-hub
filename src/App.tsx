import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Mente from "./pages/Mente";
//import MenteDRE from "./pages/MenteDRE";
import Corpo from "./pages/Corpo";
import CorpoCargos from "./pages/CorpoCargos";
import Alma from "./pages/Alma";
import Indicadores from "./pages/Indicadores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/mente" replace />} />
          {/* Mente routes */}
          <Route path="/mente" element={<Mente />} />
          {/* Corpo routes */}
          <Route path="/corpo" element={<Corpo />} />
          <Route path="/corpo/cargos" element={<CorpoCargos />} />
          <Route path="/corpo/indicadores" element={<Indicadores />} />
          {/* Alma routes */}
          <Route path="/alma" element={<Alma />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
