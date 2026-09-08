import React from 'react';
import { Compass, Shield, MessageSquare, Trophy, Scroll } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'quest' | 'guild' | 'chat' | 'leaderboard' | 'profile';
  onSelectTab: (tab: 'quest' | 'guild' | 'chat' | 'leaderboard' | 'profile') => void;
  unreadChatCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadChatCount = 0
}) => {
  const tabs = [
    { id: 'quest' as const, label: 'Quest', icon: Compass },
    { id: 'guild' as const, label: 'Guilds', icon: Shield },
    { id: 'chat' as const, label: 'Campfire', icon: MessageSquare, badge: unreadChatCount },
    { id: 'leaderboard' as const, label: 'Ranks', icon: Trophy },
    { id: 'profile' as const, label: 'Chronicle', icon: Scroll }
  ];

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        height: 'var(--nav-height)',
        backgroundColor: 'rgba(11, 15, 25, 0.94)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-gilded)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        position: 'relative',
        zIndex: 30,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.7)',
        userSelect: 'none'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={`${tab.label} tab${isActive ? ' (current screen)' : ''}`}
            aria-selected={isActive}
            role="tab"
            style={{
              flex: 1,
              height: '100%',
              minWidth: 'var(--touch-target-min)',
              minHeight: 'var(--touch-target-min)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Top active marker line */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 32,
                  height: 2.5,
                  borderRadius: '0 0 2px 2px',
                  background: 'linear-gradient(90deg, #c5a059, #fef3c7, #c5a059)',
                  boxShadow: '0 2px 8px rgba(229, 192, 123, 0.6)'
                }}
              />
            )}

            {/* Icon Container with Badge */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.8}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(229, 192, 123, 0.4))' : 'none'
                }}
              />

              {Boolean(tab.badge && tab.badge > 0) && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -7,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    backgroundColor: 'var(--wax-crimson)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid var(--bg-surface)',
                    boxShadow: '0 0 6px rgba(153, 27, 27, 0.6)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 800 : 500,
                letterSpacing: '0.04em',
                color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
