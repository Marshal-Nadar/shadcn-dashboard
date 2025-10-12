import { useSettings } from "@/contexts/settings-context";

export function ScaleWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  return <div className="scale-content">{children}</div>;
}
