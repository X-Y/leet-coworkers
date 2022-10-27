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
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme: "light",
                primaryShade: { light: 6, dark: 6 },
                colors: {
                  leetPurple: [
                    "#D8D8E6",
                    "#A9A9CE",
                    "#7C7CBF",
                    "#4F4FBA",
                    "#3333AB",
                    "#1E1E9D",
                    "#0C0C91",
                    "#14146B",
                    "#18184F",
                    "#18183C",
                  ],
                  leetGreen: [
                    "#EDF4F0",
                    "#C8E2D5",
                    "#A2D6BC",
                    "#7BD2A6",
                    "#52D593",
                    "#23E282",
                    "#05E273",
                    "#18B164",
                    "#228D57",
                    "#27714C",
                  ],
                },
              }}
            >
              <Component {...pageProps} />
            </MantineProvider>
          </FilterContextProvider>
        </SortContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
