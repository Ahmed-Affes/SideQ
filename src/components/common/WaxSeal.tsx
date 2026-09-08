import React from 'react';

interface WaxSealProps {
  status?: 'completed' | 'active' | 'locked';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  status = 'active',
  size = 'md',
  label,
  onClick,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 34, height: 34, iconSize: 14, fontSize: '9px' },
    md: { width: 48, height: 48, iconSize: 20, fontSize: '11px' },
    lg: { width: 68, height: 68, iconSize: 28, fontSize: '13px' }
  };

  const { width, height } = sizeMap[size];

  const getColors = () => {
    switch (status) {
      case 'completed':
        return {
          fill1: '#059669',
          fill2: '#047857',
          stroke: '#10B981',
          ribbon: '#065F46',
          iconColor: '#ECFDF5'
        };
      case 'active':
        return {
          fill1: '#B91C1C',
          fill2: '#7F1D1D',
          stroke: '#E5C07B',
          ribbon: '#991B1B',
          iconColor: '#FEF3C7'
        };
      case 'locked':
      default:
        return {
          fill1: '#262D3D',
          fill2: '#161B26',
          stroke: '#475569',
          ribbon: '#1E293B',
          iconColor: '#94A3B8'
        };
    }
  };

  const c = getColors();

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative'
      }}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label || `Wax Seal: ${status}`}
    >
      <div style={{ position: 'relative', width, height }}>
        {/* Subtle drop shadow and wax edge irregularities */}
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          style={{
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
            transition: 'transform 0.2s ease'
          }}
        >
          <defs>
            <radialGradient id={`waxGrad-${status}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={c.fill1} />
              <stop offset="65%" stopColor={c.fill2} />
              <stop offset="100%" stopColor="#0a0505" />
            </radialGradient>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2BE" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8C6E30" />
            </linearGradient>
          </defs>

          {/* Organic scalloped wax edge */}
          <path
            d="M50 4 
               C58 3, 67 8, 74 15 
               C82 22, 93 29, 95 39 
               C97 50, 93 60, 88 69 
               C83 78, 75 87, 65 92 
               C54 97, 43 96, 33 93 
               C23 90, 14 83, 9 73 
               C4 63, 3 52, 6 42 
               C9 32, 18 23, 27 16 
               C35 9, 42 5, 50 4 Z"
            fill={`url(#waxGrad-${status})`}
            stroke={c.stroke}
            strokeWidth="2.5"
          />

          {/* Inner impressed circle */}
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke={c.stroke}
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Center Insignia */}
          {status === 'completed' && (
            <path
              d="M36 50 L45 59 L64 40"
              fill="none"
              stroke={c.iconColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {status === 'active' && (
            <g transform="translate(35, 32) scale(0.7)">
              <polygon
                points="21,3 27,15 40,17 31,26 33,39 21,33 9,39 11,26 2,17 15,15"
                fill={c.iconColor}
              />
              <circle cx="21" cy="21" r="5" fill="#7F1D1D" />
            </g>
          )}

          {status === 'locked' && (
            <g transform="translate(36, 32) scale(0.65)">
              <rect x="5" y="16" width="32" height="24" rx="4" fill={c.iconColor} />
              <path
                d="M11 16 V10 C11 4.5, 31 4.5, 31 10 V16"
                fill="none"
                stroke={c.iconColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>
      </div>

      {label && (
        <span
          style={{
            marginTop: 4,
            fontSize: sizeMap[size].fontSize,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: status === 'active' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
