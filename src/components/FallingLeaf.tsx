// FallingLeaves.tsx
import { motion } from "framer-motion";
import type { JSX } from "react";
import { PiPlantFill } from "react-icons/pi";
import { useEffect, useState } from "react";

const Leaf = ({ delay = 0 }) => {
  const left = Math.random() * window.innerWidth;
  const duration = 5 + Math.random() * 5;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: 0, x: left }}
      animate={{ y: window.innerHeight + 100, opacity: 1, rotate: 360 }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
        repeat: 30,
        repeatType: "loop",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
        
      <PiPlantFill className="z-[-1]" size={40} color="#48bd28" />
    </motion.div>
  );
};


interface FallingLeavesProps {
  quantity?: number;
}

const FallingLeaves: React.FC<FallingLeavesProps> = ({ quantity = 10 }) => {
  const [leaves, setLeaves] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: quantity }).map((_, i) => (
      <Leaf key={i} delay={i * 0.5} />
    ));
    setLeaves(newLeaves);
  }, [quantity]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      {leaves}
    </div>
  );
};

export default FallingLeaves;
