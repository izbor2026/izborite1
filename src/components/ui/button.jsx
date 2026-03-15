export function Button({ className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    outline: "bg-white text-slate-900 border-slate-300 hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
