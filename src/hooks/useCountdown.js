import { useEffect, useState } from "react";

const emptyTimeLeft = { days: "00", hours: "00", minutes: "00", seconds: "00" };

export const useCountdown = (festivalDateValue) => {
  const festivalDate = new Date(festivalDateValue).getTime();
  const [timeLeft, setTimeLeft] = useState(emptyTimeLeft);
  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const distance = festivalDate - now;
      if (distance < 0 || Number.isNaN(distance)) { setTimeLeft(emptyTimeLeft); return; }
      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0"),
      });
    };
    tick(); const interval = setInterval(tick, 1000); return () => clearInterval(interval);
  }, [festivalDate]);
  return timeLeft;
};
