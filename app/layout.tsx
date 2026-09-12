import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://retreat.tedditory.co";
const FAVICON =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%227%22%20fill%3D%22%231D1D1F%22%2F%3E%3Crect%20x%3D%227.5%22%20y%3D%229%22%20width%3D%2217%22%20height%3D%223.2%22%20rx%3D%221.4%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Crect%20x%3D%2214.4%22%20y%3D%229%22%20width%3D%223.2%22%20height%3D%2215.2%22%20rx%3D%221.4%22%20fill%3D%22%23FFFFFF%22%2F%3E%3Ccircle%20cx%3D%2223.2%22%20cy%3D%2222.6%22%20r%3D%221.9%22%20fill%3D%22%23FFFFFF%22%2F%3E%3C%2Fsvg%3E';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tedditory Retreat — Elevated room-sharing in metro Seattle",
    template: "%s · Tedditory Retreat",
  },
  description:
    "Thoughtfully designed private rooms in metro Seattle. Your own bedroom and bathroom, shared living, flexible monthly stays. A smarter way to live.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: FAVICON, type: "image/svg+xml" }],
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "Tedditory Retreat",
    description:
      "Elevated room-sharing in metro Seattle — private where it matters, shared where it makes sense.",
    type: "website",
    url: SITE_URL,
    images: [{ url: "/assets/images/share.jpg", width: 1200, height: 900 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#FBFBFD" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        {children}

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1004383012301262');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- tracking pixel, must work with JS disabled */}
          <img
            height={1}
            width={1}
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1004383012301262&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Google tag (GA4) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C6VM9G4176" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C6VM9G4176');
          `}
        </Script>
      </body>
    </html>
  );
}
