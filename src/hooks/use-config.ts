import type { AppConfig, MarginPreset, Orientation, PageSize, ThemePreset } from "@/types/config";
import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS } from "@/types/config";
import { useCallback, useEffect, useState } from "react";

const defaultConfig: AppConfig = {
  page: {
    size: "a4",
    width: PAGE_SIZES.a4.width,
    height: PAGE_SIZES.a4.height,
    orientation: "portrait",
    padding: "20mm",
    margin: {
      top: "0mm",
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  },
  typography: {
    headings: "Montserrat",
    body: "Open Sans",
    code: "Fira Code",
    quote: "Merriweather",
    baseSize: 14,
    h1Size: 28,
    h2Size: 22,
    h3Size: 18,
    lineHeight: 1.6,
  },
  editor: {
    theme: "auto",
    fontSize: 14,
    wordWrap: "on",
    minimap: false,
    lineNumbers: "on",
  },
  theme: THEME_PRESETS.classic,
};

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("md-to-pdf-config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Garante que o tema existe, senão aplica o padrão
          if (!parsed.theme) {
            parsed.theme = THEME_PRESETS.classic;
          }
          return { ...defaultConfig, ...parsed };
        } catch {
          return defaultConfig;
        }
      }
    }
    return defaultConfig;
  });

  // Garante que o tema sempre existe
  useEffect(() => {
    if (!config.theme) {
      setConfig((prev) => ({
        ...prev,
        theme: THEME_PRESETS.classic,
      }));
    }
  }, [config.theme]);

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("md-to-pdf-config", JSON.stringify(newConfig));
      }
      return newConfig;
    });
  }, []);

  const updatePageSize = useCallback(
    (size: PageSize) => {
      const pageSize = PAGE_SIZES[size];
      setConfig((prev) => {
        const newConfig = {
          ...prev,
          page: {
            ...prev.page,
            size,
            width: pageSize.width,
            height: pageSize.height,
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("md-to-pdf-config", JSON.stringify(newConfig));
        }
        return newConfig;
      });
    },
    []
  );

  const updateOrientation = useCallback((orientation: Orientation) => {
    setConfig((prev) => {
      const isLandscape = orientation === "landscape";
      const width = isLandscape ? prev.page.height : prev.page.width;
      const height = isLandscape ? prev.page.width : prev.page.height;

      const newConfig = {
        ...prev,
        page: {
          ...prev.page,
          orientation,
          width,
          height,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("md-to-pdf-config", JSON.stringify(newConfig));
      }
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    if (typeof window !== "undefined") {
      localStorage.removeItem("md-to-pdf-config");
    }
  }, []);

  const applyMarginPreset = useCallback((preset: MarginPreset) => {
    if (preset === "custom") return;

    const marginPreset = MARGIN_PRESETS[preset];
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        page: {
          ...prev.page,
          margin: { ...marginPreset.margin },
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("md-to-pdf-config", JSON.stringify(newConfig));
      }
      return newConfig;
    });
  }, []);

  const applyThemePreset = useCallback((preset: ThemePreset) => {
    if (preset === "custom") return;

    const themePreset = THEME_PRESETS[preset];
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        theme: {
          name: themePreset.name,
          background: themePreset.background,
          textColor: themePreset.textColor,
          headingColor: themePreset.headingColor,
          codeBackground: themePreset.codeBackground,
          codeTextColor: themePreset.codeTextColor,
          linkColor: themePreset.linkColor,
          borderColor: themePreset.borderColor,
          blockquoteColor: themePreset.blockquoteColor,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("md-to-pdf-config", JSON.stringify(newConfig));
      }
      return newConfig;
    });
  }, []);

  return {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    resetConfig,
    applyMarginPreset,
    applyThemePreset,
  };
}

