"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
  onClick={() => router.push("/")}

  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    letterSpacing: 4,
    color: "#a78bfa",
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  KAFKA.SIMULATOR
</div>

      <div style={{ display: "flex", gap: "20px" }}>
        <span style={{ cursor: "pointer" }} 
        onClick={() => router.push("/")}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Concepts
        </span>
        <span

          style={{ cursor: "pointer" }}
          onClick={() => router.push("/simulator")}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Simulator
        </span>
      </div>
    </div>
  );
}