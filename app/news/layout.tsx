import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

export const metadata = {
  title: "NEWS",
  description: "最新のニュース",
};

type Props = {
  children: React.ReactNode;
};

export const revalidate = 60;

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="NEWS" sub="ニュース" />
      {children}
    </>
  );
}
