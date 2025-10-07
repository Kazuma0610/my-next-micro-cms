// app/services/layout.tsx
import Hero from "@/app/_components/Hero";

export const metadata = {
  title: "SERVICES",
  description: "サービス情報",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="Services" sub="サービス" />
      {children}
    </>
  );
}
