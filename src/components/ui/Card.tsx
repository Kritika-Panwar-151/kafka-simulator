import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "feature" | "concept";
}

export default function Card({
  children,
  className = "",
  onClick,
  variant = "default",
}: CardProps) {
  const base =
    variant === "feature"
      ? "feature-card"
      : variant === "concept"
      ? "concept-card"
      : "ui-card";

  return (
    <div
      className={`${base} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}