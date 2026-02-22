export default function useEventTheme(theme) {
  const layoutClass = `layout-${theme?.layout || "minimal"}`;
  const animationType = theme?.animation || "none";

  const styleVars = {
    "--primary": theme?.primaryColor || "#3b82f6",
    "--bg-color": theme?.backgroundColor || "#0a0a0a",
    "--text-color": theme?.textColor || "#ffffff",
  };

  return { layoutClass, animationType, styleVars };
}