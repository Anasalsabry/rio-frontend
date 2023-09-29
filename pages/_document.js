import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { darkTheme } from "@/components/theme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={darkTheme.palette.primary.main} />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
