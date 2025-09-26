import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

export const metadata = {
  title: "BLOG",
  description: "最新のブログ",
};

type Props = {
  children: React.ReactNode;
};

export const revalidate = 60;

export default function BlogLayout({ children }: Props) {
  return (
    <>
      <Hero title="BLOG" sub="最新のブログ" />
      <Sheet>{children}</Sheet>
    </>
  );
}
