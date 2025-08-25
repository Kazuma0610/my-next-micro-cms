import Image from "next/image";
import styles from "./not-found.module.css";
import Hero from "@/app/_components/Hero";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

export default function Notfound() {
  return (
    <>
      <section className={styles.top}>
        <div>
          <h1 className={styles.title}>Not Found</h1>
          <p className={styles.sub}>404ページ</p>
        </div>
        <Image
          className={styles.bgimg}
          src="/img-mv.jpg"
          alt="メインヴィジュアル"
          width={4000}
          height={1200}
        />
      </section>

      <div className={styles.container}>
        <Breadcrumbs />
        <dl>
          <dt className={styles.title_p}>ページが見つかりませんでした</dt>
          <dd className={styles.text}>
            あたながアクセスしようとしたページは存在しません
            <br></br>
            <br></br>
            URLを再度ご確認ください
          </dd>
        </dl>
      </div>
    </>
  );
}
