import React, { useState } from 'react';
import { X, Shield, Sparkles } from 'lucide-react';
import type { Guild } from '../../types';

interface GuildCreateModalProps {
  onClose: () => void;
  onGuildCreated: (newGuild: Partial<Guild>) => void;
}

export const GuildCreateModal: React.FC<GuildCreateModalProps> = ({ onClose, onGuildCreated }) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [motto, setMotto] = useState('');
  const [crest, setCrest] = useState<'owl' | 'gear' | 'willow' | 'flask'>('gear');
  const [memberCap, setMemberCap] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tag.trim()) return;

    onGuildCreated({
      name,
      tag: tag.toUpperCase().slice(0, 5),
      motto: motto || 'Wisdom Unveiled in Shadows',
      crestId: crest,
      maxMembers: memberCap,
      memberCount: 1,
      level: 1,
      currentXp: 0,
      nextLevelXp: 1500,
      campusRank: 8,
      weeklyXp: 0,
      allTimeXp: 0,
      bannerGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      accentColor: '#e5c07b',
      isOpen: true,
      recruitmentVibe: 'New Collegiate Fellowship',
      recruitmentTags: ['New Guild', 'Lore Seekers', 'Casual'],
      members: [],
      perks: []
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 65,
        backgroundColor: 'rgba(5, 8, 14, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#0F1626',
          borderTop: '2px solid var(--gold-primary)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 18px 30px',
          boxShadow: '0 -15px 40px rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              FELLOWSHIP CHARTER
            </span>
            <h3
              style={{
                fontSize: '17px',
                margin: 0,
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)'
              }}
            >
              Found a Campus Society
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Guild Name */}
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
              SOCIETY NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Night Scriveners…"
              style={{
                width: '100%',
                marginTop: 4,
                padding: '10px 12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-gilded)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Tag & Member Cap Row */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                TAG (MAX 5 CHARS)
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={tag}
                onChange={(e) => setTag(e.target.value.toUpperCase())}
                placeholder="SCRIV"
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gilded)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 800,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                MEMBER CAP ({memberCap})
              </label>
              <input
                type="range"
                min={10}
                max={30}
                value={memberCap}
                onChange={(e) => setMemberCap(Number(e.target.value))}
                style={{
                  width: '100%',
                  marginTop: 14,
                  accentColor: 'var(--gold-primary)'
                }}
              />
            </div>
          </div>

          {/* Motto */}
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
              SOCIETY MOTTO
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="e.g. By Ink and Iron We Endure…"
              style={{
                width: '100%',
                marginTop: 4,
                padding: '10px 12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-gilded)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Crest Heraldry Selector */}
          <div>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
              CHOOSE HERALDIC CREST
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
              {[
                { id: 'gear' as const, label: 'Astrolabe' },
                { id: 'owl' as const, label: 'Archival Owl' },
                { id: 'willow' as const, label: 'Willow Tree' },
                { id: 'flask' as const, label: 'Alchemy' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCrest(c.id)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: crest === c.id ? 'rgba(229, 192, 123, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${crest === c.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    color: crest === c.id ? 'var(--gold-primary)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <Shield size={20} />
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: 10,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #c5a059 0%, #e5c07b 50%, #8c6e30 100%)',
              border: 'none',
              color: '#070a10',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(229, 192, 123, 0.4)'
            }}
          >
            <Sparkles size={16} />
            <span>SEAL & CHARTER SOCIETY</span>
          </button>
        </form>
      </div>
    </div>
  );
};
