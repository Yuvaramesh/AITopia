import * as React from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  onThemeChange,
  ...props
}) {
  const [theme, setTheme] = React.useState(
    () => (localStorage.getItem("ui-theme")) || defaultTheme
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme) => {
        localStorage.setItem("ui-theme", newTheme);
        setTheme(newTheme);
        if (onThemeChange) {
          onThemeChange(newTheme);
        }
      },
    }),
    [theme, onThemeChange]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
