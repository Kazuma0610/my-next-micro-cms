"use server";

import sgMail from "@sendgrid/mail";

function validateEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validatenumber(number: string) {
  const pattern = /^[0-9]+$/;
  return pattern.test(number);
}

function zipcodenumber(number: string) {
  const pattern = /^[0-9]{3}-?[0-9]{4}$/;
  return pattern.test(number);
}

// メール送信のみ
export async function createContactData(_prevState: any, formData: FormData) {
  const rawFormData = {
    lastname: formData.get("lastname") as string,
    firstname: formData.get("firstname") as string,
    company: formData.get("company") as string,
    zipcode: formData.get("zipcode") as string,
    address: formData.get("address") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    radio_rfi: formData.get("radio_rfi") as string,
    interests: (formData.get("interests") as string)?.split(",") || [],
    message: formData.get("message") as string,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const msg = {
    to: ["daieirecord.ec@gmail.com", "mail@kazuma.work"], // 送信先
    from: { email: process.env.SENDGRID_FROM!, name: "お問い合わせ" }, // 認証済み送信元
    subject: "お問い合わせ内容",
    text: `
      姓: ${rawFormData.lastname}
      名: ${rawFormData.firstname}
      会社名: ${rawFormData.company}
      郵便番号: ${rawFormData.zipcode}
      住所: ${rawFormData.address}
      メール: ${rawFormData.email}
      電話番号: ${rawFormData.phone}
      お問合わせ種別: ${rawFormData.radio_rfi}
      ご興味のある項目: ${rawFormData.interests.join(", ")}
      メッセージ: ${rawFormData.message}
    `,
  };

  try {
    await sgMail.send(msg);
    return {
      status: "success",
      message: "送信しました",
    };
  } catch (e: any) {
    console.log(e);
    if (e.response && e.response.body) {
      console.log(e.response.body); // ← ここに追加
    }
    return {
      status: "error",
      message: "メール送信に失敗しました",
    };
  }
}

// バリデーションのみ
export async function validateContactData(_prevState: any, formData: FormData) {
  const rawFormData = {
    lastname: formData.get("lastname") as string,
    firstname: formData.get("firstname") as string,
    company: formData.get("company") as string,
    zipcode: formData.get("zipcode") as string,
    address: formData.get("address") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    radio_rfi: formData.get("radio_rfi") as string,
    interests: (formData.get("interests") as string)?.split(",") || [],
    message: formData.get("message") as string,
  };

  if (!rawFormData.lastname) {
    return { status: "error", message: "姓を入力してください" };
  }
  if (!rawFormData.firstname) {
    return { status: "error", message: "名を入力してください" };
  }
  if (!rawFormData.company) {
    return { status: "error", message: "会社名を入力してください" };
  }
  if (!rawFormData.zipcode) {
    return { status: "error", message: "郵便番号を入力してください" };
  }
  if (!zipcodenumber(rawFormData.zipcode)) {
    return { status: "error", message: "郵便番号を数字のみで入力してください" };
  }
  if (!rawFormData.address) {
    return { status: "error", message: "住所を入力してください" };
  }
  if (!rawFormData.email) {
    return { status: "error", message: "メールアドレスを入力してください" };
  }
  if (!validateEmail(rawFormData.email)) {
    return { status: "error", message: "メールアドレスの形式が誤っています" };
  }
  if (!validatenumber(rawFormData.phone)) {
    return { status: "error", message: "電話番号を数字のみで入力してください" };
  }
  if (!rawFormData.radio_rfi) {
    return { status: "error", message: "お問合わせ種別を選択してください" };
  }
  if (
    !rawFormData.interests ||
    !rawFormData.interests.length ||
    rawFormData.interests[0] === ""
  ) {
    return { status: "error", message: "ご興味のある項目を選択してください" };
  }
  if (!rawFormData.message) {
    return { status: "error", message: "メッセージを入力してください" };
  }

  return { status: "success", message: "OK" };
}
