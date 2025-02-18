import RemoveButton from "@/app/components/RemoveButton";

export default function BlockText({ value, onChange, onRemove }) {
  return (
    <div className="relative border p-2 mb-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 w-full min-h-40 text-gray-700"
        placeholder="Escribe algo..."
      />

      <RemoveButton onRemove={onRemove} />
    </div>
  );
}
