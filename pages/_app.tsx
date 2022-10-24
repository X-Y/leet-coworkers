import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

import "../styles/globals.css";
import SortContextProvider from "../contexts/SortContext/SortContextProvider";
import FilterContextProvider from "../contexts/FilterContext/FilterContextProvider";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SortContextProvider>
          <FilterContextProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
              <Component {...pageProps} />
            </MantineProvider>
          </FilterContextProvider>
        </SortContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
