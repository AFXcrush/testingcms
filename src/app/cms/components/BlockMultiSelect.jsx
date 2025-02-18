import RemoveButton from "@/app/components/RemoveButton";
import { useState } from "react";

const options = ["Ps", "Ai", "Pr", "Ae", "Au", "Bl", "Acad"];

export default function BlockMultiSelect({ value, onChange, onRemove }) {
  const [selected, setSelected] = useState(value);

  function toggleOption(option) {
    const newSelected = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];

    setSelected(newSelected);
    onChange(newSelected);
  }

  return (
    <div className="border p-2 relative">
      <p className="font-bold">Multi-Select Options</p>

      <div className="flex gap-2 mt-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 rounded ${
              selected.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <RemoveButton onRemove={onRemove} />
    </div>
  );
}
