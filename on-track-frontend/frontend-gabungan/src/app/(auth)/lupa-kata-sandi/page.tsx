"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import styles from "@/components/auth/auth.module.css";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { readProblem } from "@/lib/api/problem";
import type { ProblemDetails } from "@/lib/api/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [problem, setProblem] = useState<ProblemDetails>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(false);
    setProblem(undefined);

    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setEmailError(value ? "Format email tidak valid." : "Email wajib diisi.");
      return;
    }
    setEmailError(undefined);

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (response.ok) setSent(true);
      else setProblem(await readProblem(response));
    } catch {
      setProblem({ title: "Tidak dapat terhubung ke server", status: 0, detail: "Periksa koneksi lalu coba lagi." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <p>
        <Link href="/login" className={styles.link}>
          Kembali ke login ←
        </Link>
      </p>
      <div className={styles.badge}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></svg>
      </div>
      <h1 className={styles.title}>Lupa kata sandi?</h1>
      <p className={styles.subtitle}>
        Masukkan email kantor yang terdaftar. Kami akan mengirim tautan untuk membuat kata sandi baru.
      </p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {sent ? (
          <Alert tone="success" title="Permintaan diterima">
            Jika email terdaftar, tautan untuk membuat kata sandi baru telah dikirim.
          </Alert>
        ) : null}
        {problem ? (
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
          hint="Tautan berlaku 30 menit"
          value={email}
          error={emailError}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Mengirim..." : "Kirim tautan reset"}
        </Button>
        <p className={styles.footnote}>Tidak punya akses ke email kantor? Hubungi HRD atau Owner tenant.</p>
      </form>
    </>
  );
}
