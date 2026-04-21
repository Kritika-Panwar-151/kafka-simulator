"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      style={{
        position: "relative",
        paddingTop: "80px",
        paddingBottom: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* 🔥 BACKGROUND GLOW */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.25), transparent)",
          filter: "blur(120px)",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      />

      {/* 🔲 GRID OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      {/* 🔹 CONTENT */}
      <div
        className="container"
        style={{
          maxWidth: "800px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ lineHeight: 1.1 }}
        >
          Understand Kafka
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            lineHeight: 1.1,
            color: "#a78bfa",
          }}
        >
          Visually
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: "24px",
            fontSize: "18px",
          }}
        >
          Learn how distributed event streaming works through an interactive
          simulation of producers, brokers, topics, and consumers.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <button
            className="btn"
            onClick={() => router.push("/simulator")}
          >
            Launch Simulator
          </button>

          
        </motion.div>
      </div>
    </section>
  );
}