export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* bezel */}
      <rect x="1" y="1" width="30" height="30" fill="#12110d" stroke="#4d4526" strokeWidth="1.5" />
      {/* added line */}
      <line x1="7" y1="11" x2="14" y2="11" stroke="#86c46a" strokeWidth="2.4" />
      <line x1="10.5" y1="7.5" x2="10.5" y2="14.5" stroke="#86c46a" strokeWidth="2.4" />
      {/* removed line */}
      <line x1="7" y1="21" x2="14" y2="21" stroke="#ff5449" strokeWidth="2.4" />
      {/* code line ticks */}
      <line x1="18" y1="8" x2="25" y2="8" stroke="#575340" strokeWidth="1.6" />
      <line x1="18" y1="14" x2="23" y2="14" stroke="#575340" strokeWidth="1.6" />
      <line x1="18" y1="20" x2="25" y2="20" stroke="#575340" strokeWidth="1.6" />
      <line x1="18" y1="24" x2="21" y2="24" stroke="#575340" strokeWidth="1.6" />
    </svg>
  );
}
