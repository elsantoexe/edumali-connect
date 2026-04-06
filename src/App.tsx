import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages existantes
import Index           from "./pages/Index";
import Ressources      from "./pages/Ressources";
import RessourceDetail from "./pages/RessourceDetail";
import Forum           from "./pages/Forum";
import ForumDetail     from "./pages/ForumDetail";
import Orientation     from "./pages/Orientation";
import OrientationDetail from "./pages/OrientationDetail";
import Calendrier      from "./pages/Calendrier";
import Premium         from "./pages/Premium";
import Compte          from "./pages/Compte";
import Connexion       from "./pages/Connexion";
import Inscription     from "./pages/Inscription";
import NotFound        from "./pages/NotFound";

// Nouvelles pages
import RessourcesPartager from "./pages/RessourcesPartager";
import Formations         from "./pages/Formations";
import FormationDetail    from "./pages/FormationDetail";
import FormationCreer     from "./pages/FormationCreer";
import Chat               from "./pages/Chat";
import Profil             from "./pages/Profil";
import Formateur          from "./pages/Formateur";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Accueil */}
            <Route path="/"                         element={<Index />} />

            {/* Ressources P2P */}
            <Route path="/ressources"               element={<Ressources />} />
            <Route path="/ressources/partager"      element={<RessourcesPartager />} />
            <Route path="/ressources/:id"           element={<RessourceDetail />} />

            {/* Formations marketplace */}
            <Route path="/formations"               element={<Formations />} />
            <Route path="/formations/creer"         element={<FormationCreer />} />
            <Route path="/formations/:id"           element={<FormationDetail />} />

            {/* Forum */}
            <Route path="/forum"                    element={<Forum />} />
            <Route path="/forum/:id"                element={<ForumDetail />} />

            {/* Orientation & Calendrier */}
            <Route path="/orientation"              element={<Orientation />} />
            <Route path="/orientation/:id"          element={<OrientationDetail />} />
            <Route path="/calendrier"               element={<Calendrier />} />

            {/* Social */}
            <Route path="/chat"                     element={<Chat />} />
            <Route path="/profil/:username"         element={<Profil />} />

            {/* Compte & Auth */}
            <Route path="/compte"                   element={<Compte />} />
            <Route path="/connexion"                element={<Connexion />} />
            <Route path="/inscription"              element={<Inscription />} />

            {/* Premium & Formateur */}
            <Route path="/premium"                  element={<Premium />} />
            <Route path="/formateur"                element={<Formateur />} />

            {/* 404 */}
            <Route path="*"                         element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
