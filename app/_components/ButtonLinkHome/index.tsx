//components/Button.link.home/index.tsx

import styles from "./index.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLinkHome({ href, children }: Props) {
  return (
    <a href={href} className={styles.button_home}>
      {children}
    </a>
  );
}
