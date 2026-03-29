import { useCallback, useEffect, useState } from "react";

export function useInView() {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [node]);

  return { ref, isVisible };
}
