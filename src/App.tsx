import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./contexts/sidebar-context";
import { SettingsProvider } from "./contexts/settings-context";
import { ScaleWrapper } from "./components/scale-wrapper";
import { AppRouter } from "./app-router";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dashboard-theme">
      <SettingsProvider>
        <SidebarProvider>
          <ScaleWrapper>
            <AppRouter />
          </ScaleWrapper>
        </SidebarProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
