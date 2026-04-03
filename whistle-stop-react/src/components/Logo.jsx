function Logo({ className = '' }) {
  return (
    <div className={`logo-container flex flex-col items-center text-[#1a1a1a] text-center leading-[0.9] ${className}`}>
      <style>{`
        .logo-container {
          font-family: 'Oswald', sans-serif;
          line-height: 0.9;
        }
        .logo-the {
          font-size: 0.4em;
          letter-spacing: 0.07em;
          margin-bottom: 0.04em;
          font-weight: 700;
        }
        .logo-whistle-row {
          display: flex;
          align-items: center;
          font-size: 1em;
          letter-spacing: -0.01em;
          font-weight: 700;
        }
        .logo-barber-pole {
          width: 0.35em;
          height: 1.1em;
          border: 0.03em solid #1a1a1a;
          border-radius: 0.4em;
          margin: 0 0.06em;
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.15);
          box-shadow: inset 0.04em 0 0.08em rgba(0,0,0,0.1);
          z-index: 1;
          flex-shrink: 0;
        }
        .logo-stripes {
          position: absolute;
          top: -200px;
          left: -25%;
          width: 150%;
          height: 400%;
          background: repeating-linear-gradient(
            -45deg,
            #dc2626,
            #dc2626 20px,
            rgba(255,255,255,0.6) 20px,
            rgba(255,255,255,0.6) 40px
          );
          animation: logoMoveStripes 3s linear infinite;
        }
        @keyframes logoMoveStripes {
          from { transform: translateY(0); }
          to { transform: translateY(56px); }
        }
        .logo-barber-pole::before,
        .logo-barber-pole::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 14px;
          background: linear-gradient(to right, #666 0%, #eee 45%, #fff 55%, #666 100%);
          z-index: 5;
        }
        .logo-barber-pole::before {
          top: 0;
          border-radius: 20px 20px 0 0;
        }
        .logo-barber-pole::after {
          bottom: 0;
          border-radius: 0 0 20px 20px;
        }
        .logo-glass-shine {
          position: absolute;
          top: 0; left: 15%; width: 20%; height: 100%;
          background: rgba(255,255,255,0.3);
          z-index: 4;
          pointer-events: none;
        }
        .logo-stop-text {
          font-size: 1.2em;
          letter-spacing: 0.02em;
          margin-top: -0.04em;
          font-weight: 700;
        }
      `}</style>

      <div className="logo-the" style={{ fontSize: '0.4em', letterSpacing: '0.07em', marginBottom: '0.04em', fontWeight: 700 }}>THE</div>
      <div className="logo-whistle-row" style={{ display: 'flex', alignItems: 'center', fontSize: '1em', letterSpacing: '-0.01em', fontWeight: 700 }}>
        <span>WH</span>
        <div className="logo-barber-pole" style={{ width: '0.35em', height: '1.1em', border: '0.03em solid #1a1a1a', borderRadius: '0.4em', margin: '0 0.06em', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.15)', boxShadow: 'inset 0.04em 0 0.08em rgba(0,0,0,0.1)', zIndex: 1, flexShrink: 0 }}>
          <div className="logo-stripes" />
          <div className="logo-glass-shine" />
        </div>
        <span>STLE</span>
      </div>
      <div className="logo-stop-text" style={{ fontSize: '1.2em', letterSpacing: '0.02em', marginTop: '-0.04em', fontWeight: 700 }}>STOP</div>
    </div>
  );
}

export default Logo;
