// Standard UiPath wordmark: "UiPath" with the four-point sparkle above the "i".
// Rendered in Poppins (a UiPath brand font) and colored via `currentColor`, so
// it shows dark on light backgrounds and white on the dark header — one logo,
// both contexts. Pass `height` (in px) to size it.

export function Logo({ height = 26 }: { height?: number }) {
  return (
    <span
      className="uipath-logo"
      style={{ fontSize: `${height}px` }}
      role="img"
      aria-label="UiPath"
    >
      <span className="uipath-word">UiPath</span>
      <svg
        className="uipath-spark uipath-spark-lg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 0c1.1 8 3 9.9 12 11-9 1.1-10.9 3-12 11-1.1-8-3-9.9-12-11 9-1.1 10.9-3 12-11Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="uipath-spark uipath-spark-sm"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 2c.7 6 2.3 7.4 10 9-7.7 1.6-9.3 3-10 9-.7-6-2.3-7.4-10-9 7.7-1.6 9.3-3 10-9Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
