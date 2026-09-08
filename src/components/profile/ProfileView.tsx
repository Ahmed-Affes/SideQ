import React from 'react';
import type { UserProfile } from '../../types';
import { Compass, Flame, Clock, Moon, Eye } from 'lucide-react';
import { BadgePill } from '../common/BadgePill';

interface ProfileViewProps {
  user: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const xpPercent = Math.min(100, Math.round((user.currentXp / user.nextLevelXp) * 100));

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon':
        return <Moon size={18} color="#C084FC" />;
      case 'Clock':
        return <Clock size={18} color="#FBBF24" />;
      case 'Eye':
        return <Eye size={18} color="#34D399" />;
      case 'Compass':
      default:
        return <Compass size={18} color="#E5C07B" />;
    }
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
      {/* Student Dossier Card */}
      <div className="gilded-card" style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              border: '2px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 16px rgba(229, 192, 123, 0.35)'
            }}
          >
            {user.name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: '#fff', fontFamily: 'var(--font-display)' }}>
                {user.name}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {user.handle}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <BadgePill label={user.title} variant="gold" size="sm" />
              <BadgePill label={`[${user.guildTag}]`} variant="azure" size="sm" />
            </div>
          </div>
        </div>

        {/* Level Progression */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
              LEVEL {user.level} SCHOLAR
            </span>
            <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {user.currentXp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP
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
                background: 'linear-gradient(90deg, #c5a059, #fef3c7, #c5a059)',
                borderRadius: 4
              }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginTop: 18,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {user.completedQuestsCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Quests Solved
            </div>
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {user.locationsDiscovered}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Landmarks
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Flame size={14} color="#F97316" />
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#F97316', fontVariantNumeric: 'tabular-nums' }}>
                {user.currentStreakDays}d
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Daily Streak
            </div>
          </div>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
            EARNED SEALS & TITLES ({user.badges.length})
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 700 }}>
            Style: Master Cryptographer
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(15, 22, 38, 0.7)',
                border: '1px solid var(--border-gilded)',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(229, 192, 123, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getBadgeIcon(badge.icon)}
              </div>

              <div>
                <h4 style={{ fontSize: '12px', margin: 0, color: 'var(--text-heading)', fontFamily: 'var(--font-display)' }}>
                  {badge.name}
                </h4>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.3 }}>
                  {badge.description}
                </p>
                <span style={{ fontSize: '9px', color: 'var(--gold-secondary)', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                  Unlocked {badge.unlockedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
