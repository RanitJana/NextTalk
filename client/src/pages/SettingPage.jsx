import React from "react";
import { THEMES } from "../constants/theme.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { useNavigate } from "react-router-dom";
import { Palette, Moon, Sun, Check, ArrowLeft } from "lucide-react";

const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-sm text-primary hover:underline gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Appearance</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Customize how NextTalk looks on your device
            </p>
          </div>
        </div>

        {/* Theme Selection */}
        {/* <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            {theme.includes('dark') ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            )}
            <h2 className="text-base sm:text-lg font-semibold">Theme Colors</h2>
          </div>
          
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3
                  ${theme === t 
                    ? 'border-primary ring-1 sm:ring-2 ring-primary/20 bg-primary/5' 
                    : 'border-border hover:border-primary/30 hover:bg-accent/5'
                  }`}
              >
               
                <div 
                  className="relative h-12 sm:h-16 w-full rounded-md sm:rounded-lg overflow-hidden shadow-xs sm:shadow-sm"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1 sm:p-1.5">
                    <div className="rounded-xs sm:rounded-sm bg-primary"></div>
                    <div className="rounded-xs sm:rounded-sm bg-secondary"></div>
                    <div className="rounded-xs sm:rounded-sm bg-accent"></div>
                    <div className="rounded-xs sm:rounded-sm bg-neutral"></div>
                  </div>
                  {theme === t && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  )}
                </div>
                
                
                <span className="text-xs sm:text-sm font-medium capitalize truncate w-full px-1 text-center">
                  {t.replace('-', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Light/Dark Mode Toggle */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            {theme.includes("dark") ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            Color Scheme
          </h2>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setTheme(theme.includes("dark") ? "light" : theme)}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm
                ${theme.includes("light")
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent/5"
                }`}
            >
              <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
              Light
            </button>
            <button
              onClick={() => setTheme(theme.includes("light") ? "dark" : theme)}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm
                ${theme.includes("dark")
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent/5"
                }`}
            >
              <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
