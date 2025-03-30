"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setIsChanging(true);
    setTimeout(() => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      setIsChanging(false);
    }, 300);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AnimatePresence>
        {isChanging && (
          <motion.div
            key="fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gray-900 dark:bg-gray-100 opacity-50 z-50"
          />
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
