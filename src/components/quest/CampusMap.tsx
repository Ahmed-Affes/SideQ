import React, { useState } from 'react';
import type { CampusLandmark, QuestStop } from '../../types';
import { CompassRose } from '../common/CompassRose';
import { MapPin, Eye, EyeOff, Sparkles, X } from 'lucide-react';

interface CampusMapProps {
  landmarks: CampusLandmark[];
  activeStop: QuestStop;
  onSelectLandmark: (landmark: CampusLandmark) => void;
  onOpenCheckIn: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  landmarks,
  activeStop,
  onSelectLandmark,
  onOpenCheckIn
}) => {
  const [showFog, setShowFog] = useState(true);
  const [selectedPin, setSelectedPin] = useState<CampusLandmark | null>(null);

  // Simulated player position (near Clock Tower)
  const playerPos = { x: 50, y: 41 };

  const handlePinClick = (landmark: CampusLandmark) => {
    setSelectedPin(landmark);
    onSelectLandmark(landmark);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#070a12',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* HUD Top Bar: Compass Rose & Map Controls */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <CompassRose
            bearingDegrees={28}
            targetDistanceMeters={48}
            isLockedOnTarget={true}
          />
        </div>

        {/* Layer Controls */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            pointerEvents: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => setShowFog(!showFog)}
            aria-label={showFog ? 'Disable fog of war' : 'Enable fog of war'}
            title={showFog ? 'Fog of War: ON' : 'Fog of War: OFF'}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: 'rgba(11, 15, 25, 0.85)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${showFog ? 'var(--gold-primary)' : 'rgba(255,255,255,0.15)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showFog ? 'var(--gold-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            {showFog ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
        </div>
      </div>

      {/* SVG Living Map Layer */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          backgroundColor: '#070c16'
        }}
      >
        <defs>
          {/* Subtle grid pattern for quadrangle architectural feel */}
          <pattern id="campusGrid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(197, 160, 89, 0.05)" strokeWidth="0.2" />
          </pattern>

          {/* Gradients */}
          <radialGradient id="radarPulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(229, 192, 123, 0.3)" />
            <stop offset="60%" stopColor="rgba(229, 192, 123, 0.08)" />
            <stop offset="100%" stopColor="rgba(229, 192, 123, 0)" />
          </radialGradient>

          <radialGradient id="fogRadial" cx="50%" cy="38%" r="45%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="85%" stopColor="rgba(7, 10, 18, 0.75)" />
            <stop offset="100%" stopColor="rgba(7, 10, 18, 0.95)" />
          </radialGradient>

          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Blueprint Grid Background */}
        <rect width="100" height="100" fill="url(#campusGrid)" />

        {/* Campus Pathways (Aged Cobblestone Corridors) */}
        <g stroke="rgba(197, 160, 89, 0.2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* North-South Meridian Path */}
          <path d="M 50 10 L 50 45 L 48 85 L 50 95" />
          {/* East-West Quad Traverse */}
          <path d="M 15 65 L 45 60 L 78 55" />
          {/* Diagonal Scholar Walk */}
          <path d="M 22 25 L 48 38 L 76 52" />
          {/* Sunken Garden Loop */}
          <circle cx="48" cy="82" r="8" strokeDasharray="1 1" strokeWidth="0.8" />
          {/* Library Arc */}
          <path d="M 24 60 C 26 70, 32 72, 36 65" />
        </g>

        {/* Architectural Footprints / Buildings */}
        {/* Great Quadrangle Lawn */}
        <polygon
          points="38,45 62,43 60,62 36,64"
          fill="rgba(16, 185, 129, 0.06)"
          stroke="rgba(16, 185, 129, 0.25)"
          strokeWidth="0.5"
        />
        <text x="49" y="55" fontSize="2.8" fill="rgba(197, 160, 89, 0.4)" fontFamily="var(--font-display)" textAnchor="middle">
          GREAT QUADRANGLE
        </text>

        {/* Library Wing */}
        <rect x="22" y="60" width="12" height="12" rx="1" fill="#131d30" stroke="rgba(197, 160, 89, 0.3)" strokeWidth="0.6" />
        <text x="28" y="67" fontSize="2.2" fill="#E5C07B" fontFamily="var(--font-display)" textAnchor="middle">
          LIBRARY
        </text>

        {/* Founders Clock Tower Base */}
        <rect x="49" y="30" width="8" height="8" rx="1.5" fill="#1e1828" stroke="#E5C07B" strokeWidth="0.8" />
        <polygon points="53,26 48,30 58,30" fill="#991B1B" opacity="0.8" />
        <circle cx="53" cy="34" r="1.8" fill="none" stroke="#E5C07B" strokeWidth="0.5" />

        {/* Victorian Conservatory Footprint */}
        <ellipse cx="76" cy="52" rx="7" ry="5" fill="#0c241d" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.6" />

        {/* Old North Observatory */}
        <circle cx="22" cy="22" r="4.5" fill="#152238" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.6" />

        {/* Active Geofence Target Radius around Clock Tower (Stop 2) */}
        <g transform="translate(53, 34)">
          <circle
            r="12"
            fill="rgba(229, 192, 123, 0.08)"
            stroke="rgba(229, 192, 123, 0.5)"
            strokeWidth="0.5"
            strokeDasharray="1.5 1.5"
          />
          {/* Radar scan ring */}
          <circle r="8" fill="none" stroke="rgba(229, 192, 123, 0.7)" strokeWidth="0.6" opacity="0.6" />
        </g>

        {/* Fog of War Overlay (if enabled) */}
        {showFog && (
          <rect width="100" height="100" fill="url(#fogRadial)" pointerEvents="none" />
        )}

        {/* Player Beacon & Position Pulse */}
        <g transform={`translate(${playerPos.x}, ${playerPos.y})`}>
          {/* Animated radar rings */}
          <circle r="14" fill="url(#radarPulseGrad)" opacity="0.8" />
          <circle r="5" fill="none" stroke="var(--gold-primary)" strokeWidth="0.8" opacity="0.7">
            <animate attributeName="r" values="3;12;16" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.3;0" dur="2.8s" repeatCount="indefinite" />
          </circle>

          {/* Student direction pointer */}
          <polygon points="0,-4 3,3 0,1 -3,3" fill="#E5C07B" />
          <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" stroke="#0B0F19" strokeWidth="0.6" />
        </g>

        {/* Quest Landmark Pins */}
        {landmarks.map((lm) => {
          const isStopActive = lm.activeClueForStop === activeStop.stopNumber;
          const isStopSolved = lm.activeClueForStop && lm.activeClueForStop < activeStop.stopNumber;
          const isStopLocked = lm.activeClueForStop && lm.activeClueForStop > activeStop.stopNumber;

          return (
            <g
              key={lm.id}
              transform={`translate(${lm.campusX}, ${lm.campusY})`}
              onClick={() => handlePinClick(lm)}
              style={{ cursor: 'pointer' }}
            >
              {/* Active Beacon Pulse */}
              {isStopActive && (
                <circle r="6" fill="rgba(153, 27, 27, 0.4)">
                  <animate attributeName="r" values="4;9;12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Pin Base */}
              <circle
                r="3.2"
                fill={
                  isStopSolved
                    ? '#059669'
                    : isStopActive
                    ? '#991B1B'
                    : isStopLocked
                    ? '#1E293B'
                    : '#26334D'
                }
                stroke={isStopActive ? '#E5C07B' : isStopSolved ? '#34D399' : '#64748B'}
                strokeWidth="0.8"
                filter={isStopActive ? 'url(#goldGlow)' : undefined}
              />

              {/* Icon symbol inside pin */}
              {isStopSolved && (
                <path d="M -1.2 0 L -0.3 1 L 1.4 -0.8" fill="none" stroke="#fff" strokeWidth="0.6" />
              )}

              {isStopActive && (
                <circle cx="0" cy="0" r="1" fill="#FFF2BE" />
              )}

              {isStopLocked && (
                <circle cx="0" cy="0" r="0.8" fill="#94A3B8" />
              )}

              {/* Stop Number Tag */}
              {lm.activeClueForStop && (
                <g transform="translate(0, -5.2)">
                  <rect
                    x="-3.5"
                    y="-1.8"
                    width="7"
                    height="3.6"
                    rx="1.2"
                    fill={isStopActive ? '#7F1D1D' : '#0F172A'}
                    stroke={isStopActive ? '#E5C07B' : '#475569'}
                    strokeWidth="0.4"
                  />
                  <text
                    x="0"
                    y="0.8"
                    fontSize="2"
                    fill={isStopActive ? '#FEF3C7' : '#94A3B8'}
                    fontFamily="var(--font-display)"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    STOP {lm.activeClueForStop}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Quick Landmark Inspection Bottom Sheet */}
      {selectedPin && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 30,
            background: 'rgba(17, 23, 40, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-gold-bright)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow-elevation)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(229, 192, 123, 0.15)',
                  border: '1px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)'
                }}
              >
                <MapPin size={16} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--text-heading)' }}>
                    {selectedPin.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '9px',
                      color: 'var(--gold-primary)',
                      border: '1px solid rgba(197, 160, 89, 0.3)',
                      padding: '1px 5px',
                      borderRadius: 4
                    }}
                  >
                    {selectedPin.code}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedPin.category} Sector
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPin(null)}
              aria-label="Close landmark sheet"
              style={{
                color: 'var(--text-muted)',
                padding: 4,
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.4 }}>
            {selectedPin.loreSnippet}
          </p>

          {selectedPin.activeClueForStop === activeStop.stopNumber && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(153, 27, 27, 0.2)',
                border: '1px solid rgba(220, 38, 38, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color="#E5C07B" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#FEF3C7' }}>
                  Target for Active Clue Stop 2 (48m away)
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenCheckIn}
                style={{
                  padding: '5px 12px',
                  backgroundColor: 'var(--wax-crimson)',
                  border: '1px solid var(--gold-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Check In
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
