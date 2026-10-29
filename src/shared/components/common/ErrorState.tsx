export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-destructive">{message || 'Something went wrong.'}</p>
    </div>
  );
}