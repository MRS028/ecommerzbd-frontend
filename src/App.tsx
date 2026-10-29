import { AppProvider } from "./app/providers/AppProvider";
import { AppRouter } from "./app/router/AppRouter";


export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}