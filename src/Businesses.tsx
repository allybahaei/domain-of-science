/** Replace gray bars with `<img src="/businesses/…" alt="…" />` when logos are ready. */
const LOGO_PLACEHOLDER_WIDTHS = [96, 72, 104, 88, 76, 92];

export default function Businesses() {
  return (
    <section style={styles.section} aria-label="Trusted by">
      <div style={styles.row}>
        <LogoPlaceholder label="Company 1" width={LOGO_PLACEHOLDER_WIDTHS[0]} />
        <LogoPlaceholder label="Company 2" width={LOGO_PLACEHOLDER_WIDTHS[1]} />
        <LogoPlaceholder label="Company 3" width={LOGO_PLACEHOLDER_WIDTHS[2]} />
        <RatingPlaceholder />
        <LogoPlaceholder label="Company 4" width={LOGO_PLACEHOLDER_WIDTHS[3]} />
        <LogoPlaceholder label="Company 5" width={LOGO_PLACEHOLDER_WIDTHS[4]} />
        <LogoPlaceholder label="Company 6" width={LOGO_PLACEHOLDER_WIDTHS[5]} />
      </div>
    </section>
  );
}

function LogoPlaceholder({ label, width }: { label: string; width: number }) {
  return (
    <div style={styles.logoSlot} aria-hidden title={label}>
      <div style={{ ...styles.logoBar, width }} />
    </div>
  );
}

function RatingPlaceholder() {
  return (
    <div style={styles.ratingSlot} aria-hidden>
      <span style={styles.ratingTop}>4.9 out of 5</span>
      <div style={styles.stars}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={styles.star} />
        ))}
      </div>
      <span style={styles.ratingBottom}>Placeholder reviews</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    alignSelf: "stretch",
    width: "100%",
    marginTop: 72,
    padding: "28px 24px 32px",
    background: "#fff",
    borderTop: "1px solid #f4f4f5",
    borderBottom: "1px solid #f4f4f5",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "28px 40px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  logoSlot: {
    display: "flex",
    alignItems: "center",
    opacity: 0.65,
  },
  logoBar: {
    height: 24,
    borderRadius: 4,
    background: "#94a3b8",
  },
  ratingSlot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #e4e4e7",
    background: "#fafafa",
    minWidth: 120,
  },
  ratingTop: {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    letterSpacing: "0.02em",
  },
  stars: {
    display: "flex",
    gap: 3,
  },
  star: {
    width: 10,
    height: 10,
    borderRadius: 2,
    background: "#cbd5e1",
  },
  ratingBottom: {
    fontSize: 10,
    color: "#94a3b8",
  },
};
