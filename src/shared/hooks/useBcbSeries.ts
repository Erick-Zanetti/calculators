import { useEffect, useState } from "react";
import { fetchIpcaMonthly, fetchLatestSelicMeta } from "../api/bcb";
import type { SgsPoint } from "../api/bcb";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

const initial = <T,>(): AsyncState<T> => ({
  status: "idle",
  data: null,
  error: null,
});

export function useIpcaMonthly() {
  const [state, setState] = useState<AsyncState<SgsPoint[]>>(initial);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });
    fetchIpcaMonthly()
      .then((data) => {
        if (cancelled) return;
        setState({ status: "success", data, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: "error",
          data: null,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function useLatestSelic() {
  const [state, setState] = useState<AsyncState<number>>(initial);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });
    fetchLatestSelicMeta()
      .then((data) => {
        if (cancelled) return;
        setState({ status: "success", data, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: "error",
          data: null,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
