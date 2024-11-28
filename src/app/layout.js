"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistedStore } from "../slices/store";
import Layout from "../layout/page"; // Corrected import

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable} flex font-poppins items-center justify-center`}>
        <Provider store={store}>
          <PersistGate persistor={persistedStore}>
            <Layout>{children}</Layout>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
