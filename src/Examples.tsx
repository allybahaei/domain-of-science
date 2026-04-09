const PLACEHOLDER_CARDS = [
  { title: "Example one", sub: "Placeholder description for this example." },
  { title: "Example two", sub: "Placeholder description for this example." },
  { title: "Example three", sub: "Placeholder description for this example." },
  { title: "Example four", sub: "Placeholder description for this example." },
  { title: "Example five", sub: "Placeholder description for this example." },
  { title: "Example six", sub: "Placeholder description for this example." },
  { title: "Example seven", sub: "Placeholder description for this example." },
  { title: "Example eight", sub: "Placeholder description for this example." },
  { title: "Example nine", sub: "Placeholder description for this example." },
];

export default function Examples() {
  return (
    <section className="self-stretch w-full px-6 pt-16 pb-20 bg-white" aria-labelledby="examples-heading">
      <h2 id="examples-heading" className="mx-auto mb-10 max-w-[1040px] text-5xl font-normal tracking-[-0.02em] text-zinc-900 font-display text-center">
        Examples
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5 max-w-[1040px] mx-auto w-full">
        {PLACEHOLDER_CARDS.map((card, i) => (
          <article key={i} className="flex flex-col bg-white border border-zinc-200 rounded-xl p-4">
            <div className="w-full aspect-[16/10] rounded-lg bg-[linear-gradient(145deg,#e4e4e7_0%,#f4f4f5_50%,#e4e4e7_100%)] mb-3.5" aria-hidden />
            <h3 className="mb-2 text-base font-semibold text-zinc-900 leading-[1.3]">{card.title}</h3>
            <p className="text-sm leading-normal text-zinc-500">{card.sub}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
