import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Palette,
  Monitor,
  Layout,
  Sidebar,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useSidebar } from "@/contexts/sidebar-context";
import { useSettings } from "@/contexts/settings-context";

export function SettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { settings, updateSetting, resetSettings } = useSettings();

  const scaleOptions = [
    { id: "xs", label: "XS" },
    { id: "sm", label: "S" },
    { id: "md", label: "M" },
    { id: "lg", label: "L" },
    { id: "xl", label: "XL" },
  ] as const;

  const radiusOptions = [
    { id: "none", label: "None" },
    { id: "sm", label: "SM" },
    { id: "md", label: "MD" },
    { id: "lg", label: "LG" },
  ] as const;

  const themePresets = [
    { id: "forest" as const, name: "Forest", color: "bg-emerald-500" },
    { id: "ocean" as const, name: "Ocean", color: "bg-blue-500" },
    { id: "sunset" as const, name: "Sunset", color: "bg-orange-500" },
    { id: "midnight" as const, name: "Midnight", color: "bg-purple-500" },
  ];

  const handleThemePresetSelect = (
    presetId: (typeof themePresets)[number]["id"]
  ) => {
    updateSetting("themePreset", presetId);
  };

  const handleScaleSelect = (scale: (typeof scaleOptions)[number]["id"]) => {
    updateSetting("scale", scale);
  };

  const handleRadiusSelect = (radius: (typeof radiusOptions)[number]["id"]) => {
    updateSetting("radius", radius);
  };

  const handleSidebarModeSelect = (mode: "default" | "icon") => {
    updateSetting("sidebarMode", mode);
    if (mode === "icon" && isSidebarOpen) {
      toggleSidebar();
    } else if (mode === "default" && !isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Color Mode */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Label className="text-xs font-medium">Color mode</Label>
            <div className="flex gap-1 mt-2">
              {[
                { id: "light", name: "Light", icon: Sun },
                { id: "dark", name: "Dark", icon: Moon },
                { id: "system", name: "System", icon: Laptop },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.id}
                    variant={theme === mode.id ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => setTheme(mode.id as any)}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {mode.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Theme Preset */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Label className="text-xs font-medium">Theme preset</Label>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {themePresets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer"
                  onClick={() => handleThemePresetSelect(preset.id)}
                >
                  <div className={`w-3 h-3 rounded-full ${preset.color}`} />
                  <span className="text-xs">{preset.name}</span>
                  {settings.themePreset === preset.id && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Scale */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Label className="text-xs font-medium">Scale</Label>
            <div className="flex gap-1 mt-2">
              {scaleOptions.map((scale) => (
                <Button
                  key={scale.id}
                  variant={settings.scale === scale.id ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleScaleSelect(scale.id)}
                >
                  {scale.label}
                </Button>
              ))}
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Radius */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Label className="text-xs font-medium">Radius</Label>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {radiusOptions.map((radius) => (
                <Button
                  key={radius.id}
                  variant={
                    settings.radius === radius.id ? "default" : "outline"
                  }
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleRadiusSelect(radius.id)}
                >
                  {radius.label}
                </Button>
              ))}
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sidebar Mode */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <Label className="text-xs font-medium">Sidebar</Label>
            <div className="flex gap-1 mt-2">
              {[
                { id: "default", name: "Default", icon: Sidebar },
                { id: "icon", name: "Icon", icon: Layout },
              ].map((sidebar) => {
                const Icon = sidebar.icon;
                return (
                  <Button
                    key={sidebar.id}
                    variant={
                      settings.sidebarMode === sidebar.id
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleSidebarModeSelect(sidebar.id)}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {sidebar.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Additional Settings */}
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="dropdown-compact-mode"
                className="text-xs font-normal"
              >
                Compact mode
              </Label>
              <Switch
                id="dropdown-compact-mode"
                checked={settings.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting("compactMode", checked)
                }
                className="scale-75"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="dropdown-animations"
                className="text-xs font-normal"
              >
                Animations
              </Label>
              <Switch
                id="dropdown-animations"
                checked={settings.animations}
                onCheckedChange={(checked) =>
                  updateSetting("animations", checked)
                }
                className="scale-75"
              />
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Reset Button */}
        <DropdownMenuItem
          className="flex items-center justify-center p-2 text-center cursor-pointer"
          onClick={resetSettings}
        >
          <span className="text-xs">Reset to Default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
