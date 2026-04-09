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
    <section style={styles.section} aria-labelledby="examples-heading">
      <h2 id="examples-heading" style={styles.title}>
        Examples
      </h2>
      <div style={styles.grid}>
        {PLACEHOLDER_CARDS.map((card, i) => (
          <article key={i} style={styles.card}>
            <div style={styles.mediaPlaceholder} aria-hidden />
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardSub}>{card.sub}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    alignSelf: "stretch",
    width: "100%",
    padding: "64px 24px 80px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  title: {
    margin: "0 auto 40px",
    maxWidth: 1040,
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    color: "#1a1a1a",
    fontFamily: "'Instrument Serif', serif",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: 20,
    maxWidth: 1040,
    margin: "0 auto",
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    border: "1px solid #e4e4e7",
    borderRadius: 12,
    padding: 16,
    boxSizing: "border-box",
    minHeight: 0,
  },
  mediaPlaceholder: {
    width: "100%",
    aspectRatio: "16 / 10",
    borderRadius: 8,
    background: "linear-gradient(145deg, #e4e4e7 0%, #f4f4f5 50%, #e4e4e7 100%)",
    marginBottom: 14,
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: 16,
    fontWeight: 600,
    color: "#18181b",
    lineHeight: 1.3,
  },
  cardSub: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
    color: "#71717a",
  },
};
