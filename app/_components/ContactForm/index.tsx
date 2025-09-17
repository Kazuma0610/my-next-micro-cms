"use client";

import { validateContactData, createContactData } from "@/app/_actions/contact";
import { useState } from "react";
import styles from "./index.module.css";

// 入力値の型
type FormData = {
  lastname: string;
  firstname: string;
  company: string;
  email: string;
  phone: string;
  radio_rfi: string;
  interests: string[]; // 追加
  message: string;
};

// 初期値
const initialForm: FormData = {
  lastname: "",
  firstname: "",
  company: "",
  email: "",
  phone: "",
  radio_rfi: "",
  interests: [], // 追加
  message: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      } else {
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

  // メール送信（SendGrid API）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(initialState);

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
          <li>メール: {form.email}</li>
          <li>電話番号: {form.phone}</li>
          <li>お問合わせ種別: {form.radio_rfi}</li>
          <li>ご興味のある項目: {form.interests.join(", ")}</li>
          <li>メッセージ: {form.message}</li>
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
      <div>
        <label className={styles.label} htmlFor="radio_rfi">
          お問合わせ種別
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="radio_rfi"
              value="会社概要"
              checked={form.radio_rfi === "会社概要"}
              onChange={handleChange}
            />
            会社概要
          </label>
          <label>
            <input
              type="radio"
              name="radio_rfi"
              value="製品"
              checked={form.radio_rfi === "製品"}
              onChange={handleChange}
            />
            製品
          </label>
          <label>
            <input
              type="radio"
              name="radio_rfi"
              value="サービスカタログ"
              checked={form.radio_rfi === "サービスカタログ"}
              onChange={handleChange}
            />
            サービスカタログ
          </label>
          <label>
            <input
              type="radio"
              name="radio_rfi"
              value="料金プラン"
              checked={form.radio_rfi === "料金プラン"}
              onChange={handleChange}
            />
            料金プラン
          </label>
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label}>ご興味のある項目（複数選択可）</label>
        <label>
          <input
            type="checkbox"
            value="製品"
            checked={form.interests.includes("製品")}
            onChange={handleCheckboxChange}
          />
          製品
        </label>
        <label>
          <input
            type="checkbox"
            value="サービス"
            checked={form.interests.includes("サービス")}
            onChange={handleCheckboxChange}
          />
          サービス
        </label>
        <label>
          <input
            type="checkbox"
            value="サポート"
            checked={form.interests.includes("サポート")}
            onChange={handleCheckboxChange}
          />
          サポート
        </label>
        {/* 必要に応じて追加 */}
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
      <div className={styles.actions}>
        {state.status === "error" && (
          <p className={styles.error}>{state.message}</p>
        )}
        <input type="submit" value="確認" className={styles.button} />
      </div>
    </form>
  );
}
