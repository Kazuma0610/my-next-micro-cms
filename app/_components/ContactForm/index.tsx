"use client";

import { createContactData } from "@/app/_actions/contact";
import { useFormState } from "react-dom";
import { useState } from "react";
import styles from "./index.module.css";

// ...FormData, initialFormはそのまま...

// 入力値の型
type FormData = {
  lastname: string;
  firstname: string;
  company: string;
  email: string;
  message: string;
};

const initialForm: FormData = {
  lastname: "",
  firstname: "",
  company: "",
  email: "",
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

  // 確認画面へ（バリデーション実行）
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    const result = await createContactData(state, fd);
    if (result.status === "error") {
      setState(result);
      return;
    }
    setState(initialState);
    setStep("confirm");
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
      <form
        className={styles.confirm}
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData();
          Object.entries(form).forEach(([key, value]) => fd.append(key, value));
          const result = await createContactData(state, fd);
          setState(result);
          if (result.status === "success") setStep("done");
        }}
      >
        <h2>確認画面</h2>
        <ul>
          <li>姓: {form.lastname}</li>
          <li>名: {form.firstname}</li>
          <li>会社名: {form.company}</li>
          <li>メール: {form.email}</li>
          <li>メッセージ: {form.message}</li>
        </ul>
        {/* hidden inputで値を渡す */}
        <input type="hidden" name="lastname" value={form.lastname} />
        <input type="hidden" name="firstname" value={form.firstname} />
        <input type="hidden" name="company" value={form.company} />
        <input type="hidden" name="email" value={form.email} />
        <input type="hidden" name="message" value={form.message} />
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
