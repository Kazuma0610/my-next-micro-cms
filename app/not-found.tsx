import Image from "next/image";
import styles from "./not-found.module.css";

export default function Notfound() {
    return (
        <>

          <section className={styles.top}>
            <div>
              <h1 className={styles.title}>テクノロジーの力で世界を変える</h1>
              <p className={styles.description}>私たちは市場をリードしているグローバルテックカンパニーです</p>
            </div>
            <Image className={styles.bgimg} 
              src="/img-mv.jpg" 
              alt="メインヴィジュアル"
              width={4000}
              height={1200}
            />
          </section>

          <div className={styles.container}>
            <dl>
                <dt className={styles.title_p}>ページが見つかりませんでした</dt>
                <dd className={styles.text}>あたながアクセスしようとしたページは存在しません
                    <br></br><br></br>
                    URLを再度ご確認ください
                </dd>
            </dl>
          </div>
        
        </>
        
    );
}