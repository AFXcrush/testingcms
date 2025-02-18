import RemoveButton from "@/app/components/RemoveButton";

export default function BlockYTvideo({ value, onChange, onRemove }) {
  return (
    <div className="relative border p-2 mb-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 w-full text-gray-700"
        placeholder="YouTube URL"
        pattern="https?:\\/\\/(www\\.)?(youtube\\.com|youtu\\.be)\\/.*"
        title="Enter a valid Youtube URL"
      />

      <RemoveButton onRemove={onRemove} />
    </div>
  );
}
