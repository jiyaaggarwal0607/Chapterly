export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-3xl font-bold text-ink dark:text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-ink/65 dark:text-zinc-300">{description}</p>}
    </div>
  );
}
