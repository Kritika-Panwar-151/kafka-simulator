"use client";

import { useState } from "react";

const data = {
  Producer: {
    title: "Producer",
    main: "A producer is any system that sends data (events) into Kafka.",
    example:
      "For example, in a food delivery app, when a user places an order, the app sends an event like order_created. That app acts as the producer.",
    key:
      "Producers do not need to know who will read the data — they simply publish events. This keeps systems loosely coupled.",
  },

  Broker: {
    title: "Broker",
    main: "A broker is a Kafka server responsible for storing and managing event data.",
    example:
      "Think of it like a warehouse where all events (orders, payments, logs) are safely stored before being used.",
    key:
      "Brokers form the backbone of Kafka, ensuring data is stored reliably, remains ordered, and is always available at scale.",
  },

  Topic: {
    title: "Topic",
    main: "A topic is a logical category where related events are stored.",
    example:
      "Similar to folders (e.g., 'orders', 'payments', 'notifications'), each type of event is organized into its own topic.",
    key:
      "Topics behave like append-only logs — new events are added, and existing data is never overwritten.",
  },

  Consumer: {
    title: "Consumer",
    main: "A consumer is a service that reads and processes events from Kafka.",
    example:
      "After an order is placed, different services like payment, delivery, and notifications can all read the same event independently.",
    key:
      "Consumers operate independently and process data at their own pace, avoiding tight coupling between systems.",
  },
};

export default function Concepts() {
  const [active, setActive] =
    useState<keyof typeof data>("Producer");

  return (
    <section
      id="concepts"
      style={{
        paddingTop: "0px",
        paddingBottom: "60px",
        textAlign: "center",
      }}
    >
      <div className="container">
        
        {/* TITLE */}
        <h2 className="section-title gradient-text">
          Core Concepts
        </h2>

        <p
          style={{
            marginTop: "16px",
            color: "#94a3b8",
          }}
        >
          Click to explore how each component works in Kafka
        </p>

        {/* BUTTONS */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(data).map((key) => (
            <button
              key={key}
              onClick={() =>
                setActive(key as keyof typeof data)
              }
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid #1e293b",
                background:
                  active === key
                    ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                    : "transparent",
                color: active === key ? "#fff" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* CONTENT CARD */}
        <div
          style={{
            marginTop: "50px",
            maxWidth: "720px",
            marginInline: "auto",
            padding: "36px",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            background: "#020617",
            textAlign: "left",
          }}
        >
          {/* TITLE */}
          <h3
            style={{
              marginBottom: "20px",
              fontSize: "22px",
              color: "#a78bfa",
            }}
          >
            {data[active].title}
          </h3>

          {/* MAIN */}
          <p
            style={{
              color: "#e2e8f0",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            {data[active].main}
          </p>

          {/* REAL LIFE */}
          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "#a78bfa" }}>
                Real life:
              </span>{" "}
              {data[active].example}
            </p>
          </div>

          {/* KEY IDEA */}
          <div
            style={{
              marginTop: "24px",
              padding: "14px 18px",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(167,139,250,0.08))",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#a78bfa",
                fontWeight: 500,
              }}
            >
              💡 {data[active].key}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}