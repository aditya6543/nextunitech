import React, { useRef, useEffect } from 'react';

class Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.radius = Math.random() * 1.5;
    this.color = 'rgba(255, 255, 255, 0.8)';
    this.speed = Math.random() * 0.3;
    this.opacity = Math.random() * 0.8 + 0.2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.closePath();
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speed;
    if (this.x > canvasWidth) {
      this.x = 0;
    }
  }
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate stars when canvas is resized
      starsRef.current = Array.from({ length: 200 }, () => new Star(canvas.width, canvas.height));
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#120224');
      gradient.addColorStop(0.5, '#1e0a3c');
      gradient.addColorStop(1, '#2b1257');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      starsRef.current.forEach(star => {
        star.draw(ctx);
        star.update(canvas.width, canvas.height);
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="starry-bg fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
    />
  );
};

export default AnimatedBackground;
