# 🚀 Kafka Simulator

An interactive web application to visualize how Apache Kafka works — including producers, partitions, consumers, offsets, and real-time event flow.

🔗 Live Demo: https://kafka-simulator.vercel.app  


---

## 📌 Why This Project?

Modern systems generate massive amounts of real-time data — orders, payments, logs, notifications, and more.

Handling this data efficiently is challenging:
- Systems become tightly coupled
- Failures can cause data loss
- Scaling becomes difficult
- Real-time processing is hard

**Apache Kafka solves these problems** using an event-driven architecture.

However, Kafka concepts like **partitions, offsets, and consumer lag are difficult to understand without visualization.**

👉 This project was built to make Kafka **intuitive, visual, and easy to grasp**.

---

## 📌 What is Kafka (in simple terms)?

Kafka is a **distributed event streaming platform** that:
- Stores data as a continuous stream of events
- Allows multiple systems to read the same data independently
- Scales horizontally to handle high throughput
- Ensures durability and fault tolerance

---

## ⚙️ What This Simulator Shows

This simulator helps you understand:

- How producers send events
- How events are routed to partitions  
  `partition = key % total_partitions`
- How consumers read events using offsets
- Why data is not deleted after consumption
- How consumer lag is created and reduced

---

## ⚙️ Features

- 🎯 Interactive simulation (produce & consume events)
- 📊 Partition logic visualization
- 🔁 Offset tracking (next event to read)
- 📉 Consumer lag visualization
- 🧠 Live explanation panel for each action
- ⚡ Real-time updates

---

## 🧱 Tech Stack

- Next.js (App Router)
- React
- Framer Motion
- CSS / Inline styling
- Vercel (Deployment)

---

## 🧠 Concepts Covered

- Event Streaming
- Producers & Consumers
- Brokers
- Topics & Partitions
- Offsets
- Consumer Lag
- Data immutability

---

## 🎮 How to Use

1. Open the Live Demo
2. Enter:
   - Event type (e.g. `order_created`)
   - Key value
3. Click **Produce**
4. Observe which partition the event goes to
5. Click **Consume**
6. Watch offset movement and explanation updates

---

## 🎯 Key Takeaways

- Same key → same partition → preserves order  
- Offsets track position, not deletion  
- Data remains in Kafka even after consumption  
- Multiple consumers can read the same data independently  

---

## 📸 Preview

(Add screenshots here)

---

## 📈 Future Improvements

- Multiple consumer groups
- Topic switching
- Retention simulation
- Real Kafka integration

---

## 📚 Learn More

Official Kafka Documentation:  
https://kafka.apache.org/documentation/

---

## ⭐ If you found this useful

Give it a star ⭐ and share it!