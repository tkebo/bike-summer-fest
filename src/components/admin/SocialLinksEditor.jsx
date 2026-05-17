const socialFields = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
  ["telegram", "Telegram"],
  ["whatsapp", "WhatsApp"],
];

const SocialLinksEditor = ({ socials, onChange }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
    <h3 className="text-lg font-black">Social links</h3>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {socialFields.map(([key, label]) => (
        <label key={key} className="block">
          <span className="mb-2 block text-xs font-black uppercase text-white/45">{label}</span>
          <input
            value={socials[key]}
            onChange={(event) => onChange(key, event.target.value)}
            placeholder="https://"
            className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm"
          />
        </label>
      ))}
    </div>
  </section>
);

export default SocialLinksEditor;
