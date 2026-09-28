export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold text-orange">DIM VOYAGES</p>
      <h1 className="mt-2 text-4xl font-bold text-navy">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink/85">{children}</div>
    </article>
  );
}
