import Head from "next/head";
import Router from 'next/router';
import NProgress from 'nprogress';

// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import './../public/styles/fullPage.css'
import './../public/styles/nprogress.css';
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;


// progress nextjs
// NProgress.configure({ easing: 'ease', speed: 500 });
Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
