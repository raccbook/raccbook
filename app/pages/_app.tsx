// import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title></title>
        <meta name="title" content="" />
        <meta name="description" content="" />
        <meta charSet="UTF-8" />
        <meta name="keywords" content="" />
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
      </Head>
      {/* <Layout> */}
        <Component {...pageProps} />
      {/* </Layout> */}
    </>
  );
};

export default App;
