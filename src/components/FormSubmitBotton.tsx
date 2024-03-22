"use client";

import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitBottonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function FormSubmitBotton({
  children,
  className,
  ...props
}: FormSubmitBottonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`btn btn-primary ${className}`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
