import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface DemoSessionTimerProps {
  expiryTime: number;
}

export function DemoSessionTimer({ expiryTime }: DemoSessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiryTime - now);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isLowTime = minutes < 5;
  const isVeryLowTime = minutes < 2;

  if (timeLeft === 0) {
    return null;
  }

  return (
    <Badge 
      className={`
        flex items-center gap-2 px-3 py-1.5 transition-all duration-300
        ${isVeryLowTime 
          ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
          : isLowTime 
          ? 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30' 
          : 'bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20'
        }
      `}
    >
      {isLowTime ? (
        <AlertCircle className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      <span className="text-xs font-medium">
        Demo: {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </Badge>
  );
}
