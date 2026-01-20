'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  onDraw: () => void;
  disabled?: boolean;
}

export default function DrawingCanvas({ onDraw, disabled = false }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  const sizes = [3, 5, 8, 12, 20];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    lastPosRef.current = pos;
  }, [disabled, getPosition]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPosRef.current) return;

    const pos = getPosition(e);

    ctx.beginPath();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
    onDraw();
  }, [isDrawing, disabled, brushColor, brushSize, getPosition, onDraw]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-gray-100 rounded-lg">
        {/* Colors */}
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setBrushColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                brushColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              disabled={disabled}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300" />

        {/* Brush Sizes */}
        <div className="flex items-center gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`flex items-center justify-center w-8 h-8 rounded border transition-colors ${
                brushSize === size
                  ? 'bg-blue-500 border-blue-600'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
              disabled={disabled}
            >
              <div
                className="rounded-full bg-black"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300" />

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          disabled={disabled}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className={`border-2 border-gray-300 rounded-lg bg-white shadow-lg touch-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
