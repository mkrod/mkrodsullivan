import { GlobalProvider } from "@/constants/provider/global.provider";
import { RouterProvider } from "@/constants/utilities/app.router";
import RootLayout from "@/layouts/root.layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import nProgress from "nprogress";
//@ts-ignore
import 'nprogress/nprogress.css';
import { ThemeProvider } from "@mui/material";
import { theme } from "@/constants/variables/global.vars";

export default function App({ Component, pageProps }: AppProps) {


  const router = useRouter();

  useEffect(() => {
    const handleStart = () => nProgress.start();
    const handleStop = () => nProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);


  return (
    <ThemeProvider theme={theme}>
      <RouterProvider>
        <GlobalProvider>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </GlobalProvider>
      </RouterProvider>
    </ThemeProvider>

  );
}
