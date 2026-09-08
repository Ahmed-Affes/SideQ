import React, { useState } from 'react';
import type { QuestStop } from '../../types';
import { WaxSeal } from '../common/WaxSeal';
import { QrCode, MapPin, ChevronUp, Bot, Sparkles } from 'lucide-react';

interface ActiveClueCardProps {
  questTitle: string;
  episode: string;
  activeStop: QuestStop;
  currentStopIndex: number;
  totalStops: number;
  onOpenCheckIn: () => void;
  onOpenChainDrawer: () => void;
}

export const ActiveClueCard: React.FC<ActiveClueCardProps> = ({
  questTitle,
  episode,
  activeStop,
  currentStopIndex,
  totalStops,
  onOpenCheckIn,
  onOpenChainDrawer
}) => {
  const [showAiNotice, setShowAiNotice] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(14, 20, 34, 0.95)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--border-gilded)',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.7)',
        padding: '16px 18px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        zIndex: 25,
        userSelect: 'none'
      }}
    >
      {/* Top Header: Episode & Chain Progress Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase'
            }}
          >
            {episode} • {questTitle}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>•</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Stop {currentStopIndex + 1} of {totalStops}
          </span>
        </div>

        {/* View Story Chain Button */}
        <button
          type="button"
          onClick={onOpenChainDrawer}
          aria-label="Open story clue chain log"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '11px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--gold-secondary)',
            background: 'rgba(229, 192, 123, 0.08)',
            border: '1px solid rgba(197, 160, 89, 0.25)',
            padding: '3px 8px',
            borderRadius: 14,
            cursor: 'pointer'
          }}
        >
          <span>Story Log</span>
          <ChevronUp size={13} />
        </button>
      </div>

      {/* Parchment Clue Scroll Container */}
      <div className="parchment-scroll" style={{ padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          {/* Riddle Text & Stop Title */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: 'var(--wax-light)',
                  backgroundColor: 'rgba(153, 27, 27, 0.2)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}
              >
                CIPHER VERSE
              </span>
              <h3
                style={{
                  fontSize: '14px',
                  margin: 0,
                  color: 'var(--text-heading)',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {activeStop.title}
              </h3>
            </div>

            {/* Metaphoric Riddle */}
            <p
              style={{
                fontStyle: 'italic',
                fontSize: '13px',
                lineHeight: 1.5,
                color: 'var(--text-parchment)',
                margin: 0,
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.01em'
              }}
            >
              “{activeStop.metaphoricRiddle}”
            </p>
          </div>

          {/* Wax Seal Badge */}
          <div style={{ flexShrink: 0, paddingTop: 2 }}>
            <WaxSeal status="active" size="md" label="SEALED" />
          </div>
        </div>

        {/* Location Hint & Target Proximity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            paddingTop: 8,
            borderTop: '1px dashed rgba(197, 160, 89, 0.2)',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34D399' }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--cipher-emerald)',
                boxShadow: '0 0 6px var(--cipher-emerald)'
              }}
            />
            <span style={{ fontWeight: 600 }}>48m away • In Geofence Zone</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold-primary)' }}>
            <Sparkles size={12} />
            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              +{activeStop.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Row: Big Thumb Check-In + Staged AI Clue Assistant */}
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Main Check-In Button (Min 48px height) */}
        <button
          type="button"
          onClick={onOpenCheckIn}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 60%, #991b1b 100%)',
            border: '1.5px solid var(--gold-primary)',
            boxShadow: '0 4px 18px rgba(153, 27, 27, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#FEF3C7',
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <MapPin size={18} />
          <span>CHECK IN AT LOCATION</span>
          <QrCode size={18} opacity={0.9} />
        </button>

        {/* Staged AI Clue Assistant Trigger (Clearly Dormant) */}
        <button
          type="button"
          onClick={() => setShowAiNotice(!showAiNotice)}
          aria-label="AI Clue Assistant (Staged)"
          title="Oracle Whisper (AI Clue Nudge)"
          style={{
            width: 50,
            height: 50,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-secondary)',
            cursor: 'pointer'
          }}
        >
          <Bot size={18} />
          <span style={{ fontSize: '8px', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: 2 }}>
            HINT
          </span>
        </button>
      </div>

      {/* Staged AI Integration Notice */}
      {showAiNotice && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            fontSize: '11px',
            color: 'var(--gold-primary)',
            lineHeight: 1.4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <strong>AI Clue Assistant (Staged):</strong> AI riddle nudges and flavor text generation are staged and deferred until Chapter Master confirmation.
          </div>
          <button
            type="button"
            onClick={() => setShowAiNotice(false)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0 4px', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
