import { getMembersList } from "@/app/_libs/microcms";
import { MEMBERS_LIST_LIMIT } from "@/app/_constants";
import MembersClient from "./MembersClient";

export const metadata = {
  title: "メンバー",
  description: "私たちのチームをご紹介します。",
};

export default async function Page() {
  const data = await getMembersList({ limit: MEMBERS_LIST_LIMIT });

  return <MembersClient members={data.contents} />;
}
