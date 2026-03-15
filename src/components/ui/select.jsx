import React, { createContext, useContext, useState } from "react";

const SelectContext = createContext(null);

export function Select({ children, onValueChange, defaultValue }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const handleChange = (next) => {
    setValue(next);
    onValueChange?.(next);
    setOpen(false);
  };
  return <SelectContext.Provider value={{ value, open, setOpen, handleChange }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className = "", children }) {
  const ctx = useContext(SelectContext);
  return (
    <button type="button" className={`h-11 min-w-[180px] rounded-xl border border-slate-300 bg-white px-3 text-sm flex items-center justify-between ${className}`} onClick={() => ctx.setOpen(!ctx.open)}>
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx.value || placeholder}</span>;
}

export function SelectContent({ children }) {
  const ctx = useContext(SelectContext);
  if (!ctx.open) return null;
  return <div className="absolute z-50 mt-1 min-w-[180px] rounded-xl border border-slate-300 bg-white p-1 shadow-lg">{children}</div>;
}

export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
      onClick={() => ctx.handleChange(value)}
    >
      {children}
    </button>
  );
}
