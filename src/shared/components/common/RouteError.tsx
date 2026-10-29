import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function RouteError() {
  const error = useRouteError();

  let title = 'Oops! Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} — ${error.statusText || 'Error'}`;
    message = error.data?.message || error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Link to="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
      {(import.meta.env as ImportMetaEnv & { DEV: boolean }).DEV && error instanceof Error && error.stack && (
        <pre className="mt-4 text-xs text-left text-muted-foreground bg-muted p-4 rounded-lg max-w-2xl overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
}