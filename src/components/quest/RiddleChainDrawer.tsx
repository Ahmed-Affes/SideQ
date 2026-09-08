import React from 'react';
import type { Quest } from '../../types';
import { X, Lock, BookOpen } from 'lucide-react';
import { WaxSeal } from '../common/WaxSeal';

interface RiddleChainDrawerProps {
  quest: Quest | null;
  onClose: () => void;
}

export const RiddleChainDrawer: React.FC<RiddleChainDrawerProps> = ({ quest, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 55,
        backgroundColor: 'rgba(5, 8, 14, 0.85)',
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
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header */}
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
              CHAPTER CHRONICLES
            </span>
            <h3
              style={{
                fontSize: '17px',
                margin: 0,
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)'
              }}
            >
              {quest?.title || 'No Active Chapter'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close story drawer"
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

        {/* Narrative Intro Excerpt */}
        {quest?.narrativeIntro && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(11, 15, 25, 0.7)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-gilded)',
              fontSize: '12px',
              lineHeight: 1.5,
              color: 'var(--text-sub)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <BookOpen size={14} color="var(--gold-primary)" />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                THE LORE BACKGROUND
              </span>
            </div>
            {quest.narrativeIntro}
          </div>
        )}

        {/* Clue Stops Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!quest || quest.stops.length === 0 ? (
            <div
              style={{
                padding: '30px 16px',
                textAlign: 'center',
                backgroundColor: 'rgba(11, 15, 25, 0.5)',
                border: '1px dashed var(--border-gilded)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                lineHeight: 1.5
              }}
            >
              The chapter chronicle is empty. When the campus Questmaster broadcasts the weekly mystery, the sequence of riddle stops will illuminate here.
            </div>
          ) : (
            quest.stops.map((stop, idx) => {
            const isCompleted = stop.status === 'completed';
            const isActive = stop.status === 'active';
            const isLocked = stop.status === 'locked';

            return (
              <div
                key={stop.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive
                    ? 'rgba(153, 27, 27, 0.15)'
                    : isCompleted
                    ? 'rgba(5, 150, 105, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--border-gold-bright)'
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.35)'
                      : 'rgba(255, 255, 255, 0.08)'
                  }`
                }}
              >
                {/* Stop Marker / Wax Seal */}
                <div style={{ flexShrink: 0 }}>
                  <WaxSeal status={stop.status} size="sm" />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: isCompleted ? '#34D399' : isActive ? 'var(--gold-primary)' : 'var(--text-muted)'
                        }}
                      >
                        STOP {stop.stopNumber} • {stop.status.toUpperCase()}
                      </span>
                      <h4
                        style={{
                          fontSize: '14px',
                          margin: '2px 0 6px',
                          color: 'var(--text-heading)',
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        {stop.title}
                      </h4>
                    </div>

                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--gold-primary)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700
                      }}
                    >
                      +{stop.xpReward} XP
                    </span>
                  </div>

                  {/* Riddle Text (shown for completed or active) */}
                  {!isLocked ? (
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-parchment)',
                        fontStyle: 'italic',
                        margin: '0 0 6px',
                        lineHeight: 1.4
                      }}
                    >
                      “{stop.metaphoricRiddle}”
                    </p>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '11px' }}>
                      <Lock size={12} />
                      <span>Shrouded in campus fog. Solve Stop {idx} to decipher.</span>
                    </div>
                  )}

                  {/* Unlocked Lore Excerpt if completed */}
                  {isCompleted && stop.storyLoreUnlock && (
                    <div
                      style={{
                        marginTop: 6,
                        padding: '6px 8px',
                        borderRadius: 4,
                        backgroundColor: 'rgba(5, 150, 105, 0.15)',
                        borderLeft: '2px solid #10B981',
                        fontSize: '11px',
                        color: '#A7F3D0'
                      }}
                    >
                      {stop.storyLoreUnlock}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
};
