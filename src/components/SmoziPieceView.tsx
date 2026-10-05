import React from 'react';
import { Piece } from '../models/Piece.ts';
import { SmoziBlockView } from './SmoziBlockView.tsx';

interface SmoziPieceViewProps {
  piece: Piece;
  blockSize?: number | string;
  isDragging?: boolean;
  isDenied?: boolean;
  className?: string;
}

export const SmoziPieceView: React.FC<SmoziPieceViewProps> = ({
  piece,
  blockSize = 28,
  isDragging = false,
  isDenied = false,
  className = ''
}) => {
  const matrix = piece.shape.matrix;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center transition-transform select-none ${
        isDragging ? 'scale-105 filter drop-shadow-2xl' : ''
      } ${isDenied ? 'animate-denied' : ''} ${className}`}
    >
      {matrix.map((row, rIdx) => (
        <div key={rIdx} className="flex">
          {row.map((cellFilled, cIdx) => (
            <div
              key={cIdx}
              style={{
                width: blockSize,
                height: blockSize,
                padding: '1.5px'
              }}
            >
              {cellFilled ? (
                <SmoziBlockView
                  color={piece.color}
                  specialType={piece.specialType}
                  isDenied={isDenied}
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
