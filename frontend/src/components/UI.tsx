import React from "react";
import { THEME } from "../utils/theme";

// Avatar
export const Avatar: React.FC<{ initials: string; color: string; size?: number }> = ({
  initials,
  color,
  size = 40,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: `${color}20`,
      border: `1.5px solid ${color}50`,
      color,
      fontSize: size * 0.34,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "DM Sans,sans-serif",
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

// Badge
export const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span
    style={{
      background: `${color}20`,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "DM Sans,sans-serif",
      whiteSpace: "nowrap",
      letterSpacing: 0.3,
    }}
  >
    {label}
  </span>
);

// Button
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "success" | "outline";
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled,
  style: ext,
  type = "button",
}) => {
  const base = {
    borderRadius: 12,
    padding: "12px 18px",
    fontFamily: "DM Sans,sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : ("pointer" as const),
    border: "none" as const,
    transition: "opacity 0.15s",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 7,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: THEME.gold, color: "#000" },
    ghost: { background: THEME.elevated, color: THEME.text },
    danger: {
      background: THEME.errorDim,
      color: THEME.error,
      border: `1px solid ${THEME.error}30`,
    },
    success: {
      background: THEME.successDim,
      color: THEME.success,
      border: `1px solid ${THEME.success}30`,
    },
    outline: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}40` },
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], opacity: disabled ? 0.45 : 1, ...ext }}
    >
      {children}
    </button>
  );
};

// Input
interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const TextInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          color: THEME.textSec,
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 6,
          fontFamily: "DM Sans,sans-serif",
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {label}
        {required && <span style={{ color: THEME.error }}> *</span>}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: "100%",
        background: THEME.elevated,
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        padding: "13px 16px",
        color: THEME.text,
        fontSize: 15,
        fontFamily: "DM Sans,sans-serif",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  </div>
);

// Textarea
interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          color: THEME.textSec,
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 6,
          fontFamily: "DM Sans,sans-serif",
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {label}
        {required && <span style={{ color: THEME.error }}> *</span>}
      </div>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      style={{
        width: "100%",
        background: THEME.elevated,
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        padding: "12px 16px",
        color: THEME.text,
        fontSize: 14,
        fontFamily: "DM Sans,sans-serif",
        outline: "none",
        boxSizing: "border-box",
        resize: "none",
      }}
    />
  </div>
);

// Loading Spinner
export const Spinner: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `3px solid ${THEME.border}`,
      borderTop: `3px solid ${THEME.gold}`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }}
  />
);

// Empty State
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div style={{ textAlign: "center", padding: "60px 0", color: THEME.textMuted }}>
    <div style={{ marginBottom: 12, fontSize: 40, opacity: 0.2 }}>{icon}</div>
    <div style={{ fontSize: 16, marginBottom: description ? 8 : 16 }}>{title}</div>
    {description && (
      <div style={{ fontSize: 13, color: THEME.textSec, marginBottom: 16 }}>{description}</div>
    )}
    {action && <Button onClick={action.onClick}>{action.label}</Button>}
  </div>
);

// Card
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }> = ({
  children,
  style,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: THEME.card,
      border: `1px solid ${THEME.border}`,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      ...style,
    }}
  >
    {children}
  </div>
);

// Modal Overlay
export const ModalOverlay: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
}> = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.82)",
      zIndex: 100,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: THEME.surface,
        borderRadius: "24px 24px 0 0",
        padding: "24px 20px 44px",
        width: "100%",
        maxWidth: 430,
        border: `1px solid ${THEME.border}`,
        maxHeight: "88vh",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
