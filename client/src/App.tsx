import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatWidget from "./components/ChatWidget";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import SolarPackages from "./pages/SolarPackages";
import SolarPlannerPage from "./pages/SolarPlannerPage";
import CommercialSolarSizingPage from "./pages/CommercialSolarSizingPage";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";

const servicePaths = [
  "/solar-installation-ondo-city",
  "/solar-installation-ondo-state",
  "/inverter-lithium-battery-installation",
  "/cctv-installation-ondo",
  "/smart-home-automation",
] as const;

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {servicePaths.map(path => (
        <Route path={path} key={path}>
          <ServicePage path={path} />
        </Route>
      ))}
      <Route path="/solar-packages" component={SolarPackages} />
      <Route path="/solar-planner" component={SolarPlannerPage} />
      <Route path="/commercial-solar-sizing" component={CommercialSolarSizingPage} />
      <Route path="/projects" component={Projects} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export type AppProps = {
  ssrPath?: string;
};

function App({ ssrPath }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <WouterRouter ssrPath={ssrPath}>
            <AppRoutes />
          </WouterRouter>
          <ChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
