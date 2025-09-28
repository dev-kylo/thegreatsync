interface HighlightedTextProps {
  children: React.ReactNode;
  color?: 'yellow' | 'blue';
  rotate?: number;
}

export function HighlightedText({ 
  children, 
  color = 'yellow',
  rotate = -1
}: HighlightedTextProps) {
  const bgColor = color === 'yellow' ? 'bg-yellow-200/80' : 'bg-blue-200/80';

  return (
    <span className="relative inline-block">
      <span 
        className={`absolute inset-0 ${bgColor} rounded-sm`}
        style={{ 
          transform: `rotate(${rotate}deg)`,
          transformOrigin: 'center',
          zIndex: -1,
          margin: '-2px'
        }}
        aria-hidden="true"
      />
      <span className="relative px-1 py-1" style={{ lineHeight: '1' }}>
        {children}
      </span>
    </span>
  );
} 