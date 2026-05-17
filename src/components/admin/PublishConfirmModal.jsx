import { useState } from "react";

const PublishConfirmModal = ({ onClose, onConfirm }) => {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-black p-5" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-xl font-black">Publish live site?</h2>
        <p className="mt-2 text-sm text-white/55">A version snapshot will be created before published content is replaced.</p>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Publish note / changelog" className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-white/15 px-4 py-2 font-black">Cancel</button>
          <button onClick={() => onConfirm(note)} className="rounded-xl bg-orange-500 px-4 py-2 font-black text-black">Publish</button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
