"use client";

export function ConfirmDialog({
  open,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-delete-title" className="text-lg font-bold text-[#0e4f7c]">
          Confirmer la suppression
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-[#0e4f7c]">
            Annuler
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
