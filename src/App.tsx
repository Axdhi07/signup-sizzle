
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import About from "./pages/About";
import CreatePlan from "./pages/CreatePlan";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Teams from "./pages/Teams";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import ProfileEdit from "./pages/ProfileEdit";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/shop"
            element={
              <MainLayout>
                <Shop />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <About />
              </MainLayout>
            }
          />
          <Route
            path="/create-plan"
            element={
              <MainLayout>
                <CreatePlan />
              </MainLayout>
            }
          />
          <Route
            path="/teams"
            element={
              <MainLayout>
                <Teams />
              </MainLayout>
            }
          />
          <Route
            path="/achievements"
            element={
              <MainLayout>
                <Achievements />
              </MainLayout>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <MainLayout>
                <Leaderboard />
              </MainLayout>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <MainLayout>
                <ProfileEdit />
              </MainLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
