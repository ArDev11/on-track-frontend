import styles from "@/components/auth/auth.module.css";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className={styles.title}>Masuk ke dashboard</h1>
      <p className={styles.subtitle}>Untuk HRD, CEO/Owner, dan Team Lead.</p>
      <LoginForm />
    </>
  );
}
