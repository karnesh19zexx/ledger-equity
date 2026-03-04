import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="EduChain - Blockchain-based micro-donation platform for education equity. Supporting SDG 4 and SDG 10." />
        <meta name="keywords" content="blockchain, education, donations, ethereum, web3, SDG4, SDG10, NFT, transparency" />
        <meta name="author" content="EduChain Team" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EduChain - Education Through Blockchain" />
        <meta property="og:description" content="Make transparent, traceable micro-donations directly to students in need." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="EduChain - Education Through Blockchain" />
        <meta property="twitter:description" content="Make transparent, traceable micro-donations directly to students in need." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
