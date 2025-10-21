import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./contexts/sidebar-context";
import { SettingsProvider } from "./contexts/settings-context";
import { AuthProvider } from "./contexts/auth-context";
import { ScaleWrapper } from "./components/scale-wrapper";
import { AppRouter } from "./app-router";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dashboard-theme">
      <AuthProvider>
        <SettingsProvider>
          <SidebarProvider>
            <ScaleWrapper>
              <AppRouter />
            </ScaleWrapper>
          </SidebarProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
