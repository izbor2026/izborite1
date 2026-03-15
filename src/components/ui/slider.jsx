export function Slider({ min = 1, max = 5, step = 1, value = [3], onValueChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value?.[0] ?? min}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className="w-full"
    />
  );
}
