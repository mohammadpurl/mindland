import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function AnimationCompareOnce() {
  const { animations: m3 } = useGLTF("/models/CIP_motion3.glb");
  const { animations: cip8 } = useGLTF("/models/CIP8.glb");

  useEffect(() => {
    const mapM3 = new Map(m3.map(c => [c.name.toLowerCase(), c]));
    const mapCIP8 = new Map(cip8.map(c => [c.name.toLowerCase(), c]));

    const missingInM3 = [];
    const durationDiff = [];
    const tol = 0.1; // ثانیه

    for (const [name, c8] of mapCIP8.entries()) {
      const m3c = mapM3.get(name);
      if (!m3c) {
        missingInM3.push(c8.name);
      } else if (Math.abs(c8.duration - m3c.duration) > tol) {
        durationDiff.push({ name: c8.name, cip8: c8.duration.toFixed(3), motion3: m3c.duration.toFixed(3) });
      }
    }

    console.log("[COMPARE] total CIP8:", cip8.length, "total motion3:", m3.length);
    console.log("[COMPARE] Missing in CIP_motion3:", missingInM3);
    console.log("[COMPARE] Duration differences (>|0.1s|):", durationDiff);
  }, [m3, cip8]);

  return null;
}