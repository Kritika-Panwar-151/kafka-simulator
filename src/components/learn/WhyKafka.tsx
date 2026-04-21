"use client";

import { motion } from "framer-motion";

export default function WhyKafka() {
  return (
    <section id="why"
      style={{
        paddingTop: "0px",
        paddingBottom: "30px",
        textAlign: "center",
      }}
    >
      <div className="container">
        
        {/* TITLE */}
        <h2 className="section-title gradient-text">
          Why Kafka?
        </h2>

        {/* SUBTEXT */}
        <p
          style={{
            marginTop: "20px",
            maxWidth: "700px",
            marginInline: "auto",
            color: "#94a3b8",
          }}
        >
          Traditional systems struggle with scalability, reliability, and tight
          coupling. Kafka solves these problems by acting as a central event
          backbone.
        </p>

        {/* GRID */}
        <div
          style={{
            marginTop: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          <Card
            title="Tight Coupling"
            problem="Services depend on each other, so if one fails, others can break."
            solution="Kafka lets services communicate through events instead of directly"
          />

          <Card
            title="Data Loss"
            problem="Messages can be lost if systems fail or go offline."
            solution="Kafka stores events durably, ensuring data is not lost even during failures."
          />

          <Card
            title="Poor Scalability"
            problem="Handling high traffic becomes difficult with traditional systems."
            solution="Kafka scales by distributing data across multiple servers."
          />

          <Card
            title="No Replay"
            problem="Once data is consumed, it cannot be read again."
            solution="Kafka allows events to be replayed using offsets."
          />
          <Card
            title="Backpressure Issues"
            problem="Systems get overwhelmed when traffic spikes."
            solution="Kafka handles backpressure using partitions and buffering."
            />

            <Card
            title="Real-Time Processing"
            problem="Traditional systems process data in batches with delays."
            solution="Kafka enables real-time event streaming and processing."
            />
        </div>
      </div>
    </section>
  );
}

/* 🔹 CARD COMPONENT */
function Card({
  title,
  problem,
  solution,
}: {
  title: string;
  problem: string;
  solution: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
        padding: "28px",
        borderRadius: "14px",
        border: "1px solid #1e293b",
        background: "#020617",
        textAlign: "left",
        overflow: "hidden",
      }}
    >
      {/* TOP ACCENT */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "2px",
          background:
            "linear-gradient(to right, transparent, #a78bfa, transparent)",
          opacity: 0.6,
        }}
      />

      {/* TITLE */}
      <h3 style={{ marginBottom: "16px", fontSize: "18px",fontWeight: 600,
  color: "#f1f5f9"  }}>
        {title}
      </h3>

      {/* PROBLEM */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
        <span style={{ color:"#f87171" , fontSize: "14px" }}>●</span>
        <p style={{ fontSize: "14px", color: "#c7d2fe", margin: 0 }}>
          {problem}
        </p>
      </div>

      {/* SOLUTION */}
      <div style={{ display: "flex", gap: "10px" }}>
        <span style={{color: "#34d399" , fontSize: "14px" }}>●</span>
        <p style={{ fontSize: "14px", color: "#a78bfa", margin: 0 }}>
          {solution}
        </p>
      </div>
    </motion.div>
  );
}