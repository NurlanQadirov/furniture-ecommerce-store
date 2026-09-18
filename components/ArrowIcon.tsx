interface ArrowIconProps {
  className?: string;
}

export default function ArrowIcon({ className = '' }: ArrowIconProps) {
  return (
    <svg viewBox="0 0 20 10" className={`w-5 h-auto ${className}`}>
      <line x1="0" y1="5" x2="20" y2="5" />
      <line x1="15" y1="0" x2="20" y2="5" />
      <line x1="15" y1="10" x2="20" y2="5" />
    </svg>
  );
}
