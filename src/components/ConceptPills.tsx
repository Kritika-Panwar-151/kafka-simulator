"use client";
import { useRouter } from "next/navigation";


const items = [
  { id: "what", label: "Overview" },
  { id: "why", label: "Why Kafka" },
  { id: "flow", label: "How it Works" },
  { id: "concepts", label: "Core Concepts" },
  { id: "simulator", label: "Simulator", route: "/simulator" },
];

export default function ConceptPills() {
  const router = useRouter();
  return (
    <div
      style={{
    position: "sticky",
    top: 0, // match your header height
    zIndex: 20,

    width: "100%",            // 👈 full width
    display: "flex",
    justifyContent: "center", // 👈 CENTER pills

    padding: "16px 0",        // 👈 no side padding
   

    borderBottom: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",

  }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
  if (item.route) {
    router.push(item.route); // 🚀 go to simulator page
  } else {
    document
      .getElementById(item.id)
      ?.scrollIntoView({ behavior: "smooth" });
  }
}}
onMouseEnter={(e) => {
    e.currentTarget.style.opacity = "0.8";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "translateY(0px)";
  }}
          style={{
  padding: "12px 25px",
  borderRadius: "999px",
  border: item.route
    ? "1px solid #a78bfa"
    : "1px solid rgba(167,139,250,0.3)",

  background: item.route
    ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
    : "rgba(124,58,237,0.08)",

  color: item.route ? "#fff" : "#a78bfa",
  fontSize: 12,
  cursor: "pointer",
}}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}