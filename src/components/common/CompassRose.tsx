import React from 'react';

interface CompassRoseProps {
  bearingDegrees?: number;
  targetDistanceMeters?: number;
  isLockedOnTarget?: boolean;
  onRecenter?: () => void;
  size?: number;
}

export const CompassRose: React.FC<CompassRoseProps> = ({
  bearingDegrees = 34,
  targetDistanceMeters = 48,
  isLockedOnTarget = true,
  onRecenter,
  size = 64
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-gilded)',
        borderRadius: 30,
        padding: '6px 14px 6px 8px',
        boxShadow: 'var(--shadow-gilded)',
        userSelect: 'none'
      }}
    >
      {/* Compass Disc */}
      <button
        type="button"
        onClick={onRecenter}
        title="Recenter view on active clue"
        aria-label={`Compass bearing ${bearingDegrees} degrees. Tap to recenter.`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, #1c263c 0%, #0d121c 100%)',
          border: '1px solid rgba(229, 192, 123, 0.4)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5)',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        {/* Ring graduation marks */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${bearingDegrees}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Outer dial ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(197, 160, 89, 0.3)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="1" />

          {/* Cardinal points */}
          <text x="50" y="16" fill="#E5C07B" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">N</text>
          <text x="86" y="53" fill="rgba(197,160,89,0.7)" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="var(--font-display)">E</text>
          <text x="50" y="90" fill="rgba(197,160,89,0.7)" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="var(--font-display)">S</text>
          <text x="14" y="53" fill="rgba(197,160,89,0.7)" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="var(--font-display)">W</text>

          {/* Magnetic Needle */}
          {/* North Needle (Gold & Crimson) */}
          <polygon points="50,18 45,50 50,47" fill="#DC2626" />
          <polygon points="50,18 55,50 50,47" fill="#991B1B" />

          {/* South Needle (Burnished Silver) */}
          <polygon points="50,82 45,50 50,53" fill="#94A3B8" />
          <polygon points="50,82 55,50 50,53" fill="#64748B" />

          {/* Center pivot jewel */}
          <circle cx="50" cy="50" r="4" fill="#C5A059" stroke="#0B0F19" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="1.5" fill="#FFF2BE" />
        </svg>
      </button>

      {/* Metric details */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isLockedOnTarget ? 'var(--cipher-emerald)' : 'var(--gold-primary)',
              boxShadow: isLockedOnTarget ? '0 0 8px var(--cipher-emerald)' : '0 0 6px var(--gold-primary)'
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--gold-primary)'
            }}
          >
            TARGET BEARING
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 1 }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: 'var(--text-heading)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {targetDistanceMeters}m
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-display)'
            }}
          >
            NNE 034°
          </span>
        </div>
      </div>
    </div>
  );
};
