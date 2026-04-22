import { useEffect, useState } from "react";

export function useHashRoute(): [string, (next: string) => void] {
  const read = () => (typeof window !== "undefined" ? window.location.hash.replace(/^#\/?/, "") : "");
  const [value, setValue] = useState(read);

  useEffect(() => {
    const handler = () => setValue(read());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const set = (next: string) => {
    if (typeof window === "undefined") return;
    const target = `#/${next}`;
    if (window.location.hash !== target) window.location.hash = target;
    setValue(next);
  };

  return [value, set];
}
