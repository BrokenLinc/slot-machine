import { Router } from './router';
import { ThemeProvider } from './theme';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
};
