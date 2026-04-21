"use client";

import { useState } from "react";

type EventType = {
  id: number;
  type: string;
  key: number;
};

export default function Simulator() {
  const TOTAL_PARTITIONS = 3;

  // 🔹 STATE
  const [partitions, setPartitions] = useState<EventType[][]>(
    Array.from({ length: TOTAL_PARTITIONS }, () => [])
  );

  const [offsets, setOffsets] = useState<number[]>(
    Array.from({ length: TOTAL_PARTITIONS }, () => 0)
  );

  const [eventType, setEventType] = useState("order_created");
  const [key, setKey] = useState(1);

  const [produced, setProduced] = useState(0);
  const [processed, setProcessed] = useState(0);

  const [logs, setLogs] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>("");

  const [activePartition, setActivePartition] = useState<number | null>(null);

  // 🔹 PRODUCE EVENT
  const produce = () => {
    const partitionIndex = key % TOTAL_PARTITIONS;

    const newEvent: EventType = {
      id: Date.now(),
      type: eventType,
      key,
    };

    const updated = [...partitions];
    updated[partitionIndex] = [...updated[partitionIndex], newEvent];

    setPartitions(updated);
    setProduced((p) => p + 1);
    setActivePartition(partitionIndex);

    // 🔥 EXPLANATION
    setExplanation(`
Event Produced

Type: ${eventType}
Key: ${key}

Partition Formula:
partition = key % total_partitions
= ${key} % ${TOTAL_PARTITIONS}
= ${partitionIndex}

👉 This event goes to Partition ${partitionIndex}

💡 Same key ALWAYS goes to same partition
→ This guarantees ORDER within that partition
    `);

    setLogs((l) => [
      `Produced event (key=${key}) → P${partitionIndex}`,
      ...l,
    ]);
  };

  // 🔹 CONSUME STEP
  const consume = () => {
    for (let i = 0; i < TOTAL_PARTITIONS; i++) {
      if (offsets[i] < partitions[i].length) {
        const event = partitions[i][offsets[i]];

        const newOffsets = [...offsets];
        newOffsets[i]++;

        setOffsets(newOffsets);
        setProcessed((p) => p + 1);
        setActivePartition(i);

        // 🔥 EXPLANATION
        setExplanation(`
Event Consumed

Partition: ${i}
Event Key: ${event.key}

Offset BEFORE: ${offsets[i]}
Offset AFTER: ${offsets[i] + 1}

👉 Offset means "next event to read"

💡 Important:
- Events are NOT deleted
- Offset just moves forward
- Kafka keeps data as a log
        `);

        setLogs((l) => [
          `Consumed from P${i} (offset ${offsets[i]} → ${offsets[i] + 1})`,
          ...l,
        ]);

        return;
      }
    }

    setExplanation("No events to consume.");
  };

  const lag = produced - processed;

  return null;
}

/* 🔹 COMPONENTS */

function Stat({ title, value }: any) {
  return (
    <div className="card center">
      <h3>{title}</h3>
      <h2 style={{ marginTop: "10px" }}>{value}</h2>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white",
};