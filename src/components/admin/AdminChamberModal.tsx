import React, { useState } from 'react';
import type { Quest } from '../../types';
import { X, KeyRound, Clock, Bot } from 'lucide-react';

interface AdminChamberModalProps {
  quest: Quest;
  onClose: () => void;
  onSaveQuest: (updatedQuest: Quest) => void;
}

export const AdminChamberModal: React.FC<AdminChamberModalProps> = ({
  quest,
  onClose,
  onSaveQuest
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'author' | 'stats' | 'schedule'>('author');
  const [questTitle, setQuestTitle] = useState(quest.title);
  const [narrativeIntro, setNarrativeIntro] = useState(quest.narrativeIntro);
  const [showAiDraftNotice, setShowAiDraftNotice] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        backgroundColor: 'rgba(5, 8, 14, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0E1524',
          borderTop: '2px solid var(--gold-primary)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 30px',
          boxShadow: '0 -20px 50px rgba(0,0,0,0.95)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(229, 192, 123, 0.15)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-primary)'
              }}
            >
              <KeyRound size={18} />
            </div>

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
                ADMIN CHAMBER
              </span>
              <h3 style={{ fontSize: '16px', margin: 0, color: '#fff', fontFamily: 'var(--font-display)' }}>
                Quest Master Studio
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin modal"
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

        {/* Sub Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: 3
          }}
        >
          {[
            { id: 'author', label: 'Quest Authoring' },
            { id: 'stats', label: 'Campus Analytics' },
            { id: 'schedule', label: 'Drop Timer' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAdminTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 4,
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: activeAdminTab === tab.id ? 800 : 500,
                backgroundColor: activeAdminTab === tab.id ? 'rgba(229, 192, 123, 0.2)' : 'transparent',
                color: activeAdminTab === tab.id ? 'var(--gold-primary)' : 'var(--text-muted)',
                border: activeAdminTab === tab.id ? '1px solid var(--border-gilded)' : 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: QUEST AUTHORING */}
        {activeAdminTab === 'author' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                WEEKLY QUEST TITLE
              </label>
              <input
                type="text"
                value={questTitle}
                onChange={(e) => setQuestTitle(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gilded)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                  STORY NARRATIVE INTRO
                </label>

                {/* AI Draft Button (Staged) */}
                <button
                  type="button"
                  onClick={() => setShowAiDraftNotice(!showAiDraftNotice)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '10px',
                    color: 'var(--gold-secondary)',
                    backgroundColor: 'rgba(229, 192, 123, 0.08)',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    padding: '2px 8px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                >
                  <Bot size={12} />
                  <span>AI Riddle Crafter (Staged)</span>
                </button>
              </div>

              {showAiDraftNotice && (
                <div
                  style={{
                    padding: '8px 10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: 6,
                    fontSize: '10px',
                    color: 'var(--gold-primary)',
                    margin: '6px 0'
                  }}
                >
                  AI-assisted riddle writing (giving locations + theme to draft riddles) is staged and pending confirmation.
                </div>
              )}

              <textarea
                rows={3}
                value={narrativeIntro}
                onChange={(e) => setNarrativeIntro(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gilded)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {/* Clue Chain Editor */}
            <div>
              <label style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                CLUE STOPS CHAIN ({quest.stops.length} STOPS)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                {quest.stops.map((stop) => (
                  <div
                    key={stop.id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        Stop {stop.stopNumber}: {stop.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Target: {stop.locationName} • +{stop.xpReward} XP
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: '9px', color: 'var(--gold-primary)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '2px 6px', borderRadius: 4 }}>
                        GPS + QR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSaveQuest({ ...quest, title: questTitle, narrativeIntro });
                onClose();
              }}
              style={{
                marginTop: 6,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--gold-primary)',
                color: '#070A10',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              SAVE & UPDATE QUEST
            </button>
          </div>
        )}

        {/* TAB 2: LIVE CAMPUS ANALYTICS */}
        {activeAdminTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold-primary)' }}>142</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACTIVE SCHOLARS</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399' }}>88%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>GUILD ENGAGEMENT</div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--gold-primary)', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
                WHERE ARE PLAYERS STUCK?
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { stop: 'Stop 1: Library Corbel', count: 112, percent: 79, color: '#10B981' },
                  { stop: 'Stop 2: Clock Tower Shadow', count: 44, percent: 31, color: '#E5C07B' },
                  { stop: 'Stop 3: Victorian Conservatory', count: 18, percent: 12, color: '#38BDF8' },
                  { stop: 'Stop 4: Whispering Arches', count: 8, percent: 5, color: '#A855F7' }
                ].map((item) => (
                  <div key={item.stop}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 3 }}>
                      <span style={{ color: '#E2E8F0' }}>{item.stop}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{item.count} scholars ({item.percent}%)</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE DROP TIMER */}
        {activeAdminTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid var(--border-gilded)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-primary)', marginBottom: 6 }}>
                <Clock size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  WEEKLY QUEST AUTOMATIC DROP
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: '0 0 10px' }}>
                Quests go live every <strong>Monday at 9:00 AM</strong> to build anticipation before collegiate classes begin.
              </p>
              <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 600 }}>
                Next Drop: Monday, Sept 14, 09:00:00 AM (Scheduled)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
