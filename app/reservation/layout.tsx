import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

export const metadata = {
  title: "RESERVATION",
  description: "セミナー予約",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="Reservation" sub="セミナー予約" />
      <Sheet>{children}</Sheet>
    </>
  );
}
