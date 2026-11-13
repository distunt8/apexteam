import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SessionGate } from "@/components/auth-gate";
import { THEME_BOOT, ThemeProvider, useTheme } from "@/lib/theme";
import { EasterEggs } from "@/components/easter-eggs";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Апекс — платформа вовлечённости" },
      {
        name: "description",
        content: "Корпоративная платформа: апексы, благодарности, активности и каталог наград.",
      },
      { name: "theme-color", content: "#306CC0" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <PreviewHostBridge />
          <AuthProvider>
            <SessionGate>
              <Outlet />
            </SessionGate>
          </AuthProvider>
          <ThemedToaster />
          <EasterEggs />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

function ThemedToaster() {
  const { resolved } = useTheme();
  return <Toaster position="top-center" richColors closeButton theme={resolved} />;
}
