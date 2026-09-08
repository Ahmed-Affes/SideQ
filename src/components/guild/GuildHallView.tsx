import React, { useState } from 'react';
import type { Guild, UserProfile } from '../../types';
import { Shield, Trophy, ChevronRight, MessageSquare, Check, Sparkles, Plus, Award } from 'lucide-react';
import { BadgePill } from '../common/BadgePill';

interface GuildHallViewProps {
  guild: Guild;
  user: UserProfile;
  onOpenWarRoom: () => void;
  onOpenDirectory: () => void;
}

export const GuildHallView: React.FC<GuildHallViewProps> = ({
  guild,
  user,
  onOpenWarRoom,
  onOpenDirectory
}) => {
  const [activeTab, setActiveTab] = useState<'hall' | 'roster' | 'perks'>('hall');

  const xpPercent = Math.min(100, Math.round((guild.currentXp / guild.nextLevelXp) * 100));

  const renderCrestSvg = () => (
    <svg width="44" height="44" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2BE" />
          <stop offset="50%" stopColor="#E5C07B" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>
      </defs>
      {/* Heraldic Shield */}
      <path
        d="M 50 10 L 85 20 C 85 58, 50 88, 50 88 C 50 88, 15 58, 15 20 Z"
        fill="#1E1B4B"
        stroke="url(#crestGold)"
        strokeWidth="3.5"
      />
      {/* Clockwork Gear & Star */}
      <circle cx="50" cy="46" r="16" fill="none" stroke="#E5C07B" strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="50" cy="46" r="8" fill="#C5A059" />
      <polygon points="50,26 53,40 67,46 53,52 50,66 47,52 33,46 47,40" fill="#FFF2BE" opacity="0.85" />
    </svg>
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-abyss)',
        overflowY: 'auto',
        userSelect: 'none',
        paddingBottom: 24
      }}
    >
      {/* Guild Heraldic Hero Banner */}
      <div
        style={{
          background: guild.bannerGradient,
          borderBottom: '1px solid var(--border-gilded)',
          padding: '24px 18px 18px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background insignia watermark */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            opacity: 0.08,
            transform: 'rotate(15deg)',
            pointerEvents: 'none'
          }}
        >
          <Shield size={160} color="#fff" />
        </div>

        {/* Directory Switch Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <BadgePill label={`CAMPUS RANK #${guild.campusRank}`} variant="gold" size="sm" icon={<Trophy size={11} />} />

          <button
            type="button"
            onClick={onOpenDirectory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '11px',
              color: '#C7D2FE',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '3px 10px',
              borderRadius: 14,
              cursor: 'pointer'
            }}
          >
            <span>All Guilds</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Heraldic Title & Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #2a334d 0%, #0c101c 100%)',
              border: '2px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(229, 192, 123, 0.4)',
              flexShrink: 0
            }}
          >
            {renderCrestSvg()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2
                style={{
                  fontSize: '18px',
                  margin: 0,
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.03em'
                }}
              >
                {guild.name}
              </h2>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--gold-primary)',
                  border: '1px solid rgba(229, 192, 123, 0.4)',
                  padding: '1px 6px',
                  borderRadius: 4,
                  fontWeight: 800
                }}
              >
                [{guild.tag}]
              </span>
            </div>

            <p
              style={{
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--text-parchment)',
                margin: '2px 0 0',
                fontFamily: 'Georgia, serif'
              }}
            >
              “{guild.motto}”
            </p>
          </div>
        </div>

        {/* Guild Level & Shared XP Pool Bar */}
        <div
          style={{
            marginTop: 16,
            backgroundColor: 'rgba(7, 10, 18, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="var(--gold-primary)" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                GUILD LEVEL {guild.level}
              </span>
            </div>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {guild.currentXp.toLocaleString()} / {guild.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: 7,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${xpPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #c5a059 0%, #fef3c7 70%, #c5a059 100%)',
                boxShadow: '0 0 10px rgba(229, 192, 123, 0.5)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Next Perk: <strong>Guild Radar Beacon</strong> at Lv.5
            </span>

            <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 700 }}>
              +{guild.weeklyXp} XP this week
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(11, 15, 25, 0.6)',
          padding: '0 16px'
        }}
      >
        {[
          { id: 'hall', label: 'Hall & Quests' },
          { id: 'roster', label: `Roster (${guild.memberCount})` },
          { id: 'perks', label: 'Perks Ladder' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 14px',
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: activeTab === tab.id ? 800 : 500,
              color: activeTab === tab.id ? 'var(--gold-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Views */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* VIEW 1: HALL & BOUNTIES */}
        {activeTab === 'hall' && (
          <>
            {/* Quick Action: War Room Chat */}
            <button
              type="button"
              onClick={onOpenWarRoom}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(49, 46, 129, 0.25)',
                border: '1px solid rgba(165, 180, 252, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#C7D2FE',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8'
                  }}
                >
                  <MessageSquare size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    Open War Room Chat
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Elena: "We need 1 more member for Clock Tower..."
                  </div>
                </div>
              </div>

              <ChevronRight size={18} color="#818CF8" />
            </button>

            {/* Active Guild Mini-Challenge */}
            {guild.activeChallenge && (
              <div className="gilded-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        color: 'var(--gold-primary)',
                        letterSpacing: '0.06em'
                      }}
                    >
                      INTERNAL MINI-CHALLENGE
                    </span>
                    <h3 style={{ fontSize: '15px', margin: '3px 0', color: 'var(--text-heading)' }}>
                      {guild.activeChallenge.title}
                    </h3>
                  </div>

                  <BadgePill label={`+${guild.activeChallenge.rewardGuildXp} GUILD XP`} variant="emerald" size="sm" />
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: '8px 0 12px', lineHeight: 1.4 }}>
                  {guild.activeChallenge.description}
                </p>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontWeight: 700, color: '#FEF3C7' }}>
                      {guild.activeChallenge.progress} / {guild.activeChallenge.total} Completed
                    </span>
                  </div>

                  <div
                    style={{
                      height: 6,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${(guild.activeChallenge.progress / guild.activeChallenge.total) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--cipher-emerald)'
                      }}
                    />
                  </div>

                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 6, display: 'block' }}>
                    Expires in {guild.activeChallenge.expiresInHours} hours
                  </span>
                </div>
              </div>
            )}

            {/* Guild Description & Lore */}
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'rgba(15, 22, 38, 0.6)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-gilded)'
              }}
            >
              <h4 style={{ fontSize: '12px', color: 'var(--gold-primary)', margin: '0 0 6px', fontFamily: 'var(--font-display)' }}>
                ABOUT OUR SOCIETY
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                {guild.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {guild.recruitmentTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      color: 'var(--gold-secondary)',
                      backgroundColor: 'rgba(229, 192, 123, 0.08)',
                      border: '1px solid rgba(197, 160, 89, 0.2)',
                      padding: '2px 8px',
                      borderRadius: 12
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: MEMBER ROSTER */}
        {activeTab === 'roster' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {guild.members.length} / {guild.maxMembers} Members Enrolled
              </span>

              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--gold-primary)',
                  background: 'rgba(229, 192, 123, 0.1)',
                  border: '1px solid var(--border-gilded)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} />
                <span>Invite Scholar</span>
              </button>
            </div>

            {guild.members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: member.id === user.id ? 'rgba(229, 192, 123, 0.08)' : 'rgba(15, 22, 38, 0.6)',
                  border: `1px solid ${member.id === user.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#1E293B',
                        border: '1px solid var(--gold-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#E5C07B',
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>

                    {member.isOnline && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          border: '2px solid #0F1626'
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {member.name}
                      </span>
                      {member.id === user.id && (
                        <span style={{ fontSize: '9px', color: 'var(--gold-primary)', fontWeight: 800 }}>
                          (YOU)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {member.role} • Lv.{member.level}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FEF3C7' }}>
                    +{member.weeklyXpContributed} XP
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                    {member.questsCompleted} Quests
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: PERKS LADDER */}
        {activeTab === 'perks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {guild.perks.map((perk) => (
              <div
                key={perk.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: perk.isUnlocked ? 'rgba(5, 150, 105, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${perk.isUnlocked ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: perk.isUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${perk.isUnlocked ? '#10B981' : '#475569'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: perk.isUnlocked ? '#34D399' : '#64748B',
                    flexShrink: 0
                  }}
                >
                  {perk.isUnlocked ? <Check size={18} /> : <Award size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '13px', margin: 0, color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
                      {perk.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: perk.isUnlocked ? '#34D399' : 'var(--gold-primary)'
                      }}
                    >
                      {perk.isUnlocked ? 'UNLOCKED' : `REQ. LV.${perk.levelRequired}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', margin: '4px 0 0', lineHeight: 1.4 }}>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
