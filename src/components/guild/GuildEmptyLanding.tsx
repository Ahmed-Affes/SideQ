import React from 'react';
import type { Guild } from '../../types';
import { Shield, Plus, Users, Sparkles } from 'lucide-react';
import { BadgePill } from '../common/BadgePill';

interface GuildEmptyLandingProps {
  guilds: Guild[];
  onJoinGuild: (guildId: string) => void;
  onOpenCreateGuild: () => void;
}

export const GuildEmptyLanding: React.FC<GuildEmptyLandingProps> = ({
  guilds,
  onJoinGuild,
  onOpenCreateGuild
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-abyss)',
        overflowY: 'auto',
        userSelect: 'none',
        padding: '20px 16px 36px',
        gap: 18
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
            FELLOWSHIP & DOMINION
          </span>
          <h2
            style={{
              fontSize: '20px',
              margin: '3px 0 6px',
              color: 'var(--text-heading)',
              fontFamily: 'var(--font-display)'
            }}
          >
            Campus Societies
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4, maxWidth: '320px' }}>
            To unlock the private War Room, contribute to society XP pools, and climb the Guild Dominion ladder, enroll in a chartered society or forge your own.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateGuild}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#070A10',
            backgroundColor: 'var(--gold-primary)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(229, 192, 123, 0.4)',
            flexShrink: 0
          }}
        >
          <Plus size={14} />
          <span>Charter Society</span>
        </button>
      </div>

      {/* Case 1: Zero Guilds in Database */}
      {guilds.length === 0 ? (
        <div
          style={{
            marginTop: 10,
            padding: '36px 20px',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 22, 38, 0.6)',
            border: '1px dashed var(--border-gilded)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 192, 123, 0.1)',
              border: '1.5px solid var(--border-gilded)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
              boxShadow: '0 0 20px rgba(229, 192, 123, 0.2)'
            }}
          >
            <Shield size={28} />
          </div>

          <div>
            <h3
              style={{
                fontSize: '16px',
                margin: '0 0 6px',
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.03em'
              }}
            >
              The Seats of Power are Empty
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-sub)',
                margin: 0,
                lineHeight: 1.5,
                maxWidth: '280px'
              }}
            >
              No collegiate societies have been chartered on campus yet. Assemble your fellow scholars and be the first to inscribe your crest upon the university ledger.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateGuild}
            style={{
              marginTop: 6,
              height: 44,
              padding: '0 24px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #c5a059 0%, #e5c07b 50%, #8c6e30 100%)',
              border: 'none',
              color: '#070a10',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(229, 192, 123, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>CHARTER THE FIRST SOCIETY</span>
          </button>
        </div>
      ) : (
        /* Case 2: Available Guilds to Join */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {guilds.map((g) => (
            <div
              key={g.id}
              className="gilded-card"
              style={{
                padding: '16px',
                background: g.bannerGradient || 'rgba(15, 22, 38, 0.8)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: '1.5px solid var(--gold-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)'
                    }}
                  >
                    <Shield size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h3 style={{ fontSize: '15px', margin: 0, color: '#fff', fontFamily: 'var(--font-display)' }}>
                        {g.name}
                      </h3>
                      <span style={{ fontSize: '10px', color: 'var(--gold-primary)', fontWeight: 800 }}>
                        [{g.tag}]
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: 2 }}>
                      {g.memberCount} Members • Lv.{g.level} Society
                    </div>
                  </div>
                </div>

                <BadgePill label={`RANK #${g.campusRank}`} variant="gold" size="sm" />
              </div>

              {g.motto && (
                <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-parchment)', margin: '10px 0', lineHeight: 1.4 }}>
                  “{g.motto}”
                </p>
              )}

              <button
                type="button"
                onClick={() => onJoinGuild(g.id)}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(229, 192, 123, 0.15)',
                  border: '1px solid var(--gold-primary)',
                  color: 'var(--gold-primary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <Users size={14} />
                <span>ENROLL IN {g.name.toUpperCase()}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
