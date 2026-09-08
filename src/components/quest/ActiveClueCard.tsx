import React from 'react';
import type { QuestStop } from '../../types';
import { WaxSeal } from '../common/WaxSeal';
import { QrCode, MapPin, ChevronUp, Sparkles, Feather, Clock } from 'lucide-react';

interface ActiveClueCardProps {
  questTitle?: string;
  episode?: string;
  activeStop?: QuestStop | null;
  currentStopIndex?: number;
  totalStops?: number;
  onOpenCheckIn: () => void;
  onOpenChainDrawer: () => void;
  onOpenAdmin?: () => void;
}

export const ActiveClueCard: React.FC<ActiveClueCardProps> = ({
  questTitle,
  episode,
  activeStop,
  currentStopIndex = 0,
  totalStops = 0,
  onOpenCheckIn,
  onOpenChainDrawer,
  onOpenAdmin
}) => {
  // Case: No active quest is posted yet on campus (Zero-Data State)
  if (!activeStop) {
    return (
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-gilded)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.7)',
          padding: '20px 20px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
          zIndex: 25,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <WaxSeal status="locked" size="md" label="SEALED" />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--gold-secondary)',
                letterSpacing: '0.08em'
              }}
            >
              CAMPUS SLEEPS • NO ACTIVE QUEST
            </span>
            <h3
              style={{
                fontSize: '15px',
                margin: '2px 0 0',
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)'
              }}
            >
              The Bell is Silent
            </h3>
          </div>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-sub)',
            margin: 0,
            lineHeight: 1.5,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic'
          }}
        >
          “No weekly riddle chain has been inscribed upon the university arches yet. The Society Grandmaster is preparing the next chapter.”
        </p>

        {onOpenAdmin ? (
          <button
            type="button"
            onClick={onOpenAdmin}
            style={{
              marginTop: 4,
              height: 44,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #c5a059 0%, #e5c07b 50%, #8c6e30 100%)',
              border: 'none',
              color: '#070a10',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(229, 192, 123, 0.35)'
            }}
          >
            <Feather size={15} />
            <span>POST FIRST STORY QUEST (ADMIN STUDIO)</span>
          </button>
        ) : (
          <div
            style={{
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(229, 192, 123, 0.2)',
              color: 'var(--gold-secondary)',
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}
          >
            <Clock size={13} />
            <span>Awaiting Next Chronicle Drop</span>
          </div>
        )}
      </div>
    );
  }

  // Active Clue Parchment (Clean, Decluttered, High Breathing Room)
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(11, 15, 25, 0.95)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--border-gilded)',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.7)',
        padding: '16px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        zIndex: 25,
        userSelect: 'none'
      }}
    >
      {/* Top Header: Episode & Story Log Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            {episode || 'Chapter I'} • {questTitle || 'Campus Quest'}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>•</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Stop {currentStopIndex + 1} of {totalStops}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenChainDrawer}
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

      {/* Clue Parchment Text */}
      <div className="parchment-scroll" style={{ padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '14px',
                margin: '0 0 6px',
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)'
              }}
            >
              {activeStop.title}
            </h3>

            <p
              style={{
                fontStyle: 'italic',
                fontSize: '13px',
                lineHeight: 1.5,
                color: 'var(--text-parchment)',
                margin: 0,
                fontFamily: 'Georgia, serif'
              }}
            >
              “{activeStop.metaphoricRiddle}”
            </p>
          </div>

          <div style={{ flexShrink: 0, paddingTop: 2 }}>
            <WaxSeal status="active" size="md" label="SEALED" />
          </div>
        </div>

        {/* Proximity Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
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
            <span style={{ fontWeight: 600 }}>Within Field Range</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold-primary)' }}>
            <Sparkles size={12} />
            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              +{activeStop.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Main Check-In Button */}
      <button
        type="button"
        onClick={onOpenCheckIn}
        style={{
          width: '100%',
          height: 48,
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
          cursor: 'pointer'
        }}
      >
        <MapPin size={18} />
        <span>CHECK IN AT LOCATION</span>
        <QrCode size={18} opacity={0.9} />
      </button>
    </div>
  );
};
