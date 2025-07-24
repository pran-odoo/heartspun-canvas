import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Memories from "./pages/Memories";
import Music from "./pages/Music";
import Timeline from "./pages/Timeline";
import Personalization from "./pages/Personalization";
import Surprises from "./pages/Surprises";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { NavigationProvider } from "./contexts/NavigationContext";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/music" element={<Music />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/personalization" element={<Personalization />} />
        <Route path="/surprises" element={<Surprises />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationProvider>
            <AnimatedRoutes />
          </NavigationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
