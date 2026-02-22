export default function AuthInput({
  label,
  type = "text",
  register,
  name,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
