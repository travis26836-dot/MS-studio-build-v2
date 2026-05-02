import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Clock, CreditCard, FileText, Loader2, Plus, UserRound } from "lucide-react";
import { useLocation } from "wouter";

function formatDate(value?: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AccountDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();
  const { data: subscription, isLoading: subscriptionLoading } = trpc.account.subscriptionStatus.useQuery();
  const savedProjects = projects ?? [];
  const plan = subscription?.plan ?? "free";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/95 px-6">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="flex items-center gap-3 text-left"
          >
            <img src="/icon-192.png" alt="ManuScript Studio logo" className="h-10 w-10 rounded-md bg-black object-contain" />
            <span className="text-sm font-semibold uppercase tracking-[0.12em]">ManuScript Studio</span>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>Workspace</Button>
            <Button size="sm" onClick={() => setLocation("/editor")}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Design
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Customer account</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage saved designs, account status, and the workspace content your customers need to access.
            </p>
          </div>
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Signed in" : "Local workspace"}
          </Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="h-4 w-4 text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{user?.name || "Local Studio User"}</p>
              <p className="text-muted-foreground">{user?.email || "Saved with this browser until sign-in is connected."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" />
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {subscriptionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="font-medium capitalize">{plan}</p>
                  <p className="text-muted-foreground">Subscription billing can be attached here when Stripe is finalized.</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Saved Designs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{savedProjects.length}</p>
              <p className="text-muted-foreground">Designs available from the editor and customer workspace.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Content Library</h2>
              <p className="mt-1 text-sm text-muted-foreground">Recently saved editor projects.</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/editor")}>Create content</Button>
          </div>

          {projectsLoading ? (
            <div className="flex justify-center rounded-lg border border-border py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : savedProjects.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {savedProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setLocation(`/editor?id=${project.id}&w=${project.canvasWidth}&h=${project.canvasHeight}`)}
                  className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
                >
                  <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-secondary">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.name} className="h-full w-full rounded-md object-cover" />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(project.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border py-14 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No saved content yet.</p>
              <Button className="mt-4" onClick={() => setLocation("/editor")}>
                <Plus className="mr-1.5 h-4 w-4" />
                Create your first design
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
