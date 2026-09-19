"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function readTheme(): Theme { return document.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
function subscribeTheme(listener: () => void) { const observer=new MutationObserver(listener); observer.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]}); window.addEventListener("capsule-theme-change",listener); return () => { observer.disconnect(); window.removeEventListener("capsule-theme-change",listener); }; }
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("capsule-theme", next);
    } catch {}
    window.dispatchEvent(new Event("capsule-theme-change"));
  }

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className={cn(
        "capsule-button capsule-button-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      {theme === null ? null : dark ? <Sun className="h-4 w-4" strokeWidth={1.6} /> : <Moon className="h-4 w-4" strokeWidth={1.6} />}
    </button>
  );
}
