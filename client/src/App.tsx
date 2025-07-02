import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing-new";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard-new";
import Appointments from "@/pages/appointments-new";
import Customers from "@/pages/customers-new";
import Services from "@/pages/services-new";
import Settings from "@/pages/settings-new";
import PublicBooking from "@/pages/public-booking";
import NotFound from "@/pages/not-found";
import AnalyticsPage from "./pages/analytics";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/book/:slug" component={PublicBooking} />

      {/* Protected routes */}
      {isAuthenticated ? (
        <>
          {/* Check if user needs onboarding */}
          {!user?.businessName ? (
            <Route path="/" component={Onboarding} />
          ) : (
            <>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/appointments" component={Appointments} />
              <Route path="/customers" component={Customers} />
              <Route path="/services" component={Services} />
              <Route path="/settings" component={Settings} />
              <Route path="/analytics" component={AnalyticsPage} />
            </>
          )}
        </>
      ) : (
        <Route path="/" component={Landing} />
      )}

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
