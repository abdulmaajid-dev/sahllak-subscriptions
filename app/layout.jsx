import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/notifications/styles.css";
import { theme } from "../theme";

export const metadata = {
  title: "Sahllak Subscriptions",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="shortcut icon" href="/favicon.svg" />
        {/* Remove explicit viewport meta as Next.js handles this automatically */}
      </head>
      <body>
        <MantineProvider 
          theme={theme}
          defaultColorScheme="light"
          withCssVariables
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications position="top-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
