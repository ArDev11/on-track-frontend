import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

// useSearchParams di dalam form membutuhkan batas Suspense saat build.
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
