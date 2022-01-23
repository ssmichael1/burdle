import '../styles/globals.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/game.scss'
import type { AppProps } from 'next/app'
import { useEffect } from "react";



function MyApp({ Component, pageProps }: AppProps) {

  /*useEffect(() => {
    import('bootstrap/js/dist/modal.js');
  }, []);
  */
  return <Component {...pageProps} />
}

export default MyApp
