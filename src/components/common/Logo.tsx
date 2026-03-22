import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="https://i.postimg.cc/ZK7styhM/Azure-Retreat-Logo.png" 
        alt="Clean & Care Hub Logo" 
        style={{ width: size, height: 'auto' }}
        className="object-contain"
        referrerPolicy="no-referrer"
      />
      <span className="font-display font-bold text-xl tracking-tight text-slate-900">
        Clean & Care <span className="text-brand-primary">Hub</span>
      </span>
    </div>
  );
};

export default Logo;
