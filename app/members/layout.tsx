import Sheet from "@/app/_components/Sheet";
import Hero from "@/app/_components/Hero";

export const metadata = {
  title: "Company",
  description: "会社概要",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="Company" sub="会社概要" />
      <Sheet>{children}</Sheet>
    </>
  );
}
