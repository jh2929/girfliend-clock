import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  targetYear: number;
}

function getInitialTime(): TimeLeft {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 11, 24, 0, 0, 0, 0);

  if (now.getTime() >= target.getTime()) {
    target = new Date(year + 1, 11, 24, 0, 0, 0, 0);
    year = year + 1;
  }

  const totalDiff = target.getTime() - now.getTime();
  if (totalDiff <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true, targetYear: year };
  }

  let months = 0;
  let cursor = new Date(now.getTime());
  while (true) {
    const nextMonth = new Date(cursor.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth.getTime() <= target.getTime()) {
      months++;
      cursor = nextMonth;
    } else {
      break;
    }
  }

  let diff = target.getTime() - cursor.getTime();
  const msDay = 86400000;
  const msHour = 3600000;
  const msMinute = 60000;
  const msSecond = 1000;

  const days = Math.floor(diff / msDay);
  diff -= days * msDay;
  const hours = Math.floor(diff / msHour);
  diff -= hours * msHour;
  const minutes = Math.floor(diff / msMinute);
  diff -= minutes * msMinute;
  const seconds = Math.floor(diff / msSecond);

  return { months, days, hours, minutes, seconds, isComplete: false, targetYear: year };
}

export const HorizontalCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getInitialTime);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let year = now.getFullYear();
      let target = new Date(year, 11, 24, 0, 0, 0, 0); // 24 de Diciembre

      if (now.getTime() >= target.getTime()) {
        target = new Date(year + 1, 11, 24, 0, 0, 0, 0);
        year = year + 1;
      }

      const totalDiff = target.getTime() - now.getTime();

      if (totalDiff <= 0) {
        setTimeLeft({
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
          targetYear: year
        });
        return;
      }

      // Desglose de meses calendario
      let months = 0;
      let cursor = new Date(now.getTime());

      while (true) {
        const nextMonth = new Date(cursor.getTime());
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (nextMonth.getTime() <= target.getTime()) {
          months++;
          cursor = nextMonth;
        } else {
          break;
        }
      }

      let diff = target.getTime() - cursor.getTime();

      const msDay = 86400000;
      const msHour = 3600000;
      const msMinute = 60000;
      const msSecond = 1000;

      const days = Math.floor(diff / msDay);
      diff -= days * msDay;

      const hours = Math.floor(diff / msHour);
      diff -= hours * msHour;

      const minutes = Math.floor(diff / msMinute);
      diff -= minutes * msMinute;

      const seconds = Math.floor(diff / msSecond);

      setTimeLeft({
        months,
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
        targetYear: year
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 100);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center justify-center select-none">

      {/* Título Principal */}
      <header className="mb-8 md:mb-10 max-w-3xl">
        <p className="font-text text-2xl sm:text-3xl md:text-4xl text-slate-200/95 font-medium tracking-wide text-glow-celestial mb-2">
          esperando el dia mas importante para mi
        </p>

        <h1 className="font-text text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white flex items-center justify-center gap-3.5 my-1">
          <span className="bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(244,114,182,0.45)]">
            te amo
          </span>
          <span className="inline-flex items-center justify-center animate-heart-pulse">
            <Heart className="w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 text-rose-500 fill-rose-500 text-glow-heart" />
          </span>
        </h1>

        <p className="font-text text-base sm:text-lg text-slate-300/80 font-normal max-w-md mx-auto mt-2">
          24 de diciembre • Cada segundo cuenta
        </p>
      </header>

      {/* Contenedor del Contador en Línea Horizontal */}
      <section 
        className="w-full bg-slate-950/40 border border-slate-800/60 hover:border-pink-500/25 transition-all duration-700 rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-xl box-glow-cosmic relative overflow-hidden"
        aria-label="Contador regresivo horizontal"
      >
        {/* Sutil resplandor estelar interior */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-rose-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Fila Horizontal Continua */}
        <div className="flex items-center justify-center sm:justify-between max-w-4xl mx-auto gap-2 sm:gap-4 md:gap-6 flex-wrap sm:flex-nowrap">

          {/* MESES */}
          <div className="flex-1 min-w-[65px] sm:min-w-0 flex flex-col items-center group">
            <span className="font-num text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 group-hover:text-rose-200 transition-colors">
              {pad(timeLeft.months)}
            </span>
            <span className="font-text mt-2 text-sm sm:text-base text-slate-300 font-semibold">
              Meses
            </span>
          </div>

          {/* Separador estelar */}
          <div className="hidden sm:flex flex-col items-center justify-center text-slate-700 select-none pb-5">
            <span className="text-xs text-rose-400/35">✦</span>
          </div>

          {/* DÍAS */}
          <div className="flex-1 min-w-[65px] sm:min-w-0 flex flex-col items-center group">
            <span className="font-num text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 group-hover:text-rose-200 transition-colors">
              {pad(timeLeft.days)}
            </span>
            <span className="font-text mt-2 text-sm sm:text-base text-slate-300 font-semibold">
              Días
            </span>
          </div>

          {/* Separador estelar */}
          <div className="hidden sm:flex flex-col items-center justify-center text-slate-700 select-none pb-5">
            <span className="text-xs text-rose-400/35">✦</span>
          </div>

          {/* HORAS */}
          <div className="flex-1 min-w-[65px] sm:min-w-0 flex flex-col items-center group">
            <span className="font-num text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 group-hover:text-rose-200 transition-colors">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-text mt-2 text-sm sm:text-base text-slate-300 font-semibold">
              Horas
            </span>
          </div>

          {/* Separador estelar */}
          <div className="hidden sm:flex flex-col items-center justify-center text-slate-700 select-none pb-5">
            <span className="text-xs text-rose-400/35">✦</span>
          </div>

          {/* MINUTOS */}
          <div className="flex-1 min-w-[65px] sm:min-w-0 flex flex-col items-center group">
            <span className="font-num text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 group-hover:text-rose-200 transition-colors">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-text mt-2 text-sm sm:text-base text-slate-300 font-semibold">
              Minutos
            </span>
          </div>

          {/* Separador estelar */}
          <div className="hidden sm:flex flex-col items-center justify-center text-slate-700 select-none pb-5">
            <span className="text-xs text-rose-400/35">✦</span>
          </div>

          {/* SEGUNDOS */}
          <div className="flex-1 min-w-[65px] sm:min-w-0 flex flex-col items-center group">
            <span className="font-num text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-rose-200 group-hover:text-rose-100 transition-colors drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-text mt-2 text-sm sm:text-base text-rose-300 font-semibold">
              Segundos
            </span>
          </div>

        </div>

      </section>

      {/* Frase Cósmica de Cierre */}
      <footer className="mt-6 md:mt-8">
        <p className="font-text text-xl sm:text-2xl text-slate-300 tracking-wide">
          "Hasta las estrellas más lejanas brillan por ti"
        </p>
      </footer>

    </div>
  );
};
