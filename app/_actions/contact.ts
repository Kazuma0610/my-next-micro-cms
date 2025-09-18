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

  // 画像添付（1枚のみ対応）
  const fileBase641 = formData.get("fileBase641") as string | undefined;
  const fileName1 = formData.get("fileName1") as string | undefined;
  const fileType1 = formData.get("fileType1") as string | undefined;

  const fileBase642 = formData.get("fileBase642") as string | undefined;
  const fileName2 = formData.get("fileName2") as string | undefined;
  const fileType2 = formData.get("fileType2") as string | undefined;

  const attachments = [];
  if (fileBase641 && fileName1 && fileType1) {
    attachments.push({
      content: fileBase641,
      filename: fileName1,
      type: fileType1,
      disposition: "attachment",
    });
  }
  if (fileBase642 && fileName2 && fileType2) {
    attachments.push({
      content: fileBase642,
      filename: fileName2,
      type: fileType2,
      disposition: "attachment",
    });
  }
  console.log("attachments", attachments); // ← ここで中身を確認

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
    attachments, // ← 1枚のみ添付
  };

  // 管理者宛てメール
  const adminMsg = {
    to: "mail@daieirecord.jp",
    from: { email: process.env.SENDGRID_FROM!, name: "お問い合わせ" },
    subject: "お問い合わせ内容",
    text: `...お問い合わせ内容...
    ----------------------------------------

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
      ${attachments.length > 0 ? "添付ファイル有り" : ""}

    ----------------------------------------
    `,
  };

  // ユーザー宛て自動返信メール
  const userMsg = {
    to: rawFormData.email,
    from: { email: process.env.SENDGRID_FROM!, name: "お問い合わせ" },
    subject: "お問い合わせありがとうございます",
    text: `
    ${rawFormData.lastname}${rawFormData.firstname}様
    お問い合わせありがとうございます。
    下記の内容を確認し、担当者よりご連絡いたします。

    ----------------------------------------

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
      ${attachments.length > 0 ? "添付ファイル有り" : ""}

    ----------------------------------------
  `,
  };

  try {
    await sgMail.send(msg);
    await sgMail.send(adminMsg);
    await sgMail.send(userMsg);
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
