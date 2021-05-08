import Head from "next/head";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>URL Shortener</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;