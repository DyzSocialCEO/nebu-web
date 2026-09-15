const sparks = [
  [6, 9.4, -1.2, .55, -14], [17, 12.1, -6.4, .8, 8], [29, 10.3, -3.1, .45, -6],
  [41, 13.8, -8.7, .7, 12], [53, 9.1, -2.2, .6, -10], [64, 14.2, -5.6, .85, 6],
  [76, 11.4, -9.4, .5, -8], [88, 12.7, -4.1, .75, 10], [96, 10.8, -7.3, .4, -5],
] as const;

export default function Atmosphere() {
  return (
    <>
      <div className="n3-aurora" aria-hidden="true" />
      <div className="n3-sparks" aria-hidden="true">
        {sparks.map(([left, duration, delay, opacity, drift], index) => (
          <i
            key={index}
            style={{
              left: `${left}%`,
              opacity,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              ["--dx" as string]: `${drift}px`,
            }}
          />
        ))}
      </div>
      <div className="n3-grain" aria-hidden="true" />
    </>
  );
}
