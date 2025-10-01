import "./globals.css";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import PageTransition from "./_components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    template: "%s | シンプルなDEMOコーポレートサイト",
    default: "シンプルなDEMOコーポレートサイト",
  },
  description:
    "「Next.js＋ヘッドレスCMSではじめる！ かんたん・モダンWebサイト制作入門」で作成されるDEMOサイトです。",
  openGraph: {
    title: "シンプルなDEMOコーポレートサイト",
    description:
      "「Next.js＋ヘッドレスCMSではじめる！ かんたん・モダンWebサイト制作入門」で作成されるDEMOサイトです。",
    images: ["/ogp.png"],
  },
  alternates: {
    canonical: "https://my-next-micro-cms.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>
          <PageTransition animationType="fade" duration={500}>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
