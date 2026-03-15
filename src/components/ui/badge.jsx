export function Badge({ className = "", variant = "secondary", children }) {
  const variants = {
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    outline: "bg-white text-slate-600 border-slate-300",
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${variants[variant] || variants.secondary} ${className}`}>{children}</span>;
}
