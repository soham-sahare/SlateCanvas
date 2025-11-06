"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const applyTheme = (targetTheme: Theme) => {
      setTheme(targetTheme);
      document.documentElement.classList.toggle("dark", targetTheme === "dark");
    };

    const storedTheme = localStorage.getItem("slatecanvas-theme") as Theme | null;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme(mediaQuery.matches ? "dark" : "light");
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("slatecanvas-theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem("slatecanvas-theme", newTheme);
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    },
  };

  if (!mounted) {
    // Avoid hydration mismatch by rendering nothing or a layout without theme-specifics
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
