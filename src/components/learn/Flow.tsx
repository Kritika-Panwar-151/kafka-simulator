"use client";

import {
  ArrowRight,
  Database,
  Server,
  Send,
  Inbox,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Flow() {
  return (
    <section id="flow"
      style={{
        paddingTop: "0px",
        paddingBottom: "30px",
        textAlign: "center",
      }}
    >
      <div className="container">
        <h2 className="section-title gradient-text">
  How Kafka Works
</h2>

        <div
          style={{
            marginTop: "80px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Node icon={<Send size={20} />} title="Producer" desc="Sends events" />
          <FlowLine />
          <Node icon={<Server size={20} />} title="Broker" desc="Stores data" />
          <FlowLine />
          <Node icon={<Database size={20} />} title="Topic" desc="Event log" />
          <FlowLine />
          <Node icon={<Inbox size={20} />} title="Consumer" desc="Reads events" />
        </div>
      </div>
    </section>
  );
}

/* 🔹 NODE */
function Node({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      style={{
        padding: "24px",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        background: "#020617",
        width: "160px",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <h3 style={{ fontSize: "16px" }}>{title}</h3>
      <p style={{ fontSize: "12px", marginTop: "6px" }}>{desc}</p>
    </motion.div>
  );
}

/* 🔹 FLOW LINE WITH ANIMATION */
function FlowLine() {
  return (
    <div
      style={{
        position: "relative",
        width: "100px",
        height: "2px",
        background: "#1e293b",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-120%", "120%"] }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          width: "60%", 
          height: "100%",
          background: "#a78bfa",
          filter: "blur(2px)", 
        }}
      />
    </div>
  );
}