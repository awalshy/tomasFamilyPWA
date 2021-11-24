import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name='application-name' content='TOMAS Family App' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='TOMAS Family App' />
          <meta name='description' content='TOMAS Family App' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='msapplication-TileColor' content='#133c6d' />
          <meta name='msapplication-tap-highlight' content='no' />
          <meta name='theme-color' content='#133c6d' />

          <link rel='apple-touch-icon' href='/static/icons/touch-icon-iphone.png' />
          <link rel='apple-touch-icon' sizes='152x152' href='/icons.png' />
          <link rel='apple-touch-icon' sizes='192x192' href='/icons192.png' />

          <link rel='manifest' href='/static/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap' />
              
          <meta property='og:type' content='website' />
          <meta property='og:title' content='TOMAS Family App' />
          <meta property='og:description' content='TOMAS Family App' />
          <meta property='og:site_name' content='PWA App' />
          <meta property='og:url' content='https://tomas.walsharthur.fr' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument