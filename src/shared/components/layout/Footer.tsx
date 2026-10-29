import { APP_NAME } from '@/shared/lib/constants';

export function Footer() {
  return (
    <footer className="border-t mt-16 py-8 bg-muted/30">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}