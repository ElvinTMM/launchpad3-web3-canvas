import { useEffect, useRef, useState } from "react";

const DELTA = 12;

export function useNavbarScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 72) {
        setHidden(false);
      } else if (y > lastY.current + DELTA) {
        setHidden(true);
      } else if (y < lastY.current - DELTA) {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
