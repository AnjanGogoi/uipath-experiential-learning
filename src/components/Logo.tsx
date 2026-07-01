// Simple brand mark for the header. A rounded square in Robotic Orange with a
// stylized "U", paired with the platform name. Avoids bundling trademarked
// logo files while staying on-brand.

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="brand-logo"
      aria-label="UiPath"
    >
      <rect width="40" height="40" rx="10" fill="#FA4616" />
      <path
        d="M13 11v11a7 7 0 0 0 14 0V11"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
