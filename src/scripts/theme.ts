const THEME_KEY = "theme";

type Theme = "light" | "dark";
type LegacyMediaQueryList = {
  addListener?: (listener: () => void) => void;
};

const root = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

const isTheme = (value: string | null): value is Theme => value === "light" || value === "dark";
const getSystemTheme = (): Theme => (colorScheme.matches ? "dark" : "light");

const readStoredTheme = (): Theme | null => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return isTheme(theme) ? theme : null;
  } catch {}

  return null;
};

const writeTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
};

const storedTheme = readStoredTheme();
let followsSystem = storedTheme === null;
let activeTheme = storedTheme ?? getSystemTheme();

const applyTheme = (theme: Theme) => {
  activeTheme = theme;
  root.dataset.theme = theme;
  themeColor?.setAttribute("content", theme === "dark" ? "#1a1a1a" : "#fcfcfc");

  if (!themeButton) return;

  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  const label = theme === "dark" ? "深色模式" : "浅色模式";
  themeButton.setAttribute("aria-label", label);
  themeButton.setAttribute("data-tooltip", label);
};

const syncSystemTheme = () => {
  if (followsSystem) applyTheme(getSystemTheme());
};

applyTheme(activeTheme);
themeButton?.addEventListener("click", () => {
  followsSystem = false;
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  writeTheme(nextTheme);
});

if (typeof colorScheme.addEventListener === "function") {
  colorScheme.addEventListener("change", syncSystemTheme);
} else {
  (colorScheme as unknown as LegacyMediaQueryList).addListener?.(syncSystemTheme);
}

export {};
