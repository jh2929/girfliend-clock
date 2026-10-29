import React, { useEffect, useRef } from 'react';

interface RealisticStar {
  x: number;
  y: number;
  z: number;
  radius: number;
  baseBrightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  r: number;
  g: number;
  b: number;
  hasSpikes: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  decay: number;
  width: number;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ajuste dinámico de dimensiones
    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initRealisticCosmos();
    };

    window.addEventListener('resize', onResize);

    // Paleta espectral real (Clasificación estelar astronómica: O, B, A, F, G, K, M)
    const stellarSpectra = [
      { r: 210, g: 230, b: 255 }, // Clase O/B: Gigante azul / blanco azulado
      { r: 255, g: 255, b: 255 }, // Clase A: Blanco puro diamante
      { r: 255, g: 250, b: 240 }, // Clase F: Blanco cálido
      { r: 255, g: 240, b: 195 }, // Clase G: Amarillo solar
      { r: 255, g: 215, b: 175 }, // Clase K: Ámbar estelar
      { r: 255, g: 190, b: 195 }, // Clase M: Destello rubí suave / rosa cósmico
    ];

    const STAR_COUNT = 1400; // Densidad estelar auténtica
    let stars: RealisticStar[] = [];

    const initRealisticCosmos = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const spectrum = stellarSpectra[Math.floor(Math.random() * stellarSpectra.length)];
        
        // Distribución astronómica: mayoría son microestrellas distantes, muy pocas son brillantes
        const randMag = Math.random();
        let radius: number;
        let brightness: number;
        let hasSpikes = false;

        if (randMag > 0.985) {
          // Estrellas primarias prominentes (1.5%) con picos de difracción telescópica
          radius = Math.random() * 0.9 + 1.4;
          brightness = Math.random() * 0.3 + 0.75;
          hasSpikes = true;
        } else if (randMag > 0.82) {
          // Estrellas medianas (16.5%)
          radius = Math.random() * 0.5 + 0.9;
          brightness = Math.random() * 0.4 + 0.45;
        } else {
          // Microestrellas y polvo estelar profundo (82%)
          radius = Math.random() * 0.45 + 0.35;
          brightness = Math.random() * 0.35 + 0.15;
        }

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1.5 + 0.5,
          radius,
          baseBrightness: brightness,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          r: spectrum.r,
          g: spectrum.g,
          b: spectrum.b,
          hasSpikes
        });
      }
    };

    initRealisticCosmos();

    // Sistema de meteoros y estrellas fugaces realistas
    let meteors: Meteor[] = [];

    const spawnMeteor = () => {
      if (Math.random() < 0.012 && meteors.length < 2) {
        meteors.push({
          x: Math.random() * (width * 0.8) + width * 0.1,
          y: Math.random() * (height * 0.3),
          length: Math.random() * 140 + 90,
          speed: Math.random() * 14 + 16,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.15,
          opacity: 1,
          decay: Math.random() * 0.025 + 0.015,
          width: Math.random() * 0.8 + 1.2
        });
      }
    };

    // Parallax cósmico sutil
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - width / 2) * 0.015;
      targetY = (e.clientY - height / 2) * 0.015;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Deriva cósmica lenta (rotación celeste natural)
    const driftSpeed = 0.04;

    const render = () => {
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      // 1. Oscuridad infinita del espacio profundo
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, 0, width, height);

      // 2. Banda de Vía Láctea / Nebulosa de polvo interestelar muy tenue y realista
      const gradNebula = ctx.createLinearGradient(0, height * 0.15, width, height * 0.85);
      gradNebula.addColorStop(0, 'rgba(8, 14, 28, 0)');
      gradNebula.addColorStop(0.35, 'rgba(28, 14, 32, 0.05)');
      gradNebula.addColorStop(0.5, 'rgba(38, 16, 36, 0.08)');
      gradNebula.addColorStop(0.65, 'rgba(16, 22, 42, 0.06)');
      gradNebula.addColorStop(1, 'rgba(6, 10, 20, 0)');
      ctx.fillStyle = gradNebula;
      ctx.fillRect(0, 0, width, height);

      // Núcleo galáctico profundo difuso
      const galaxyCore = ctx.createRadialGradient(
        width * 0.55 + mouseX * 2, height * 0.45 + mouseY * 2, 20,
        width * 0.55 + mouseX * 2, height * 0.45 + mouseY * 2, Math.max(width, height) * 0.55
      );
      galaxyCore.addColorStop(0, 'rgba(255, 230, 245, 0.025)');
      galaxyCore.addColorStop(0.4, 'rgba(180, 140, 200, 0.015)');
      galaxyCore.addColorStop(1, 'transparent');
      ctx.fillStyle = galaxyCore;
      ctx.fillRect(0, 0, width, height);

      // 3. Renderizado de estrellas con óptica astronómica
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Deriva continua
        star.y -= driftSpeed * star.z;
        star.x -= driftSpeed * 0.3 * star.z;

        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }
        if (star.x < -10) {
          star.x = width + 10;
        }

        const sx = star.x + mouseX * star.z;
        const sy = star.y + mouseY * star.z;

        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;

        star.twinklePhase += star.twinkleSpeed;
        const scintillation = (Math.sin(star.twinklePhase) * 0.3 + 0.7);
        const alpha = Math.min(1, Math.max(0.08, star.baseBrightness * scintillation));

        // Punto estelar nítido
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha})`;
        ctx.fill();

        // Si es una estrella primaria brillante, dibuja picos de difracción telescópica (4 puntas Hubble)
        if (star.hasSpikes && alpha > 0.45) {
          const spikeLen = star.radius * 7 * alpha;
          const spikeAlpha = alpha * 0.35;

          ctx.strokeStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${spikeAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          // Horizontal
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          // Vertical
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();

          // Halo difuso suave alrededor de la estrella
          const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.radius * 4.5);
          halo.addColorStop(0, `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha * 0.4})`);
          halo.addColorStop(1, 'transparent');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Meteoros y trazas de ionización
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        // Estela hiperrealista con desvanecimiento
        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        meteorGrad.addColorStop(0.7, `rgba(253, 164, 175, ${m.opacity * 0.45})`);
        meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity * 0.95})`);

        ctx.save();
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Cabeza incandescente
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.restore();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= m.decay;

        if (m.opacity <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
