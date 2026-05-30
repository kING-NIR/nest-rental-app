export const fmt = (n: number): string => `₹${Number(n).toLocaleString("en-IN")}`;

export const fmtDate = (d: string | Date): string =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (ts: string | Date): string =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const priorityColor = (p: string, theme: any): string => {
  if (p === "high") return theme.error;
  if (p === "medium") return theme.warning;
  return theme.textSec;
};

export const statusColor = (s: string, theme: any): string => {
  if (s === "resolved" || s === "paid" || s === "approved") return theme.success;
  if (s === "in-progress") return theme.warning;
  if (s === "open" || s === "pending") return theme.info;
  if (s === "declined") return theme.error;
  return theme.textSec;
};

export const statusLabel = (s: string): string => {
  const labels: Record<string, string> = {
    "in-progress": "In Progress",
    open: "Open",
    resolved: "Resolved",
    paid: "Paid",
    pending: "Pending",
    approved: "Approved",
    declined: "Declined",
  };
  return labels[s] || s;
};
