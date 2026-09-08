import React, { useState } from 'react';
import { initialLeaderboards } from '../../data/campusData';
import { Shield, Timer } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [boardType, setBoardType] = useState<'solo' | 'guild'>('solo');

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-abyss)',
        overflowY: 'auto',
        userSelect: 'none',
        padding: '16px 16px 28px',
        gap: 16
      }}
    >
      <div>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--gold-primary)',
            letterSpacing: '0.08em'
          }}
        >
          HALL OF MERIT
        </span>
        <h2 style={{ fontSize: '18px', margin: '2px 0 4px', color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
          Campus Quest Standings
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Tracking the swiftest riddle decoders and highest-prestige societies for Week 7.
        </p>
      </div>

      {/* Switcher */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: 4,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          type="button"
          onClick={() => setBoardType('solo')}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: boardType === 'solo' ? 'rgba(229, 192, 123, 0.2)' : 'transparent',
            border: boardType === 'solo' ? '1px solid var(--border-gilded)' : 'none',
            color: boardType === 'solo' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Timer size={14} />
          <span>Weekly Solvers</span>
        </button>

        <button
          type="button"
          onClick={() => setBoardType('guild')}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: boardType === 'guild' ? 'rgba(229, 192, 123, 0.2)' : 'transparent',
            border: boardType === 'guild' ? '1px solid var(--border-gilded)' : 'none',
            color: boardType === 'guild' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Shield size={14} />
          <span>Guild Dominion</span>
        </button>
      </div>

      {/* List Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {boardType === 'solo' ? (
          initialLeaderboards.weeklySolo.map((entry) => {
            const isTop3 = entry.rank <= 3;

            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: entry.isCurrentPlayer ? 'rgba(229, 192, 123, 0.1)' : 'rgba(15, 22, 38, 0.6)',
                  border: `1px solid ${entry.isCurrentPlayer ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: entry.rank === 1 ? '#F59E0B' : entry.rank === 2 ? '#94A3B8' : entry.rank === 3 ? '#B45309' : 'rgba(255,255,255,0.06)',
                      color: isTop3 ? '#0F172A' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {entry.rank}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {entry.name}
                      </span>
                      {entry.guildTag && (
                        <span style={{ fontSize: '9px', color: '#818CF8', fontWeight: 700 }}>
                          [{entry.guildTag}]
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {entry.badgesCount} Badges Earned
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {entry.completionTimeFormatted}
                  </div>
                  <div style={{ fontSize: '10px', color: '#34D399' }}>
                    +{entry.score} XP
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          initialLeaderboards.guildDominion.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: entry.isCurrentPlayer ? 'rgba(229, 192, 123, 0.1)' : 'rgba(15, 22, 38, 0.6)',
                border: `1px solid ${entry.isCurrentPlayer ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: entry.rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${entry.rank === 1 ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: entry.rank === 1 ? '#F59E0B' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  #{entry.rank}
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', margin: 0, color: '#fff', fontFamily: 'var(--font-display)' }}>
                    {entry.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 700 }}>
                    [{entry.guildTag}]
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FEF3C7', fontVariantNumeric: 'tabular-nums' }}>
                  {entry.score.toLocaleString()} XP
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Total Guild Contribution
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
