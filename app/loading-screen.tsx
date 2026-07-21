"use client";

/* eslint-disable @next/next/no-img-element -- The loader uses the existing transparent wordmark asset; Vinext local assets are not wired through next/image. */

type LoadingScreenProps = {
  className?: string;
  label?: string;
};

export function LoadingScreen({ className, label }: LoadingScreenProps) {
  return (
    <div className={["hemora-loader", className].filter(Boolean).join(" ")} {...(label ? { role: "status", "aria-label": label } : { "aria-hidden": true })}>
      <div className="loader-stage" aria-hidden="true">
        <span className="loader-beam loader-beam-left" />
        <span className="loader-beam loader-beam-right" />
        <span className="loader-mark" />
        <img className="loader-wordmark" src="/assets/hemora/hemora-logo.png" alt="" width={920} height={167} />
      </div>
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
