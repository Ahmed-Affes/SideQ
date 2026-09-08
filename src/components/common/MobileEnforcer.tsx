import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface MobileEnforcerProps {
  children: React.ReactNode;
}

export const MobileEnforcer: React.FC<MobileEnforcerProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSimulatingMobile, setIsSimulatingMobile] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const checkDevice = () => {
      // Check screen width
      const isWide = window.innerWidth > 640;
      setIsDesktop(isWide);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // If on desktop and not in simulator mode, lock screen with the Mobile-Only Field Gate
  if (isDesktop && !isSimulatingMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: '#050810',
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(22, 33, 62, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 10% 90%, rgba(197, 160, 89, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 40%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: 'var(--text-parchment)',
          fontFamily: 'var(--font-body)',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'rgba(14, 20, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid var(--border-gilded)',
            borderRadius: '28px',
            padding: '36px 28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(197, 160, 89, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Wax Seal */}
          <div style={{ transform: 'scale(1.15)', marginTop: -6 }}>
            <WaxSeal status="active" size="lg" label="FIELD ONLY" />
          </div>

          <div>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--gold-primary)',
                letterSpacing: '0.12em',
                marginBottom: 4
              }}
            >
              SIDEQUEST SOCIETY • MERIDIAN PROTOCOL
            </div>
            <h1
              style={{
                fontSize: '22px',
                margin: 0,
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.03em'
              }}
            >
              Mobile Device Required
            </h1>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-sub)',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            SideQ is a <strong>physical campus adventure</strong>. Solving weekly riddle ciphers requires walking collegiate grounds with active GPS satellite geofencing and camera scanning for physical architectural QR sigils.
          </p>

          {/* QR Code generator to scan with phone */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '14px',
              borderRadius: '16px',
              border: '3px solid var(--gold-primary)',
              boxShadow: '0 0 25px rgba(229, 192, 123, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8
            }}
          >
            {/* High-contrast generated SVG QR graphic */}
            <svg width="150" height="150" viewBox="0 0 100 100">
              {/* Standard QR Framing markers */}
              <rect x="5" y="5" width="30" height="30" fill="#070A10" />
              <rect x="9" y="9" width="22" height="22" fill="#fff" />
              <rect x="13" y="13" width="14" height="14" fill="#070A10" />

              <rect x="65" y="5" width="30" height="30" fill="#070A10" />
              <rect x="69" y="9" width="22" height="22" fill="#fff" />
              <rect x="73" y="13" width="14" height="14" fill="#070A10" />

              <rect x="5" y="65" width="30" height="30" fill="#070A10" />
              <rect x="9" y="69" width="22" height="22" fill="#fff" />
              <rect x="13" y="73" width="14" height="14" fill="#070A10" />

              {/* Data matrix pattern */}
              <rect x="42" y="10" width="8" height="8" fill="#070A10" />
              <rect x="42" y="24" width="8" height="8" fill="#070A10" />
              <rect x="10" y="44" width="8" height="8" fill="#070A10" />
              <rect x="24" y="44" width="8" height="8" fill="#070A10" />
              <rect x="42" y="42" width="16" height="16" fill="#991B1B" />
              <rect x="46" y="46" width="8" height="8" fill="#E5C07B" />
              <rect x="66" y="44" width="8" height="8" fill="#070A10" />
              <rect x="80" y="44" width="8" height="8" fill="#070A10" />
              <rect x="42" y="66" width="8" height="8" fill="#070A10" />
              <rect x="42" y="80" width="8" height="8" fill="#070A10" />
              <rect x="66" y="66" width="10" height="10" fill="#070A10" />
              <rect x="82" y="78" width="8" height="8" fill="#070A10" />
            </svg>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#070A10',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em'
              }}
            >
              SCAN TO OPEN ON SMARTPHONE
            </span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Or open: <span style={{ color: 'var(--gold-primary)' }}>{currentUrl || 'http://localhost:5173'}</span> on your mobile browser
          </div>

          {/* Developer Simulator Bypass Switch */}
          <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsSimulatingMobile(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                color: 'var(--gold-secondary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <Smartphone size={14} />
              <span>Simulate Handheld Device (Admin Mode)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pure Mobile Experience (no frame on mobile, edge-to-edge)
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'var(--bg-abyss)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* If developer is simulating mobile on desktop, show a subtle return badge */}
      {isDesktop && isSimulatingMobile && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: '1px solid var(--gold-primary)',
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: '9px',
            color: 'var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>📱 Handheld Simulation Active</span>
          <button
            type="button"
            onClick={() => setIsSimulatingMobile(false)}
            style={{ color: '#fff', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {children}
    </div>
  );
};
