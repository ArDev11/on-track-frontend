"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./ui.module.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, type, ...props }: TextFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error || hint ? `${id}-note` : undefined;

  const inputClass = [
    styles.input,
    isPassword ? styles.inputWithIcon : "",
    error ? styles.inputError : "",
  ].join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={inputClass}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            className={styles.iconButton}
            aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            onClick={() => setVisible((value) => !value)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {visible ? null : <path d="M4 4l16 16" />}
            </svg>
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-note`} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-note`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
