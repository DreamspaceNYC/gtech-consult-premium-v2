import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";

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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
