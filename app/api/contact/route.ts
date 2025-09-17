import { NextResponse } from "next/server";
import { createContactData } from "@/app/_actions/contact";

export async function POST(request: Request) {
  const data = await request.json();
  // FormDataに変換
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  const result = await createContactData(null, formData);
  return NextResponse.json(result);
}
