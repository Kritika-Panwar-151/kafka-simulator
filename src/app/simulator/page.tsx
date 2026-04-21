"use client";
import { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Inbox,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Database,
  Cpu,
  ChevronRight,
  Hash,
  Zap,
} from "lucide-react";


const TOTAL_PARTITIONS = 3;
const EVENT_OPTIONS = [
  "order_created",
  "user_signup",
  "payment_success",
  "item_shipped",
  "review_posted",
];

type EventType = {
  id: number;
  type: string;
  key: number;
};

type ExplainProduce = {
  type: "produce";
  eventType: string;
  key: number;
  partition: number;
  offsetAt: number;
};

type ExplainConsume = {
  type: "consume";
  partition: number;
  eventType: string;
  key: number;
  prevOffset: number;
  newOffset: number;
};

type Explanation = ExplainProduce | ExplainConsume | null;

export default function SimulatorPage() {
    const partitionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const consumerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scrollTarget, setScrollTarget] = useState<number | null>(null);

  const [eventType, setEventType] = useState("order_created");
  const [key, setKey] = useState(1);

  const [partitions, setPartitions] = useState<EventType[][]>(
    Array.from({ length: TOTAL_PARTITIONS }, () => [])
  );
  const [offsets, setOffsets] = useState<number[]>(
    Array.from({ length: TOTAL_PARTITIONS }, () => 0)
  );

  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);
  const [produced, setProduced] = useState(0);
  const [processed, setProcessed] = useState(0);

  const [activeProduce, setActiveProduce] = useState<number | null>(null);
  const [activeConsume, setActiveConsume] = useState<number | null>(null);
  const [highlightEventId, setHighlightEventId] = useState<number | null>(null);

  const [explanation, setExplanation] = useState<Explanation>(null);
  const [autoProduce, setAutoProduce] = useState(false);
  const [autoConsume, setAutoConsume] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);

  const partitionIndex = ((key % TOTAL_PARTITIONS) + TOTAL_PARTITIONS) % TOTAL_PARTITIONS;
  const lag = produced - processed;

  
  const partitionsRef = useRef(partitions);
  const offsetsRef = useRef(offsets);
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    partitionsRef.current = partitions;
  }, [partitions]);
  useEffect(() => {
    offsetsRef.current = offsets;
  }, [offsets]);
  
useLayoutEffect(() => {
  if (scrollTarget === null) return;

  scrollToPair(scrollTarget);

  setScrollTarget(null);
}, [scrollTarget]);

  /* ACTIONS */
  const produceEvent = (typeArg?: string, keyArg?: number) => {
    const et = typeArg ?? eventType;
    const k = keyArg ?? key;
    const pIndex = ((k % TOTAL_PARTITIONS) + TOTAL_PARTITIONS) % TOTAL_PARTITIONS;
    const newEvent: EventType = {
      id: Date.now() + Math.random(),
      type: et,
      key: k,
    };

    setPartitions((prev) => {
      const next = prev.map((p) => [...p]);
      next[pIndex].push(newEvent);
      return next;
    });
    setProduced((p) => p + 1);
    setActiveProduce(pIndex);
    
    setHighlightEventId(newEvent.id);

    setExplanation({
      type: "produce",
      eventType: et,
      key: k,
      partition: pIndex,
      offsetAt: partitionsRef.current[pIndex].length,
    });

    addLog("produce", `${et}  key=${k}  →  P${pIndex}`);

    setTimeout(() => setActiveProduce(null), 700);
    setTimeout(
      () => setHighlightEventId((h) => (h === newEvent.id ? null : h)),
      1000
    );
  };

  const consumeStep = () => {
    const parts = partitionsRef.current;
    const offs = offsetsRef.current;

    for (let i = 0; i < TOTAL_PARTITIONS; i++) {
      if (offs[i] < parts[i].length) {
        const evt = parts[i][offs[i]];
        const prevOffset = offs[i];

        setOffsets((prev) => {
          const n = [...prev];
          n[i] = prevOffset + 1;
          return n;
        });
        setProcessed((p) => p + 1);
        setActiveConsume(i);
        const p = partitionRefs.current[i];
const c = consumerRefs.current[i];

const willBeLast =
  offsetsRef.current[i] + 1 >= partitionsRef.current[i].length;

if (p && c && autoFollow && !willBeLast) {
  if (!(isVisible(p) && isVisible(c))) {
    setScrollTarget(i);
  }
}
        setHighlightEventId(evt.id);

        setExplanation({
          type: "consume",
          partition: i,
          eventType: evt.type,
          key: evt.key,
          prevOffset,
          newOffset: prevOffset + 1,
        });

        addLog("consume", `P${i}[${prevOffset}]  ${evt.type}  key=${evt.key}`);

        setTimeout(() => setActiveConsume(null), 700);
        setTimeout(
          () => setHighlightEventId((h) => (h === evt.id ? null : h)),
          1000
        );
        return;
      }
    }

    addLog("info", "No events to consume — all partitions caught up");
    setExplanation(null);
  };

  const reset = () => {
  setAutoProduce(false);
  setAutoConsume(false);
  setScrollTarget(null); // ✅ IMPORTANT

  requestAnimationFrame(() => {
    setPartitions(() =>
      Array.from({ length: TOTAL_PARTITIONS }, () => [])
    );
    setOffsets(() =>
      Array.from({ length: TOTAL_PARTITIONS }, () => 0)
    );
    setLogs([]);
    setProduced(0);
    setProcessed(0);
    setExplanation(null);
    setActiveProduce(null);
    setActiveConsume(null);
    setHighlightEventId(null);
  });
};

  const addLog = (kind: "produce" | "consume" | "info", msg: string) => {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
  {
    id: Date.now() + Math.random(),
    text: `${kind}|${stamp}|${msg}`,
  },
  ...prev,
].slice(0, 15));
  };
  const isVisible = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 120 &&  
    rect.bottom <= window.innerHeight - 80
  );
};
const scrollToPair = (i: number) => {
  const p = partitionRefs.current[i];
  const c = consumerRefs.current[i];

  if (!p || !c) return;

  
  if (isVisible(p) && isVisible(c)) return;

  const pTop = p.getBoundingClientRect().top + window.scrollY;

  const target = pTop - 120;

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const finalScroll = Math.max(0, Math.min(target, maxScroll));

  window.scrollTo({
    top: finalScroll,
    behavior: "smooth",
  });
};


  /* Auto loops */
  useEffect(() => {
    if (!autoProduce) return;
    const id = setInterval(() => {
      const t = EVENT_OPTIONS[Math.floor(Math.random() * EVENT_OPTIONS.length)];
      const k = Math.floor(Math.random() * 9) + 1;
      produceEvent(t, k);
    }, 3000);
    return () => clearInterval(id);
  }, [autoProduce]);

  useEffect(() => {
    if (!autoConsume) return;
    const id = setInterval(() => consumeStep(),3000);
    return () => clearInterval(id);
  }, [autoConsume]);

  /* ------------------------ UI ------------------------ */
  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <header style={headerWrap}>
          <div>
            
            <h1 style={title}>Kafka Simulator</h1>
            <p style={subtitle}>
              Watch how producers, partitions, and consumers really work —
              with the exact formula, offset motion, and lag explained live.
            </p>
            <a
  href="https://kafka.apache.org/42/getting-started/introduction/"
  target="_blank"
  rel="noopener noreferrer"
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  style={{
    marginTop: "0px",
    display: "inline-block",
    fontSize: "14px",
    color: "#a78bfa",
    textDecoration: "none",
    borderBottom: "1px solid rgba(167,139,250,0.4)",
    paddingBottom: "2px",
  }}
>
  Explore Kafka in depth →
</a>
          </div>

          <StatsTiles produced={produced} processed={processed} lag={lag} />
        </header>

        <div style={mainLayout}>
            <div style={leftPanel}>
  
{/* CONTROLS */}
        <section style={card}>
          <div style={panelHead}>
            <span style={{ ...dot, background: "#a78bfa", boxShadow: "0 0 10px #a78bfa" }} />
            <span style={panelTitle}>Controls</span>
          </div>

          <div style={controlsRow}>
            <Field label="Event type">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={input}
              >
                {EVENT_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Key (number)">
              <input
                type="number"
                value={key}
                onChange={(e) => setKey(Number(e.target.value) || 0)}
                style={input}
              />
            </Field>

            <Field label="Predicted partition">
              <div style={predictPill}>
                <Hash size={12} />
                <span style={{ color: "#94a3b8" }}>
                  {key} % {TOTAL_PARTITIONS} =
                </span>
                <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                  {partitionIndex}
                </span>
                <ChevronRight size={12} color="#475569" />
                <span style={{ color: "#e5e7eb" }}>P{partitionIndex}</span>
              </div>
            </Field>

            <div style={{ flex: 1 }} />

            <button onClick={() => produceEvent()} style={btnPrimary}>
              <Send size={14} /> Produce
            </button>
            <button onClick={consumeStep} style={btnGreen}>
              <Inbox size={14} /> Consume
            </button>
            <button onClick={reset} style={btnGhost}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div style={autoRow}>
  {/* LEFT: stacked buttons */}
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <AutoToggle
      label="auto-produce"
      active={autoProduce}
      color="#a78bfa"
      onToggle={() => setAutoProduce((v) => !v)}
    />
    <AutoToggle
      label="auto-consume"
      active={autoConsume}
      color="#22c55e"
      onToggle={() => setAutoConsume((v) => !v)}
    />
    <button onClick={() => setAutoFollow((v) => !v)}>
  {autoFollow ? "Auto-follow ON" : "Auto-follow OFF"}
</button>
  
  </div>

  {/* RIGHT: text */}
  <div
    style={{
      marginLeft: "auto",
      fontSize: 12,
      color: "#64748b",
      textAlign: "right",
      maxWidth: 140,
      lineHeight: 1.5,
    }}
  >
    Run both to see{" "}
    <span style={{ color: "#eab308", fontWeight: 600 }}>lag</span>{" "}
    
  </div>
</div>

</section> 
</div>  
<div style={centerPanel}>
        {/* FLOW */}
        <section style={cardCenter}>
          <Flow
            activeProduce={activeProduce}
            activeConsume={activeConsume}
            predicted={partitionIndex}
            eventType={eventType}
            eventKey={key}
          />
        </section>

        {/* GRID */}
        <div
  style={{
    display: "grid",
    gridTemplateColumns:
      typeof window !== "undefined" && window.innerWidth < 768
        ? "1fr"
        : "1.6fr 1fr",
    gap: 22,
    alignItems: "start",
    minWidth: 0,
  }}
>
          {/* LEFT */}
          <div style={col}>
            <section style={card}>
              <div style={panelHead}>
                <span
                  style={{
                    ...dot,
                    background: "#a78bfa",
                    boxShadow: "0 0 10px #a78bfa",
                  }}
                />
                <span style={panelTitle}>Partitions</span>
                <span style={panelSub}>
                  topic: events · append-only log
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {partitions.map((p, i) => (
                    <div ref={(el) => {
  partitionRefs.current[i] = el;
}} key={i}>
                  <PartitionCard
                  
                   
                    index={i}
                    events={p}
                    offset={offsets[i]}
                    isProducing={activeProduce === i}
                    isConsuming={activeConsume === i}
                    highlightId={highlightEventId}
                    autoFollow={autoFollow}
                  />
                  </div>
                ))}
              </div>
              
            </section>

            <section style={card}>
              <div style={panelHead}>
                <span
                  style={{
                    ...dot,
                    background: "#22c55e",
                    boxShadow: "0 0 10px #22c55e",
                  }}
                />
                <span style={panelTitle}>Consumers</span>
                <span style={panelSub}>one per partition</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {offsets.map((o, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                        consumerRefs.current[i] = el;
                        }}
                    >
                        <ConsumerRow
                        index={i}
                        offset={o}
                        length={partitions[i].length}
                        active={activeConsume === i}
                        />
                    </div>
                    ))}
              </div>
            </section>
          </div>
          <div style={col}>
  <section style={card}>
    <div style={panelHead}>
      <span style={{ ...dot, background: "#eab308" }} />
      <span style={panelTitle}>Explanation</span>
    </div>
    <ExplanationPanel data={explanation} />
  </section>

  <section style={card}>
    <div style={panelHead}>
      <span style={{ ...dot, background: "#64748b" }} />
      <span style={panelTitle}>Key insights</span>
    </div>

    <ul style={insightList}>
      <li>
        <span style={chipPurple}>same key</span> always maps to the
        same partition — order is preserved per key.
      </li>
      <li>
        <span style={chipGreen}>offset</span> is the index of the
        next event to read.
      </li>
      <li>
        Consuming does <b style={{ color: "#fb7185" }}>not delete</b> events.
      </li>
      <li>
        <span style={chipAmber}>lag</span> = produced − processed.
      </li>
    </ul>
  </section>
</div>

          
        </div>
        
        </div>
        </div>

        {/* LOGS */}
        <section style={card}>
          <div style={panelHead}>
            <span
              style={{
                ...dot,
                background: "#8cb4cd",
                boxShadow: "0 0 10px #8cb4cd",
              }}
            />
            <span style={panelTitle}>Activity log</span>
            <span style={panelSub}>most recent first</span>
          </div>

          <div style={logBox}>
            {logs.length === 0 && (
              <div style={{ color: "#475569" }}>No activity yet…</div>
            )}
            <AnimatePresence initial={false}>
              {logs.map((l)  => {
  const [kind, stamp, msg] = l.text.split("|");
                const color =
                  kind === "produce"
                    ? "#a78bfa"
                    : kind === "consume"
                    ? "#22c55e"
                    : "#64748b";
                return (
                  <motion.div key={l.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "6px 8px",
                      borderLeft: `2px solid ${color}`,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#475569", minWidth: 74 }}>
                      {stamp}
                    </span>
                    <span
                      style={{
                        color,
                        minWidth: 70,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {kind}
                    </span>
                    <span style={{ 
    color: "#cbd5e1",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}>{msg}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}


/*  STATS*/


function StatsTiles({
  produced,
  processed,
  lag,
}: {
  produced: number;
  processed: number;
  lag: number;
}) {
  const lagColor = lag === 0 ? "#22c55e" : lag < 5 ? "#eab308" : "#fb7185";
  return (
    <div style={statsTiles}>
      <Tile label="produced" value={produced} color="#a78bfa" />
      <TileDivider />
      <Tile label="processed" value={processed} color="#22c55e" />
      <TileDivider />
      <Tile label="lag" value={lag} color={lagColor} glow />
    </div>
  );
}

function Tile({
  label,
  value,
  color,
  glow,
}: {
  label: string;
  value: number;
  color: string;
  glow?: boolean;
}) {
  return (
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: -1,
          color,
          textShadow: glow ? `0 0 20px ${color}44` : "none",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}

function TileDivider() {
  return <div style={{ width: 1, height: 36, background: "#1e293b" }} />;
}


/*  PARTITION*/


function PartitionCard({
  index,
  events,
  offset,
  isProducing,
  isConsuming,
  highlightId,
    autoFollow,
}: {
  index: number;
  events: EventType[];
  offset: number;
  isProducing: boolean;
  isConsuming: boolean;
  highlightId: number | null;
  autoFollow: boolean; 
}) {
  const partitionLag = events.length - offset;
  const rowRef = useRef<HTMLDivElement | null>(null);
  const prevLength = useRef(events.length);
  

useEffect(() => {
  if (!rowRef.current) return;
  if (!autoFollow) return;   

  if (events.length > prevLength.current) {
   
    rowRef.current.scrollTo({
      left: rowRef.current.scrollWidth,
      behavior: "smooth",
    });
  } else {
   
    const child = rowRef.current.children[offset] as HTMLElement;
    child?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }

  prevLength.current = events.length;
}, [events.length, offset, autoFollow]);
  return (
    <motion.div
      animate={{
        borderColor: isProducing
          ? "#a78bfa"
          : isConsuming
          ? "#22c55e"
          : "#1e293b",
        boxShadow: isProducing
          ? "0 0 0 1px #a78bfa, 0 0 24px rgba(167,139,250,0.25)"
          : isConsuming
          ? "0 0 0 1px #22c55e, 0 0 24px rgba(34,197,94,0.25)"
          : "none",
      }}
      transition={{ duration: 0.2 }}
      style={partitionBox}
    >
      <div style={partitionHead}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Database size={13} color="#a78bfa" />
          <span style={{ fontWeight: 600, color: "#e5e7eb" }}>
            Partition {index}
          </span>
        </div>
        <div style={partitionMeta}>
          <span>offset: <b style={{ color: "#a78bfa" }}>{offset}</b></span>
          <span>length: {events.length}</span>
          <span>
            lag:{" "}
            <b
              style={{
                color:
                  partitionLag === 0
                    ? "#22c55e"
                    : partitionLag < 3
                    ? "#eab308"
                    : "#fb7185",
              }}
            >
              {partitionLag}
            </b>
          </span>
        </div>
      </div>

      <div ref={rowRef} style={eventsRow} className="eventsRow">
        {events.length === 0 && (
          <div style={emptyRow}>· empty log ·</div>
        )}

        <AnimatePresence initial={false}>
          {events.map((e, idx) => {
            const isRead = idx < offset;
            const isNext = idx === offset;
            const isHighlighted = highlightId === e.id;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, scale: 0.8, y: -6 }}
                animate={{
                  opacity: isRead ? 0.35 : 1,
                  scale: isHighlighted ? 1.06 : 1,
                  y: 0,
                }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "relative",
                  minWidth: 108,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isRead
                    ? "rgba(15,23,42,0.5)"
                    : isNext
                    ? "rgba(34,197,94,0.08)"
                    : "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(15,23,42,0.4))",
                  border: `1px solid ${
                    isHighlighted
                      ? isRead
                        ? "#22c55e"
                        : "#a78bfa"
                      : isNext
                      ? "#22c55e"
                      : "#1e293b"
                  }`,
                }}
              >
                {isNext && (
                  <div style={nextPointer}>▼ next read</div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "#64748b",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  <span>[{idx}]</span>
                  <span>k={e.key}</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isRead ? "#64748b" : "#e5e7eb",
                    marginTop: 2,
                    textDecoration: isRead ? "line-through" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.type}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/*  CONSUMER */


function ConsumerRow({
  index,
  offset,
  length,
  active,
}: {
  index: number;
  offset: number;
  length: number;
  active: boolean;
}) {
  const lag = length - offset;
  const progress = length === 0 ? 0 : (offset / length) * 100;
  return (
    <motion.div
      animate={{
        borderColor: active ? "#22c55e" : "#1e293b",
        background: active ? "rgba(34,197,94,0.06)" : "transparent",
      }}
      style={consumerBox}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Inbox size={13} color="#22c55e" />
        <span style={{ fontWeight: 600 }}>Consumer {index}</span>
        <span style={{ color: "#64748b", fontSize: 12 }}>→ P{index}</span>
      </div>

      <div style={{ flex: 1, padding: "0 12px" }}>
        <div style={progressTrack}>
          <div
            style={{
              ...progressFill,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 12,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <span style={{ color: "#94a3b8" }}>
          offset: <b style={{ color: "#22c55e" }}>{offset}</b>
        </span>
        <span style={{ color: "#94a3b8" }}>
          lag:{" "}
          <b
            style={{
              color:
                lag === 0 ? "#22c55e" : lag < 3 ? "#eab308" : "#fb7185",
            }}
          >
            {lag}
          </b>
        </span>
      </div>
    </motion.div>
  );
}


/*  EXPLANATION*/


function ExplanationPanel({ data }: { data: Explanation }) {
  if (!data) {
    return (
      <div style={explainEmpty}>
        <Zap size={22} color="#475569" />
        <div style={{ marginTop: 10, color: "#64748b", fontSize: 14 }}>
          Produce or consume an event to see what Kafka is doing.
        </div>
      </div>
    );
  }

  if (data.type === "produce") {
    return (
      <motion.div
        key={data.type}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div style={explainHeaderPurple}>
          <Send size={13} /> EVENT PRODUCED
        </div>

        <Block title="Producer">
          Event <Hl>{data.eventType}</Hl> with key <Hl>{data.key}</Hl>.
        </Block>

        <Block title="Partition selection">
          <Mono>partition = key % total_partitions</Mono>
          <Mono>
            partition = {data.key} % {TOTAL_PARTITIONS} = <Hl>{data.partition}</Hl>
          </Mono>
          <Dim>
            Appended at <Mono inline>partition[{data.partition}][{data.offsetAt}]</Mono>.
          </Dim>
        </Block>

        <Block title="Why it matters">
          Every event with key <Hl>{data.key}</Hl> will always land in
          partition <Hl>{data.partition}</Hl>. Within a partition, order is
          preserved, so all events sharing this key are processed in the
          order they were produced.
          <div style={invariantPill}>
            SAME KEY → SAME PARTITION → ORDER GUARANTEED
          </div>
        </Block>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={data.type}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={explainHeaderGreen}>
        <Inbox size={13} /> EVENT CONSUMED
      </div>

      <Block title="Consumer">
        Consumer <Hl>{data.partition}</Hl> processed event{" "}
        <Hl>{data.eventType}</Hl> (key <Hl>{data.key}</Hl>).
      </Block>

      <Block title="Offset moved">
        <Mono>
          offset[{data.partition}] : {data.prevOffset} → <Hl>{data.newOffset}</Hl>
        </Mono>
        <Dim>
          Offset points to the <b>next</b> event to read — not the last one
          read. The event itself stays in the log.
        </Dim>
      </Block>

      <Block title="Log is immutable">
        Kafka never removes events on consume. Multiple consumer groups can
        replay the same partition from any offset.
        <div style={invariantPillGreen}>
          OFFSET MOVES · EVENTS STAY · ORDER HOLDS
        </div>
      </Block>
    </motion.div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#64748b",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        color: "#a78bfa",
        fontWeight: 700,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {children}
    </span>
  );
}

function Mono({
  children,
  inline,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <div
      style={{
        display: inline ? "inline-block" : "block",
        background: "rgba(2,6,23,0.7)",
        border: "1px solid #1e293b",
        borderRadius: 6,
        padding: inline ? "2px 6px" : "8px 10px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        color: "#e5e7eb",
        marginTop: inline ? 0 : 6,
      }}
    >
      {children}
    </div>
  );
}

function Dim({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 6, color: "#64748b", fontSize: 12 }}>
      {children}
    </div>
  );
}


/*  FLOW */


function Flow({
  activeProduce,
  activeConsume,
  predicted,
  eventType,
  eventKey,
}: {
  activeProduce: number | null;
  activeConsume: number | null;
  predicted: number;
  eventType: string;
  eventKey: number;
}) {
  return (
    <div style={flow}>
      <FlowNode
        label="Producer"
        sub={`${eventType} · k=${eventKey}`}
        color="#a78bfa"
        pulsing={activeProduce !== null}
      />
      <Wire
        active={activeProduce !== null}
        color="#a78bfa"
        payload={activeProduce !== null ? `→ P${activeProduce}` : null}
      />
      <FlowNode
        label="Broker"
        sub="routes & persists"
        color="#8cb4cd"
      />
      <Wire active={activeProduce !== null || activeConsume !== null} color="#64748b" />
      <FlowNode
        label="Topic"
        sub={`${TOTAL_PARTITIONS} partitions`}
        color="#8cb4cd"
      />
      <Wire
        active={activeConsume !== null}
        color="#22c55e"
        payload={activeConsume !== null ? `P${activeConsume} →` : null}
      />
      <FlowNode
        label="Consumer"
        sub={activeConsume !== null ? `reading P${activeConsume}` : "idle"}
        color="#22c55e"
        pulsing={activeConsume !== null}
      />
    </div>
  );
}

function FlowNode({
  label,
  sub,
  color,
  pulsing,
}: {
  label: string;
  sub: string;
  color: string;
  pulsing?: boolean;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: pulsing
          ? `0 0 0 1px ${color}, 0 0 24px ${color}66`
          : `0 0 0 1px #1e293b`,
      }}
      style={{
        padding: "12px 16px",
        borderRadius: 10,
        background: "#020617",
        minWidth: 140,
      }}
    >
      <div style={{ color, fontSize: 12, letterSpacing: 1.5, fontWeight: 600 }}>
        {label}
      </div>
      <div
        style={{
          color: "#64748b",
          fontSize: 11,
          marginTop: 4,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {sub}
      </div>
    </motion.div>
  );
}

function Wire({
  active,
  color,
  payload,
}: {
  active: boolean;
  color: string;
  payload?: string | null;
}) {
  return (
    <div style={wireWrap}>
      <div style={{ ...wire, background: "#1e293b" }}>
        {active && (
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
        )}
      </div>
      {payload && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            color,
            whiteSpace: "nowrap",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {payload}
        </motion.div>
      )}
    </div>
  );
}


/*  PRIMITIVES  */


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function AutoToggle({
  label,
  active,
  color,
  onToggle,
}: {
  label: string;
  active: boolean;
  color: string;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",  
  gap: 6,                    
  padding: "6px 10px",        
  borderRadius: 999,
  border: `1px dashed ${active ? color : "#1e293b"}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : "#64748b",
  fontSize: 11,              
  cursor: "pointer",
  fontFamily: "inherit",
  minWidth: 110,              
}}
    >
      {active ? <Pause size={12} /> : <Play size={12} />}
      {label}
      {active && (
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: color,
          }}
        />
      )}
    </button>
  );
}


/*  STYLES */


const page: React.CSSProperties = {
  background: "radial-gradient(circle at top, #0b1220, #020617 70%)",
  minHeight: "100vh",
  padding: "48px 20px 80px",
  color: "#e2e8f0",
  fontFamily: "ui-sans-serif, system-ui, -apple-system",
};

const container: React.CSSProperties = {
  maxWidth: "1500px",   
  margin: "0 auto",
  padding: "0 16px",
  display: "flex",
  flexDirection: "column",
  gap: 22,
};

const headerWrap: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 20,
  borderBottom: "1px solid #1e293b",
  paddingBottom: 22,
};

const eyebrow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: "#a78bfa",
};

const title: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: 44,
  fontWeight: 700,
  letterSpacing: -1.5,
  background: "linear-gradient(90deg, #e5e7eb, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitle: React.CSSProperties = {
  color: "#94a3b8",
  marginTop: 10,
  maxWidth: 640,
  lineHeight: 1.7,
};

const statsTiles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: "12px 20px",
  border: "1px solid #1e293b",
  borderRadius: 14,
  background: "rgba(15,23,42,0.6)",
};

const card: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 14,
  padding: 20,
  position: "relative",
};

const cardCenter: React.CSSProperties = {
  ...card,
  display: "flex",
  justifyContent: "center",
};

const panelHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  paddingBottom: 14,
  marginBottom: 14,
  borderBottom: "1px dashed #1e293b",
};

const dot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 99,
};

const panelTitle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "#e5e7eb",
  fontWeight: 600,
};

const panelSub: React.CSSProperties = {
  marginLeft: "auto",
  color: "#64748b",
  fontSize: 11,
};

const controlsRow: React.CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "flex-end",
  flexWrap: "wrap",
};

const autoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", 
  gap: 16,
  marginTop: 16,
  paddingTop: 14,
  borderTop: "1px dashed #1e293b",
};

const input: React.CSSProperties = {
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#e5e7eb",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  minWidth: 160,
};

const predictPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 12px",
  border: "1px dashed rgba(167,139,250,0.5)",
  borderRadius: 8,
  background: "rgba(124,58,237,0.08)",
  fontSize: 12,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

const btnGreen: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #1e293b",
  background: "transparent",
  color: "#94a3b8",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.6fr 1fr",
  gap: 22,
};
const col: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 22,
  minWidth: 0,   
};

const partitionBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #1e293b",
  background: "#020617",

  width: "100%",
  overflow: "hidden",   
};

const partitionHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const partitionMeta: React.CSSProperties = {
  display: "flex",
  gap: 14,
  fontSize: 11,
  color: "#94a3b8",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
const eventsRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  overflowY: "hidden",
  maxWidth: "100%",
};

const emptyRow: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  padding: "18px 0",
  color: "#475569",
  fontSize: 12,
  fontStyle: "italic",
  border: "1px dashed #1e293b",
  borderRadius: 8,
};

const nextPointer: React.CSSProperties = {
  position: "absolute",
  top: -16,
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: 10,
  color: "#22c55e",
  whiteSpace: "nowrap",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const consumerBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #1e293b",
  gap: 12,
};

const progressTrack: React.CSSProperties = {
  height: 4,
  background: "#1e293b",
  borderRadius: 99,
  overflow: "hidden",
};

const progressFill: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(90deg, #22c55e, #86efac)",
  transition: "width 0.4s ease",
};

const explainEmpty: React.CSSProperties = {
  padding: "24px 8px",
  textAlign: "center",
};

const explainHeaderPurple: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 99,
  background: "rgba(124,58,237,0.15)",
  color: "#a78bfa",
  fontSize: 11,
  letterSpacing: 1.5,
  alignSelf: "flex-start",
  width: "fit-content",
};

const explainHeaderGreen: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 99,
  background: "rgba(34,197,94,0.15)",
  color: "#22c55e",
  fontSize: 11,
  letterSpacing: 1.5,
  width: "fit-content",
};

const invariantPill: React.CSSProperties = {
  marginTop: 10,
  padding: "8px 12px",
  borderRadius: 8,
  background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.08))",
  border: "1px solid rgba(167,139,250,0.3)",
  fontSize: 11,
  letterSpacing: 1.5,
  color: "#a78bfa",
  fontWeight: 600,
  textAlign: "center",
};

const invariantPillGreen: React.CSSProperties = {
  marginTop: 10,
  padding: "8px 12px",
  borderRadius: 8,
  background:
    "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(134,239,172,0.08))",
  border: "1px solid rgba(34,197,94,0.3)",
  fontSize: 11,
  letterSpacing: 1.5,
  color: "#22c55e",
  fontWeight: 600,
  textAlign: "center",
};

const insightList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  fontSize: 13,
  color: "#cbd5e1",
  lineHeight: 1.7,
};

const chipPurple: React.CSSProperties = {
  padding: "1px 8px",
  borderRadius: 4,
  background: "rgba(124,58,237,0.15)",
  color: "#a78bfa",
  fontSize: 11,
  marginRight: 2,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const chipGreen: React.CSSProperties = {
  padding: "1px 8px",
  borderRadius: 4,
  background: "rgba(34,197,94,0.15)",
  color: "#22c55e",
  fontSize: 11,
  marginRight: 2,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const chipAmber: React.CSSProperties = {
  padding: "1px 8px",
  borderRadius: 4,
  background: "rgba(234,179,8,0.15)",
  color: "#eab308",
  fontSize: 11,
  marginRight: 2,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const logBox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  maxHeight: 220,
  overflowY: "auto",
  overflowX: "hidden",
};

const flow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  justifyContent: "center",
};

const wireWrap: React.CSSProperties = {
  position: "relative",
  flex: 1,
  minWidth: 60,
 
};

const wire: React.CSSProperties = {
  height: 2,
  width: "100%",
  position: "relative",
  overflow: "hidden",
  borderRadius: 2,
};


const mainLayout = {
  display: "grid",
  gridTemplateColumns:
    typeof window !== "undefined" && window.innerWidth < 768
      ? "1fr"
      : "300px 1fr",
  gap: 24,
  alignItems: "start",
};

const leftPanel: React.CSSProperties = {
  position: typeof window !== "undefined" && window.innerWidth < 768
    ? "static"
    : "sticky",
  top: 20,
  height: "fit-content",
};

const centerPanel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 22,
};

const rightPanel = {
  position: "sticky",
  top: 20,
  height: "fit-content",
};

