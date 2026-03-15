export function Input({ className = "", ...props }) {
  return <input className={`h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;
}
