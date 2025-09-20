import styles from "./index.module.css";

export default function ReservationForm() {
  return (
    <div className={styles.form}>
      <iframe
        src="https://select-type.com/rsv/?id=Npb30lqc5qM&c_id=414630&w_flg=1"
        width="100%"
        height="600"
        frameBorder="0"
        style={{ border: "none" }}
        title="予約フォーム"
      />
    </div>
  );
}
