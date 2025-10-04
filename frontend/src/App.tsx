import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import ProtectedRoute from "./protectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute requireAuth={true}>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute requireAuth={true}>
                  <Home />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
