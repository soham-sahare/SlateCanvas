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
    
    const storedTheme = localStorage.getItem("slatecanvas-theme") as Theme | null;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const targetTheme = storedTheme || (mediaQuery.matches ? "dark" : "light");
    setTheme(targetTheme);
    document.documentElement.classList.toggle("dark", targetTheme === "dark");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("slatecanvas-theme")) {
        const newSystemTheme = e.matches ? "dark" : "light";
        setTheme(newSystemTheme);
        document.documentElement.classList.toggle("dark", newSystemTheme === "dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    localStorage.setItem("slatecanvas-theme", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={{ theme: "light", setTheme: toggleTheme }}>
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: toggleTheme }}>
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
