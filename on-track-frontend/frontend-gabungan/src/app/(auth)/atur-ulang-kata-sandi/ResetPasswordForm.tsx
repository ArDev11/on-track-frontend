"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import styles from "@/components/auth/auth.module.css";
import { Alert } from "@/components/ui/Alert";
import { Button, LinkButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { readProblem } from "@/lib/api/problem";
import type { ProblemDetails } from "@/lib/api/schema";

const RULES = [
  { label: "Minimal 8 karakter", test: (value: string) => value.length >= 8 },
  { label: "Mengandung huruf dan angka", test: (value: string) => /[a-zA-Z]/.test(value) && /\d/.test(value) },
  { label: "Mengandung huruf besar", test: (value: string) => /[A-Z]/.test(value) },
];

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [confirmationError, setConfirmationError] = useState<string>();
  const [problem, setProblem] = useState<ProblemDetails>();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <>
        <div className={styles.badgeAccent}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <h1 className={styles.title}>Kata sandi berhasil diubah</h1>
        <p className={styles.subtitle}>
          Demi keamanan, semua sesi lain di perangkat berbeda sudah dikeluarkan. Silakan masuk dengan kata sandi baru.
        </p>
        <div className={styles.form}>
          <LinkButton href="/login">Masuk ke dashboard →</LinkButton>
        </div>
      </>
    );
  }

  if (!token) {
    return (
      <>
        <h1 className={styles.title}>Tautan tidak valid</h1>
        <p className={styles.subtitle}>Minta tautan baru untuk membuat kata sandi.</p>
        <div className={styles.form}>
          <LinkButton href="/lupa-kata-sandi">Minta tautan baru</LinkButton>
        </div>
      </>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProblem(undefined);

    if (!RULES.every((rule) => rule.test(password))) {
      setProblem({ title: "Kata sandi belum memenuhi syarat", status: 400 });
      return;
    }
    if (password !== confirmation) {
      setConfirmationError("Harus sama dengan kata sandi baru");
      return;
    }
    setConfirmationError(undefined);

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (response.ok) setDone(true);
      else setProblem(await readProblem(response));
    } catch {
      setProblem({ title: "Tidak dapat terhubung ke server", status: 0, detail: "Periksa koneksi lalu coba lagi." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className={styles.badge}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
      </div>
      <h1 className={styles.title}>Buat kata sandi baru</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {problem ? (
          <Alert tone="danger" title={problem.title}>
            {problem.detail}
          </Alert>
        ) : null}
        <TextField
          label="Kata sandi baru"
          type="password"
          name="new-password"
          autoComplete="new-password"
          hint="Minimal 8 karakter"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          label="Ulangi kata sandi"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          hint="Harus sama dengan kata sandi baru"
          value={confirmation}
          error={confirmationError}
          onChange={(event) => setConfirmation(event.target.value)}
        />
        <ul className={styles.rules}>
          {RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <li key={rule.label} className={passed ? styles.rulePassed : styles.ruleFailed}>
                <span aria-hidden="true">{passed ? "✓" : "×"}</span> {rule.label}
              </li>
            );
          })}
        </ul>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan kata sandi"}
        </Button>
      </form>
    </>
  );
}
