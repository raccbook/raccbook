import Layout from "@/components/layout";
import { wagmiConfig, projectId } from "@/constants/config";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { chains } from "@/constants/chains";
import { WagmiConfig } from "wagmi";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const App = ({ Component, pageProps }: AppProps) => {
  createWeb3Modal({ wagmiConfig, projectId, chains });

  return (
    <>
      <Head>
        <title>RaccBook</title>
        <meta name="title" content="RaccBook" />
        <meta name="description" content="" />
        <meta charSet="UTF-8" />
        <meta name="keywords" content="lending orderbook" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=yes"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="" />

        <meta property="og:type" content="Website" />
        <meta property="og:url" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/favicon.svg" />
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </WagmiConfig>
    </>
  );
};

export default App;
