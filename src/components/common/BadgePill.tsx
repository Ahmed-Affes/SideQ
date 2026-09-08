import React from 'react';

interface BadgePillProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'crimson' | 'muted' | 'azure';
  size?: 'sm' | 'md';
  className?: string;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  label,
  icon,
  variant = 'gold',
  size = 'md',
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          bg: 'rgba(229, 192, 123, 0.12)',
          border: 'rgba(229, 192, 123, 0.35)',
          color: '#E5C07B',
          glow: 'rgba(229, 192, 123, 0.15)'
        };
      case 'emerald':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#34D399',
          glow: 'rgba(16, 185, 129, 0.15)'
        };
      case 'crimson':
        return {
          bg: 'rgba(153, 27, 27, 0.2)',
          border: 'rgba(220, 38, 38, 0.4)',
          color: '#F87171',
          glow: 'rgba(153, 27, 27, 0.25)'
        };
      case 'azure':
        return {
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.35)',
          color: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.15)'
        };
      case 'muted':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.12)',
          color: '#94A3B8',
          glow: 'transparent'
        };
    }
  };

  const s = getStyles();
  const isSm = size === 'sm';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: isSm ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: isSm ? '10px' : '11px',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.04em',
        boxShadow: `0 2px 8px ${s.glow}`,
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
