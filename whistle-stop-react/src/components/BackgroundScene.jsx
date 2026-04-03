import { useState, useEffect } from 'react';

function BackgroundScene({ bgImages }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % bgImages.length), 5000);
    return () => clearInterval(t);
  }, [bgImages.length]);
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {bgImages.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms]" style={{ backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === current ? 0.85 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-whistle-black/40 via-whistle-black/20 to-whistle-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.3)_100%)]" />
    </div>
  );
}

export default BackgroundScene;
