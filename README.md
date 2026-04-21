# 🚀 Kafka Simulator

An interactive web application to visualize how Apache Kafka works — including producers, partitions, consumers, offsets, and real-time event flow.

🔗 Live Demo: https://kafka-simulator.vercel.app  


---

## 📌 Overview

Understanding Kafka conceptually is easy — but visualizing how data actually flows is not.

This simulator helps you:
- See how events are produced and routed
- Understand partitions and key-based distribution
- Learn how consumers read data using offsets
- Visualize consumer lag in real time

---

## ⚙️ Features

- 🎯 Interactive simulation (produce & consume events)
- 📊 Partition logic using key-based routing  
  `partition = key % total_partitions`
- 🔁 Offset tracking (next event to read)
- 📉 Consumer lag visualization
- 🧠 Step-by-step explanation panel
- ⚡ Real-time UI updates

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
- Data immutability in Kafka

---

## 🎮 How to Use

1. Go to the Live Demo
2. Enter:
   - Event type (e.g. `order_created`)
   - Key value
3. Click **Produce**
4. Observe partition assignment
5. Click **Consume**
6. Watch offset movement and explanation updates

---

## 🎯 Purpose

This project was built to:
- Make Kafka easier to understand visually
- Demonstrate system design concepts interactively
- Serve as a learning tool for beginners

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

Official Kafka Docs:  
https://kafka.apache.org/documentation/

---

## ⭐ If you found this useful

Give it a star ⭐ and share it!