"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export interface ModeToggleProps {
  footer?: boolean;
}

export function ModeToggle({ footer }: ModeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sunClass = `h-[1.2rem] w-[1.2rem] ${
    theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
  } transition-all`;
  const moonClass = `absolute h-[1.2rem] w-[1.2rem] ${
    theme === "dark" ? "rotate-0 scale-100 text-black" : "rotate-90 scale-0"
  } transition-all`;

  return (
    <>
      {footer ? (
        <div className="flex flex-col items-center justify-center space-x-2 mt-4">
          <h1>Temayı Değiştir</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className={sunClass} />
            <Moon className={moonClass} />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="icon" className="bg-transparent dark:bg-transparent focus:bg-transparent" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          <Sun className={sunClass} />
          <Moon className={moonClass} />
        </Button>
      )}
    </>
  );
}
