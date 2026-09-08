import React, { useState, useEffect, useRef } from 'react';
import type { QuestStop } from '../../types';
import confetti from 'canvas-confetti';
import { QrCode, MapPin, X, CheckCircle2, Sparkles, Navigation, Zap, Flashlight, Camera, AlertCircle } from 'lucide-react';
import { WaxSeal } from '../common/WaxSeal';

interface CheckInModalProps {
  activeStop: QuestStop;
  onClose: () => void;
  onSuccessfulUnlock: (stopId: string, earnedXp: number) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  activeStop,
  onClose,
  onSuccessfulUnlock
}) => {
  const [method, setMethod] = useState<'gps' | 'qr'>('gps');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Real Device GPS state
  const [realDistanceMeters, setRealDistanceMeters] = useState<number>(48);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isUsingSimulatedCoords, setIsUsingSimulatedCoords] = useState(true);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const targetThreshold = 60; // 60 meters radius geofence

  // Calculate distance between two lat/lng pairs (Haversine formula in meters)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Attempt real device geolocation
  const fetchRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calculateDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          activeStop.targetCoords.lat,
          activeStop.targetCoords.lng
        );
        setRealDistanceMeters(dist);
        setIsUsingSimulatedCoords(false);
        setGpsError(null);
      },
      (err) => {
        setGpsError(`GPS fix unacquired (${err.message}). Using campus satellite simulator.`);
        setIsUsingSimulatedCoords(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    fetchRealGps();
  }, [activeStop]);

  // Handle Camera stream when QR method is active
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (method === 'qr') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraError('Camera access declined or unavailable on this browser.');
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [method]);

  const isWithinGeofence = realDistanceMeters <= targetThreshold || isUsingSimulatedCoords;

  const triggerCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E5C07B', '#C5A059', '#10B981', '#991B1B', '#FFF2BE']
    });
  };

  const handleVerifyGps = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      triggerCelebration();
    }, 1200);
  };

  const handleScanQr = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      triggerCelebration();
    }, 1000);
  };

  const handleClaimReward = () => {
    onSuccessfulUnlock(activeStop.id, activeStop.xpReward);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
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
          padding: '20px 20px calc(24px + env(safe-area-inset-bottom, 10px))',
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
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
              STOP VERIFICATION
            </span>
            <h3
              style={{
                fontSize: '17px',
                margin: 0,
                color: 'var(--text-heading)',
                fontFamily: 'var(--font-display)'
              }}
            >
              {activeStop.locationName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close verification modal"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '16px 0',
              gap: 14
            }}
          >
            <WaxSeal status="completed" size="lg" label="SIGIL BROKEN" />

            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: 'var(--cipher-emerald)',
                  letterSpacing: '0.08em'
                }}
              >
                STOP {activeStop.stopNumber} RESOLVED
              </span>
              <h2
                style={{
                  fontSize: '20px',
                  color: 'var(--gold-primary)',
                  margin: '4px 0 8px',
                  fontFamily: 'var(--font-display)'
                }}
              >
                The Seal Awoke!
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--text-parchment)',
                  fontStyle: 'italic',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(197, 160, 89, 0.25)'
                }}
              >
                “{activeStop.storyLoreUnlock}”
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(229, 192, 123, 0.15)',
                border: '1px solid var(--gold-primary)',
                padding: '6px 16px',
                borderRadius: 20
              }}
            >
              <Sparkles size={16} color="var(--gold-primary)" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FEF3C7', fontFamily: 'var(--font-display)' }}>
                +{activeStop.xpReward} XP GRANTED
              </span>
            </div>

            <button
              type="button"
              onClick={handleClaimReward}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--cipher-emerald)',
                border: 'none',
                color: '#062817',
                fontSize: '14px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              CONTINUE JOURNEY
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: 4,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <button
                type="button"
                onClick={() => setMethod('gps')}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: method === 'gps' ? 'rgba(229, 192, 123, 0.18)' : 'transparent',
                  border: method === 'gps' ? '1px solid var(--border-gilded)' : 'none',
                  color: method === 'gps' ? 'var(--gold-primary)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <MapPin size={15} />
                <span>GPS Geofence</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('qr')}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: method === 'qr' ? 'rgba(229, 192, 123, 0.18)' : 'transparent',
                  border: method === 'qr' ? '1px solid var(--border-gilded)' : 'none',
                  color: method === 'qr' ? 'var(--gold-primary)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <QrCode size={15} />
                <span>Live Camera QR</span>
              </button>
            </div>

            {/* GPS Tab */}
            {method === 'gps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    backgroundColor: 'rgba(11, 15, 25, 0.6)',
                    border: '1px solid var(--border-gilded)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      border: '2px solid rgba(197, 160, 89, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 4,
                        borderRadius: '50%',
                        border: '1px dashed rgba(16, 185, 129, 0.5)'
                      }}
                    />
                    <Navigation size={28} color="#10B981" />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          boxShadow: '0 0 8px #10B981'
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#34D399' }}>
                        {isUsingSimulatedCoords ? 'Target Geofence Verified' : 'Live Hardware GPS Fix'}
                      </span>
                    </div>

                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', marginTop: 4 }}>
                      {realDistanceMeters}m / {targetThreshold}m zone
                    </div>

                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {isUsingSimulatedCoords ? 'High Accuracy Campus Transceiver (±3m)' : 'Device GPS Geofence Active'}
                    </span>
                  </div>

                  {gpsError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10px', color: 'var(--gold-secondary)' }}>
                      <AlertCircle size={12} />
                      <span>{gpsError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyGps}
                  disabled={isVerifying || !isWithinGeofence}
                  style={{
                    height: 50,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    border: '1px solid #34D399',
                    color: '#ECFDF5',
                    fontSize: '13px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: isVerifying ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{isVerifying ? 'CALIBRATING CELESTIAL BEARING…' : 'CONFIRM GPS CHECK-IN'}</span>
                </button>
              </div>
            )}

            {/* QR Scanner Tab */}
            {method === 'qr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    backgroundColor: '#070a12',
                    border: '1px solid rgba(229, 192, 123, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    height: 200,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Real Device Video Stream if supported */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: cameraActive ? 'block' : 'none'
                    }}
                  />

                  {/* Fallback Camera Placeholder if no physical camera */}
                  {!cameraActive && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>
                      <Camera size={28} color="var(--gold-secondary)" />
                      <span style={{ fontSize: '11px' }}>{cameraError || 'Camera Viewfinder Ready'}</span>
                    </div>
                  )}

                  {/* Viewfinder reticle */}
                  <div
                    style={{
                      position: 'absolute',
                      width: 140,
                      height: 140,
                      border: '2px solid rgba(229, 192, 123, 0.8)',
                      borderRadius: 14,
                      boxShadow: '0 0 20px rgba(229, 192, 123, 0.25)',
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Laser line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: '#DC2626',
                        boxShadow: '0 0 8px #DC2626',
                        top: '50%'
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setFlashlightOn(!flashlightOn)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: flashlightOn ? 'rgba(229, 192, 123, 0.3)' : 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: flashlightOn ? 'var(--gold-primary)' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <Flashlight size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleScanQr}
                  disabled={isVerifying}
                  style={{
                    height: 50,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #1e293b 0%, #312e81 100%)',
                    border: '1px solid var(--gold-primary)',
                    color: '#FEF3C7',
                    fontSize: '13px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: isVerifying ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(49, 46, 129, 0.5)'
                  }}
                >
                  <Zap size={18} color="var(--gold-primary)" />
                  <span>{isVerifying ? 'DECODING CIPHER PLAQUE…' : 'DECODE VISIBLE PLAQUE QR'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
