import type { ReactNode } from "react";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.brand}>
        <p className={styles.logo}>
          <span className={styles.logoDot} aria-hidden="true" />
          On-Track
        </p>
        <div className={styles.brandBody}>
          <p className={styles.headline}>
            Kehadiran, task, dan payroll tim — real-time dalam satu dashboard.
          </p>
          <p className={styles.tagline}>Dipakai Studio Tigapagi untuk 16 karyawan.</p>
        </div>
      </aside>
      <main className={styles.content}>
        <div className={styles.panel}>{children}</div>
      </main>
    </div>
  );
}
