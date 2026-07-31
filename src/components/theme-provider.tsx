"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        ...(props.scriptProps || {}),
        ...(isClient ? { type: "text/template" } : {}),
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
