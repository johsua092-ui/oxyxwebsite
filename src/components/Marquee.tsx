interface MarqueeProps {
  items: string[];
  variant?: "outline" | "ticker";
  direction?: "left" | "right";
  speed?: "normal" | "fast";
}

function MarqueeContent({ items, variant }: { items: string[]; variant: string }) {
  if (variant === "outline") {
    return (
      <>
        {items.map((item, i) => (
          <span key={i} className="marquee-outline-text mx-8">
            {item}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-6 mx-6">
          <span className="marquee-ticker-dot" />
          <span className="marquee-ticker-text">{item}</span>
        </span>
      ))}
    </>
  );
}

export default function Marquee({
  items,
  variant = "ticker",
  direction = "left",
  speed = "normal",
}: MarqueeProps) {
  const trackClass =
    direction === "right"
      ? "marquee-track-reverse"
      : speed === "fast"
        ? "marquee-track-fast"
        : "marquee-track";

  return (
    <div className="marquee-container">
      <div className={trackClass}>
        <MarqueeContent items={items} variant={variant} />
        <MarqueeContent items={items} variant={variant} />
      </div>
    </div>
  );
}
