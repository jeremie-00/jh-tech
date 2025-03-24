"use client";
import { useEffect, useRef, useState } from "react";

const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.replace(/%/g, "").split(" ").map(Number);

  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  const f = (n: number) => {
    const k = (n + hue * 12) % 12;
    const a = sat * Math.min(light, 1 - light);
    const color = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

const MatrixEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colsRef = useRef<number>(0);
  const yposRef = useRef<number[]>([]);
  const [hexColorText, setHexColorText] = useState("#0f0"); // Couleur par défaut

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updatePrimaryColor = () => {
      const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      setHexColorText(hslToHex(textColor));
    };

    // Écoute les changements de thème
    const observer = new MutationObserver(updatePrimaryColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    updatePrimaryColor(); // Récupération initiale

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      colsRef.current = Math.floor(canvas.width / 20) + 1;
      yposRef.current = Array(colsRef.current).fill(0);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initialisation

    const matrix = () => {
      ctx.fillStyle = "#0002";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = hexColorText;
      ctx.font = "15pt monospace";

      yposRef.current.forEach((y, ind) => {
        const text = String.fromCharCode(33 + Math.random() * 94); // Caractères ASCII visibles
        const x = ind * 20;
        ctx.fillText(text, x, y);

        if (y > canvas.height * 0.75 + Math.random() * 10000)
          yposRef.current[ind] = 0;
        else yposRef.current[ind] = y + 20;
      });
    };

    const intervalId = setInterval(matrix, 50);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resizeCanvas);
      observer.disconnect();
    };
  }, [hexColorText]);

  return (
    <div className="absolute w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
export default MatrixEffect;
