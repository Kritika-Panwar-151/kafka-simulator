export default function WhatIsKafka() {
  return (
    <section id="what"
      style={{
        position: "relative",
        paddingTop: "0px",
        paddingBottom: "30px",
        textAlign: "center",
      }}
    >
      

      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* TITLE */}
        <h2 className="section-title gradient-text">
  What is Kafka?
</h2>

        {/* MAIN LINE */}
<p style={{
  marginTop: "32px",
  maxWidth: "900px",
  marginInline: "auto",
  fontSize: "20px",
fontWeight: 500,
color: "#f1f5f9",
  lineHeight: 1.7,
 
}}>
  <span style={{ color: "#a78bfa", fontWeight: 600 }}>
    Apache Kafka
  </span>{" "}
  is a distributed event streaming platform used to handle real-time data.
</p>

{/* SECOND LINE */}
<p style={{
  marginTop: "16px",
  fontSize: "18px",
  color: "#cbd5f5",
}}>
  It enables systems to send, store, and process events in a reliable and scalable way.
</p>

{/* SUPPORT (grouped, tighter) */}
<div style={{
  marginTop: "24px",
  maxWidth: "750px",
  marginInline: "auto",
   color: "#d1d9ff", 
fontSize: "17px",   // slightly bigger for readability
  lineHeight: 1.7,
}}>
  <p>
    An <span style={{ color: "#a78bfa", fontWeight: 500 }}>event</span> is a record of something that has occurred, such as
    "order_created" or "payment_completed".
  </p>

  <p style={{ marginTop: "5px" }}>
    Kafka acts as a <span style={{ color: "#a78bfa" }}>central data backbone</span> where events are written once
    and can be consumed by multiple systems independently.
  </p>

  <p style={{ marginTop: "5px" }}>
    This reduces system coupling and supports real-time data processing at scale.
  </p>
</div>

{/* FINAL LINE */}
<p style={{
  marginTop: "40px",
  fontSize: "16px",
  color: "#a78bfa",
  fontWeight: 500,
}}>
  Not just messaging — Kafka is persistent, scalable event storage.
</p>
      </div>
    </section>
  );
}