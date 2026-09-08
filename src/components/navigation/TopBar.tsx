import React from 'react';
import type { UserProfile } from '../../types';
import { Shield, Sparkles, LogOut } from 'lucide-react';

interface TopBarProps {
  user: UserProfile;
  onOpenAdmin?: () => void;
  onSelectTab: (tab: 'quest' | 'guild' | 'chat' | 'leaderboard' | 'profile') => void;
  activeTab: string;
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onSelectTab,
  onSignOut
}) => {

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'rgba(11, 15, 25, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-gilded)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'relative',
        zIndex: 30,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        userSelect: 'none'
      }}
    >
      {/* Brand & Society Seal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer'
        }}
        onClick={() => onSelectTab('quest')}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #2a3b5c 0%, #0d1424 100%)',
            border: '1.5px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(229, 192, 123, 0.3)'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ornate)',
              color: 'var(--gold-primary)',
              fontWeight: 900,
              fontSize: '15px'
            }}
          >
            Q
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '0.04em',
                color: 'var(--text-heading)'
              }}
            >
              SideQ
            </span>
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                padding: '1px 5px',
                borderRadius: 4,
                backgroundColor: 'rgba(229, 192, 123, 0.15)',
                border: '1px solid rgba(229, 192, 123, 0.3)'
              }}
            >
              SOCIETY
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Week 7 • Ep. III
          </span>
        </div>
      </div>

      {/* Right Action Hub: Level Chip, Society Tag (if enrolled), & Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Society Tag Badge (Only shown if enrolled in a guild) */}
        {user.guildTag && (
          <button
            type="button"
            onClick={() => onSelectTab('guild')}
            aria-label={`Guild ${user.guildName}, tap to view guild`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(49, 46, 129, 0.3)',
              border: '1px solid rgba(165, 180, 252, 0.3)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              color: '#C7D2FE',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer'
            }}
          >
            <Shield size={11} color="#818CF8" />
            <span>[{user.guildTag}]</span>
          </button>
        )}

        {/* Level & XP Mini Bar */}
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          aria-label="View scholar profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(229, 192, 123, 0.25)',
            padding: '4px 10px',
            borderRadius: 14,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={11} color="var(--gold-primary)" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              fontFamily: 'var(--font-display)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            Lv.{user.level}
          </span>
        </button>

        {/* Sign Out Button */}
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out of scholar account"
            title="Sign Out"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(153, 27, 27, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F87171',
              cursor: 'pointer'
            }}
          >
            <LogOut size={13} />
          </button>
        )}
      </div>
    </header>
  );
};
