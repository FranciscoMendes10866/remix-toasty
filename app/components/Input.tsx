import type { FC } from "react";
import { useField } from "remix-validated-form";

interface InputProps {
  name: string;
  label: string;
}

export const Input: FC<InputProps> = ({ name, label }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="h-20">
      <label
        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        htmlFor={name}
      >
        <input
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
          {...getInputProps({ id: name })}
        />
        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {label}
        </span>
      </label>
      {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
    </div>
  );
};
