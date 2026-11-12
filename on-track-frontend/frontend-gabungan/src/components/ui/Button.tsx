import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className ?? ""}`} {...props} />
  );
}

interface LinkButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function LinkButton({ href, variant = "primary", children }: LinkButtonProps) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
