import { useState } from "react";

const roles = ["admin", "editor", "viewer"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InviteUserModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState("");

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email.");
      return;
    }
    await onInvite(normalizedEmail, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black p-5" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-xl font-black">Invite user</h2>
        <p className="mt-2 text-sm text-white/55">Creates a pending invite document. Account creation still happens through Firebase Auth login.</p>
        <div className="mt-4 grid gap-3">
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {error && <div className="text-sm text-orange-300">{error}</div>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-white/15 px-4 py-2 font-black">Cancel</button>
          <button onClick={submit} className="rounded-xl bg-cyan-300 px-4 py-2 font-black text-black">Create invite</button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
