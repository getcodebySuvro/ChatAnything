import '../styles/globals.css'
import { Head } from 'next/document'

export default function App({ Component, pageProps }) {
  <Head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>ChatAnything</title>
  </Head>
  return <Component {...pageProps} />
}
