"use client";

import { validateContactData, createContactData } from "@/app/_actions/contact";
import { useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";

// 入力値の型
type FormData = {
  lastname: string;
  firstname: string;
  company: string;
  zipcode: string; // 追加
  address: string; // 追加
  email: string;
  phone: string;
  radio_rfi: string;
  interests: string[]; // 追加
  department?: string; // 追加
  message: string;
  fileBase641?: string;
  fileName1?: string;
  fileType1?: string;
  fileBase642?: string;
  fileName2?: string;
  fileType2?: string;
};

// 初期値
const initialForm: FormData = {
  lastname: "",
  firstname: "",
  company: "",
  zipcode: "", // 追加
  address: "", // 追加
  email: "",
  phone: "",
  radio_rfi: "",
  interests: [], // 追加
  department: "",
  message: "",
  fileBase641: "",
  fileName1: "",
  fileType1: "",
  fileBase642: "",
  fileName2: "",
  fileType2: "",
};

const initialState = {
  status: "",
  message: "",
};

export default function ContactForm() {
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [form, setForm] = useState<FormData>(initialForm);
  const [state, setState] = useState(initialState);

  // 入力変更
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const interests = checked
        ? [...prev.interests, value]
        : prev.interests.filter((v) => v !== value);
      return { ...prev, interests };
    });
  };

  // 確認画面へ（バリデーション実行）
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    // formオブジェクトをFormDataインスタンスに変換
    const formData = new window.FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.length ? value.join(",") : "");
      } else if (value !== undefined) {
        formData.append(key, value);
      }
    });
    const result = await validateContactData(null, formData);
    if (result.status === "error") {
      setState(result);
      return;
    }
    setState(initialState);
    setStep("confirm");
    console.log(formData.get("interests"));
  };

  // 郵便番号入力時に住所自動取得
  const handleZipcodeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const zipcode = e.target.value.replace("-", "").trim();
    if (/^\d{7}$/.test(zipcode)) {
      try {
        const res = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const address = `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
          setForm((prev) => ({ ...prev, address }));
        }
      } catch {
        // 住所取得失敗時は何もしない（必要ならエラー表示も可）
      }
    }
  };

  // 画像添付1
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({
        ...prev,
        fileBase641: "",
        fileName1: "",
        fileType1: "",
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setForm((prev) => ({
        ...prev,
        fileBase641: base64,
        fileName1: file.name,
        fileType1: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 画像添付2
  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({
        ...prev,
        fileBase642: "",
        fileName2: "",
        fileType2: "",
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setForm((prev) => ({
        ...prev,
        fileBase642: base64,
        fileName2: file.name,
        fileType2: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  // メール送信（SendGrid API）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(initialState);

    // FormDataを作成
    const formData = new window.FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.length ? value.join(",") : "");
      } else if (value !== undefined && key !== "files") {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      setState(result);
      if (result.status === "success") setStep("done");
    } catch {
      setState({ status: "error", message: "送信に失敗しました" });
    }
  };

  // 戻る
  const handleBack = () => setStep("input");

  // 完了画面
  if (step === "done") {
    return (
      <div>
        <p className={styles.success}>
          お問い合わせいただき、ありがとうございます。
          <br />
          お返事まで今しばらくお待ちください。
        </p>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setForm(initialForm);
            setState(initialState);
            setStep("input");
          }}
        >
          入力画面に戻る
        </button>
      </div>
    );
  }

  // 確認画面
  if (step === "confirm") {
    return (
      <form className={styles.confirm} onSubmit={handleSubmit}>
        <h2>確認画面</h2>
        <ul>
          <li>姓: {form.lastname}</li>
          <li>名: {form.firstname}</li>
          <li>会社名: {form.company}</li>
          <li>郵便番号: {form.zipcode}</li>
          <li>住所: {form.address}</li>
          <li>メール: {form.email}</li>
          <li>電話番号: {form.phone}</li>
          <li>お問合わせ種別: {form.radio_rfi}</li>
          <li>ご興味のある項目: {form.interests.join(", ")}</li>
          <li>部署: {form.department}</li>
          <li>メッセージ: {form.message}</li>
          <li>
            添付ファイル1: {form.fileName1 || "なし"}
            {form.fileBase641 && form.fileType1 && (
              <div style={{ marginTop: "8px" }}>
                <Image
                  src={`data:${form.fileType1};base64,${form.fileBase641}`}
                  alt={form.fileName1 ?? ""}
                  width={200}
                  height={200}
                  style={{
                    objectFit: "contain",
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                />
              </div>
            )}
          </li>
          <li>
            添付ファイル2: {form.fileName2 || "なし"}
            {form.fileBase642 && form.fileType2 && (
              <div style={{ marginTop: "8px" }}>
                <Image
                  src={`data:${form.fileType2};base64,${form.fileBase642}`}
                  alt={form.fileName2 ?? ""}
                  width={200}
                  height={200}
                  style={{
                    objectFit: "contain",
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                />
              </div>
            )}
          </li>
        </ul>
        <div className={styles.actions}>
          <button type="button" onClick={handleBack} className={styles.button}>
            戻る
          </button>
          <button type="submit" className={styles.button}>
            送信
          </button>
        </div>
        {state.status === "error" && (
          <p className={styles.error}>{state.message}</p>
        )}
      </form>
    );
  }

  // 入力画面
  return (
    <form className={styles.form} onSubmit={handleConfirm}>
      <div className={styles.horizontal}>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="lastname">
            姓
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="lastname"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            名
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="firstname"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="company">
          会社名
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="company"
          name="company"
          value={form.company}
          onChange={handleChange}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="zipcode">
          郵便番号
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="zipcode"
          name="zipcode"
          value={form.zipcode}
          onChange={handleChange}
          onBlur={handleZipcodeBlur}
          placeholder="例: 123-4567"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="address">
          住所
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="例: 東京都千代田区1-1-1"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          メールアドレス
        </label>
        <input
          className={styles.textfield}
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="phone">
          電話番号
        </label>
        <input
          className={styles.textfield}
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <div className={styles["item-radio"]}>
        <label className={styles.label} htmlFor="radio_rfi">
          お問合わせ種別
        </label>
        <div className={styles["radio-group"]}>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="会社概要"
              checked={form.radio_rfi === "会社概要"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>会社概要</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="製品"
              checked={form.radio_rfi === "製品"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>製品</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="サービスカタログ"
              checked={form.radio_rfi === "サービスカタログ"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>サービスカタログ</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="料金プラン"
              checked={form.radio_rfi === "料金プラン"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>料金プラン</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="技術サポート"
              checked={form.radio_rfi === "技術サポート"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>技術サポート</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="営業相談"
              checked={form.radio_rfi === "営業相談"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>営業相談</span>
          </label>
          <label className={styles["radio-item"]}>
            <input
              type="radio"
              name="radio_rfi"
              value="その他"
              checked={form.radio_rfi === "その他"}
              onChange={handleChange}
            />
            <span className={styles["radio-text"]}>その他</span>
          </label>
        </div>
      </div>
      <div className={styles["item-checkbox"]}>
        <label className={styles.label}>ご興味のある項目（複数選択可）</label>
        <div className={styles["checkbox-group"]}>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="製品"
              checked={form.interests.includes("製品")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>製品</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="サービス"
              checked={form.interests.includes("サービス")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>サービス</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="サポート"
              checked={form.interests.includes("サポート")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>サポート</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="コンサルティング"
              checked={form.interests.includes("コンサルティング")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>コンサルティング</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="導入支援"
              checked={form.interests.includes("導入支援")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>導入支援</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="研修・教育"
              checked={form.interests.includes("研修・教育")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>研修・教育</span>
          </label>
          <label className={styles["checkbox-item"]}>
            <input
              type="checkbox"
              value="その他"
              checked={form.interests.includes("その他")}
              onChange={handleCheckboxChange}
            />
            <span className={styles["checkbox-text"]}>その他</span>
          </label>
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="department">
          部署
        </label>
        <select
          id="department"
          name="department"
          value={form.department ?? ""}
          onChange={handleChange}
          className={styles["select-dropdown"]}
        >
          <option value="">選択してください</option>
          <option value="営業部">営業部</option>
          <option value="技術部">技術部</option>
          <option value="総務部">総務部</option>
          {/* 必要に応じて追加 */}
        </select>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ
        </label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label}>画像添付1</label>
        <input
          className={styles["file-input"]}
          type="file"
          accept="image/*"
          onChange={handleFileChange1}
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label}>画像添付2</label>
        <input
          className={styles["file-input"]}
          type="file"
          accept="image/*"
          onChange={handleFileChange2}
        />
      </div>
      <div className={styles.actions}>
        {state.status === "error" && (
          <p className={styles.error}>{state.message}</p>
        )}
        <input type="submit" value="確認" className={styles.button} />
      </div>
    </form>
  );
}
