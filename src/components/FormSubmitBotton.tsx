"use client";

import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
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
  const router = useRouter();

  const pushRoute = () => {
    router.push("/");
  };

  return (
    <button
      {...props}
      className={`btn btn-primary ${className}`}
      type="submit"
      disabled={pending}
      onClick={pushRoute}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
