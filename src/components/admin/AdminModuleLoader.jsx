const AdminModuleLoader = ({ label = "Loading module" }) => (
  <div className="space-y-4">
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
        <span className="text-sm font-black text-white/75">{label}</span>
      </div>
    </section>
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <section key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-white/10" />
        </section>
      ))}
    </div>
  </div>
);

export default AdminModuleLoader;
