import type { ReactNode } from "react";
import styles from "./ui.module.css";

const toneClass = {
  warning: styles.alertWarning,
  danger: styles.alertDanger,
  success: styles.alertSuccess,
};

interface AlertProps {
  tone: keyof typeof toneClass;
  title: string;
  children?: ReactNode;
}

export function Alert({ tone, title, children }: AlertProps) {
  return (
    <div role="alert" className={`${styles.alert} ${toneClass[tone]}`}>
      <div>
        <p className={styles.alertTitle}>{title}</p>
        {children ? <p className={styles.alertBody}>{children}</p> : null}
      </div>
    </div>
  );
}
