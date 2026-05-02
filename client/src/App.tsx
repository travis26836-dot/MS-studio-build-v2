import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { ClerkProvider, SignIn, SignUp } from "@clerk/react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import AccountDashboard from "./pages/AccountDashboard";
import ApiDocs from "./pages/ApiDocs";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RefundPolicyPage from "./pages/RefundPolicyPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const HAS_CLERK = Boolean(PUBLISHABLE_KEY);

function AuthUnavailable() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="max-w-md rounded-lg border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Sign-in is not configured</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add VITE_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to .env to enable Clerk accounts. Local editor saves still work with the browser workspace identity.
        </p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in">{() => (HAS_CLERK ? <div className="flex min-h-screen items-center justify-center"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /></div> : <AuthUnavailable />)}</Route>
      <Route path="/sign-in/:rest*">{() => (HAS_CLERK ? <div className="flex min-h-screen items-center justify-center"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /></div> : <AuthUnavailable />)}</Route>
      <Route path="/sign-up">{() => (HAS_CLERK ? <div className="flex min-h-screen items-center justify-center"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></div> : <AuthUnavailable />)}</Route>
      <Route path="/sign-up/:rest*">{() => (HAS_CLERK ? <div className="flex min-h-screen items-center justify-center"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></div> : <AuthUnavailable />)}</Route>
      <Route path="/editor" component={EditorPage} />
      <Route path="/account" component={AccountDashboard} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/refund-policy" component={RefundPolicyPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const app = (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );

  return (
    <ErrorBoundary>
      {HAS_CLERK ? <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>{app}</ClerkProvider> : app}
    </ErrorBoundary>
  );
}

export default App;
