import { createContext, useContext, useState, ReactNode } from "react";

interface Settings {
  scale: "xs" | "sm" | "md" | "lg" | "xl";
  radius: "none" | "sm" | "md" | "lg" | "xl";
  themePreset: "forest" | "ocean" | "sunset" | "midnight";
  contentLayout: "full" | "centered";
  sidebarMode: "default" | "icon";
  compactMode: boolean;
  animations: boolean;
  rtlMode: boolean;
}

const defaultSettings: Settings = {
  scale: "md",
  radius: "md",
  themePreset: "ocean",
  contentLayout: "full",
  sidebarMode: "default",
  compactMode: false,
  animations: true,
  rtlMode: false,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("dashboard-settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("dashboard-settings", JSON.stringify(newSettings));

    // Apply settings to document
    applySettingsToDocument(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("dashboard-settings", JSON.stringify(defaultSettings));
    applySettingsToDocument(defaultSettings);
  };

  const applySettingsToDocument = (newSettings: Settings) => {
    const root = document.documentElement;

    // Apply scale
    root.style.setProperty("--scale-factor", getScaleValue(newSettings.scale));

    // Apply radius
    root.style.setProperty("--radius", getRadiusValue(newSettings.radius));

    // Apply theme preset colors
    applyThemePreset(newSettings.themePreset);

    // Apply content layout
    if (newSettings.contentLayout === "centered") {
      root.classList.add("layout-centered");
    } else {
      root.classList.remove("layout-centered");
    }

    // Apply compact mode
    if (newSettings.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Apply RTL mode
    if (newSettings.rtlMode) {
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("dir", "ltr");
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Helper functions
const getScaleValue = (scale: Settings["scale"]): string => {
  const scaleMap = {
    xs: "0.75",
    sm: "0.875",
    md: "1",
    lg: "1.125",
    xl: "1.25",
  };
  return scaleMap[scale];
};

const getRadiusValue = (radius: Settings["radius"]): string => {
  const radiusMap = {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  };
  return radiusMap[radius];
};

const applyThemePreset = (preset: Settings["themePreset"]) => {
  const root = document.documentElement;

  // Remove existing preset classes
  root.classList.remove(
    "theme-forest",
    "theme-ocean",
    "theme-sunset",
    "theme-midnight"
  );

  // Add new preset class
  root.classList.add(`theme-${preset}`);
};
