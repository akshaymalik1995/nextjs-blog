import '@/styles/globals.css'
// import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/styles/github-dark.css";
import { ClerkProvider } from '@clerk/nextjs'
import Layout from '@/components/Layout'
import CustomHead from '@/components/CustomHead'
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
export default function App({ Component, pageProps }) {
  const title = Component.title ? Component.title + 'Next.js Blog' : 'Next.js Blog'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <>
  
    <CustomHead  />
    <ClerkProvider {...pageProps} >
    <Layout>
    {loading ? <Loading /> : <Component {...pageProps} />}
    </Layout>
    </ClerkProvider>
   
    </>
    
  ) 
}
