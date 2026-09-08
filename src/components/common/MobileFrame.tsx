import React, { useState } from 'react';
import { Smartphone, Maximize2, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFramed, setIsFramed] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#04070c',
        backgroundImage: `
          radial-gradient(circle at 50% 10%, rgba(26, 38, 64, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 10% 90%, rgba(197, 160, 89, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.04) 0%, transparent 40%)
        `,
        padding: isFramed ? '24px 16px' : '0',
        transition: 'padding 0.3s ease'
      }}
    >
      {/* Desktop Mode Switcher Bar */}
      <div
        style={{
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          zIndex: 50,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          padding: '6px 14px',
          borderRadius: 30,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--gold-primary)',
              letterSpacing: '0.06em'
            }}
          >
            SIDEQUEST SOCIETY • PREVIEW
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFramed(!isFramed)}
          aria-label={isFramed ? 'Switch to fluid responsive view' : 'Switch to mobile device frame'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            color: '#E2E8F0',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: 16,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          {isFramed ? (
            <>
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone size={13} />
              <span>Mobile Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      <div
        style={{
          width: '100%',
          maxWidth: isFramed ? '420px' : '640px',
          height: isFramed ? '880px' : '100vh',
          maxHeight: isFramed ? '880px' : '100vh',
          borderRadius: isFramed ? '48px' : '0',
          border: isFramed ? '8px solid #1e293b' : 'none',
          boxShadow: isFramed
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(197, 160, 89, 0.35), inset 0 0 0 2px #0f172a'
            : 'none',
          backgroundColor: 'var(--bg-abyss)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'max-width 0.3s ease, height 0.3s ease, border-radius 0.3s ease'
        }}
      >
        {/* iOS Dynamic Island & Status Bar (in framed mode) */}
        {isFramed && (
          <div
            style={{
              height: 44,
              width: '100%',
              backgroundColor: 'var(--bg-abyss)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#F1F5F9',
              zIndex: 40,
              position: 'relative',
              userSelect: 'none'
            }}
          >
            <span>9:41</span>

            {/* Dynamic Island pill */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 108,
                height: 28,
                borderRadius: 20,
                backgroundColor: '#000',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '0 8px'
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981'
                }}
              />
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-display)', color: 'var(--gold-primary)', letterSpacing: '0.04em' }}>
                SIDEQ
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={14} />
            </div>
          </div>
        )}

        {/* Inner App Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {children}
        </div>

        {/* Home Indicator bar on framed mode */}
        {isFramed && (
          <div
            style={{
              height: 18,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-abyss)',
              position: 'relative',
              zIndex: 40
            }}
          >
            <div
              style={{
                width: 120,
                height: 4,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.25)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
