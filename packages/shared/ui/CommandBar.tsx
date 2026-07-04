"use client";

export function CommandBar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="mx-auto mt-[20vh] max-w-lg bg-white rounded-xl shadow-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          placeholder="Type a command..."
          className="w-full text-lg p-2 border-0 outline-none"
        />
      </div>
    </div>
  );
}
