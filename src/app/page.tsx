import Hero from "@/components/learn/Hero";
import WhatIsKafka from "@/components/learn/WhatIsKafka";
import WhyKafka from "@/components/learn/WhyKafka";
import Flow from "@/components/learn/Flow";
import Concepts from "@/components/learn/Concepts";

import ConceptPills from "@/components/ConceptPills";
import Divider from "@/components/ui/Divider";


export default function Home() {
  return (
    <>
      {/* 🔥 HERO */}
      <Hero />

      <ConceptPills /> 

    <Divider />
      {/* 📘 WHAT */}
      <WhatIsKafka />

      <Divider />

      {/* 📘 WHY */}
      <WhyKafka />

      <Divider />

      {/* ⚡ FLOW */}
      <Flow />

      <Divider />

      {/* 🧠 CONCEPTS */}
      <Concepts />

      <Divider />

      
    </>
  );
}