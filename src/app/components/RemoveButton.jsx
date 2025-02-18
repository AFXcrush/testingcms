import React from "react";

export default function RemoveButton({ onRemove }) {
  return (
    <button
      onClick={onRemove}
      className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1"
    >
      X
    </button>
  );
}
