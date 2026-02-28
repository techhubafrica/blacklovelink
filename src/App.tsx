import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProfileCreationPage from "./pages/ProfileCreationPage";
import PermissionsPage from "./pages/PermissionsPage";
import SwipePage from "./pages/SwipePage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import EducationPage from "./pages/EducationPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import TrustSafetyPage from "./pages/TrustSafetyPage";
import SupportPage from "./pages/SupportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/trust-safety" element={<TrustSafetyPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Onboarding routes (accessible after auth flow, not strictly gated) */}
            <Route path="/create-profile" element={<ProfileCreationPage />} />
            <Route path="/permissions" element={<PermissionsPage />} />

            {/* App routes (auth required) */}
            <Route
              path="/swipe"
              element={
                <ProtectedRoute>
                  <SwipePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <ConnectionsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
