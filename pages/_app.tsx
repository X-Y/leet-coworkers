import {QueryClient, QueryClientProvider} from "react-query";
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import SortContextProvider from "../contexts/SortContext/SortContextProvider";

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}>
    <SortContextProvider>
      <Component {...pageProps} />
    </SortContextProvider>
  </QueryClientProvider>
}


export default MyApp
