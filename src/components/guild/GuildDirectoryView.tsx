import React, { useState } from 'react';
import type { Guild } from '../../types';
import { Shield, Search, ChevronLeft, Plus, CheckCircle2, Users } from 'lucide-react';
import { BadgePill } from '../common/BadgePill';

interface GuildDirectoryViewProps {
  guilds: Guild[];
  currentGuildId: string;
  onBackToMyGuild: () => void;
  onOpenCreateGuild: () => void;
}

export const GuildDirectoryView: React.FC<GuildDirectoryViewProps> = ({
  guilds,
  currentGuildId,
  onBackToMyGuild,
  onOpenCreateGuild
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [appliedGuildId, setAppliedGuildId] = useState<string | null>(null);

  const filters = ['All', 'Speedrunners', 'Lore Masters', 'Night Explorers', 'Casual'];

  const filteredGuilds = guilds.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.motto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.recruitmentVibe.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    return g.recruitmentTags.some((t) => t.toLowerCase().includes(selectedFilter.toLowerCase()));
  });

  const handleApply = (guildId: string) => {
    setAppliedGuildId(guildId);
    setTimeout(() => {
      setAppliedGuildId(null);
    }, 3000);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-abyss)',
        overflowY: 'auto',
        userSelect: 'none',
        padding: '16px 16px 30px',
        gap: 16
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={onBackToMyGuild}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--gold-primary)',
            cursor: 'pointer',
            padding: '6px 0'
          }}
        >
          <ChevronLeft size={16} />
          <span>My Guild Hall</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreateGuild}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: '#062817',
            backgroundColor: 'var(--gold-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(229, 192, 123, 0.4)'
          }}
        >
          <Plus size={14} />
          <span>Found Society</span>
        </button>
      </div>

      <div>
        <h2 style={{ fontSize: '18px', margin: '0 0 4px', color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
          Campus Guild Directory
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Join a fellowship of 10–30 scholars to share cipher bounties and conquer campus leaderboards.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-gilded)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px'
        }}
      >
        <Search size={16} color="var(--gold-primary)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search society name, tag, or play style…"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-parchment)',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            width: '100%'
          }}
        />
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSelectedFilter(f)}
            style={{
              padding: '5px 12px',
              borderRadius: 16,
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: selectedFilter === f ? 800 : 500,
              backgroundColor: selectedFilter === f ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedFilter === f ? '#070A10' : 'var(--text-muted)',
              border: selectedFilter === f ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Guild Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredGuilds.map((g) => {
          const isMyGuild = g.id === currentGuildId;
          const isFull = g.memberCount >= g.maxMembers;
          const hasApplied = appliedGuildId === g.id;

          return (
            <div
              key={g.id}
              className="gilded-card"
              style={{
                padding: '16px',
                background: g.bannerGradient
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Lv.{g.level} Society
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                      <span style={{ fontSize: '11px', color: 'var(--gold-primary)' }}>
                        Rank #{g.campusRank}
                      </span>
                    </div>
                  </div>
                </div>

                {isMyGuild ? (
                  <BadgePill label="YOUR GUILD" variant="gold" size="sm" />
                ) : (
                  <span style={{ fontSize: '11px', color: isFull ? '#F87171' : '#34D399', fontWeight: 700 }}>
                    {g.memberCount}/{g.maxMembers} Members
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'var(--text-parchment)',
                  margin: '10px 0 8px',
                  lineHeight: 1.4
                }}
              >
                “{g.motto}”
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {g.recruitmentTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '9px',
                      color: '#E2E8F0',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      padding: '2px 7px',
                      borderRadius: 10,
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              {!isMyGuild && (
                <button
                  type="button"
                  onClick={() => handleApply(g.id)}
                  disabled={isFull || hasApplied}
                  style={{
                    width: '100%',
                    height: 38,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: hasApplied ? '#059669' : isFull ? 'rgba(255,255,255,0.06)' : 'rgba(229, 192, 123, 0.15)',
                    border: hasApplied ? '1px solid #10B981' : isFull ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--gold-primary)',
                    color: hasApplied ? '#ECFDF5' : isFull ? 'var(--text-muted)' : 'var(--gold-primary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: isFull || hasApplied ? 'default' : 'pointer'
                  }}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>APPLICATION SUBMITTED</span>
                    </>
                  ) : isFull ? (
                    <span>MEMBERSHIP FULL</span>
                  ) : (
                    <>
                      <Users size={14} />
                      <span>PETITION FOR ENROLLMENT</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
