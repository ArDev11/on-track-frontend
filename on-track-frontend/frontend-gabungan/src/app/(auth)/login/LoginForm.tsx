"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import styles from "@/components/auth/auth.module.css";
import { Alert } from "@/components/ui/Alert";
import { Button, LinkButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { readProblem } from "@/lib/api/problem";
import type { ProblemDetails } from "@/lib/api/schema";

const MAX_ATTEMPTS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCountdown(seconds: number) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [problem, setProblem] = useState<ProblemDetails>();
  const [lockSeconds, setLockSeconds] = useState(0);

  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setTimeout(() => setLockSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockSeconds]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmailError = !email.trim()
      ? "Email wajib diisi."
      : EMAIL_PATTERN.test(email.trim())
        ? undefined
        : "Format email tidak valid.";
    const nextPasswordError = password ? undefined : "Kata sandi wajib diisi.";
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setProblem(undefined);
    if (nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, remember }),
      });

      if (response.ok) {
        router.replace("/");
        router.refresh();
        return;
      }

      const result = await readProblem(response);
      setProblem(result);
      setLockSeconds(result.status === 423 ? (result.retry_after ?? 0) : 0);
      if (result.status === 401 && result.remaining_attempts !== undefined) {
        const used = MAX_ATTEMPTS - result.remaining_attempts;
        setPasswordError(`Kata sandi salah (${used}/${MAX_ATTEMPTS} percobaan)`);
      }
    } catch {
      setProblem({ title: "Tidak dapat terhubung ke server", status: 0, detail: "Periksa koneksi lalu coba lagi." });
    } finally {
      setSubmitting(false);
    }
  }

  const invalidCredentials = problem?.status === 401;
  const locked = problem?.status === 423;
  const showResetLink = invalidCredentials || locked;
  const lockActive = locked && lockSeconds > 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {invalidCredentials ? (
        <Alert tone="warning" title="Email atau kata sandi salah">
          {problem.remaining_attempts !== undefined
            ? `Sisa ${problem.remaining_attempts} percobaan lagi. Setelah ${MAX_ATTEMPTS} kali salah, akun dikunci 15 menit.`
            : problem.detail}
        </Alert>
      ) : locked ? (
        <Alert tone="danger" title="Akun dikunci sementara">
          {lockActive
            ? `${MAX_ATTEMPTS} kali salah kata sandi. Coba lagi dalam ${formatCountdown(lockSeconds)} atau atur ulang kata sandi.`
            : problem.detail}
        </Alert>
      ) : problem ? (
        <Alert tone="danger" title={problem.title}>
          {problem.detail}
        </Alert>
      ) : null}

      <TextField
        label="Email kantor"
        type="email"
        name="email"
        autoComplete="username"
        placeholder="nama@studiotigapagi.com"
        value={email}
        error={emailError}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label="Kata sandi"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Masukkan kata sandi"
        hint="Sesi berakhir setelah 30 menit tidak aktif"
        value={password}
        error={passwordError}
        onChange={(event) => setPassword(event.target.value)}
      />

      {showResetLink ? null : (
        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            Ingat saya
          </label>
          <Link href="/lupa-kata-sandi" className={styles.link}>
            Lupa kata sandi?
          </Link>
        </div>
      )}

      <Button type="submit" disabled={submitting || lockActive}>
        {lockActive ? `Masuk (${formatCountdown(lockSeconds)})` : submitting ? "Memproses..." : "Masuk →"}
      </Button>

      {showResetLink ? (
        <LinkButton href="/lupa-kata-sandi" variant="secondary">
          Atur ulang kata sandi
        </LinkButton>
      ) : (
        <p className={styles.footnote}>Belum punya akun perusahaan? Daftarkan tenant (segera hadir).</p>
      )}
    </form>
  );
}
