interface HighlightedTextProps {
  children: React.ReactNode;
  color?: 'yellow' | 'blue';
  rotate?: number;
}

export function HighlightedText({ 
  children, 
  color = 'yellow',
  rotate = -2 
}: HighlightedTextProps) {
  const bgColor = color === 'yellow' ? 'bg-yellow-200/50' : 'bg-blue-200/50';

  return (
    <span className="relative">
      <span className="relative z-10 text-md">{children}</span>
      <span 
        className={`absolute bottom-0 left-0 right-0 h-6 ${bgColor}`}
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden="true"
      />
    </span>
  );
} 