import React from 'react';
import { TooltipPosition } from '../../interfaces/interfaces';

// Get tooltip position based on mouse position and tooltip position setting
export const getTooltipPositionStyle = (
  xPos: number,
  yPos: number,
  tooltipPosition: TooltipPosition
): { left: number; top: number } => {
  const positions = {
    mouseRight: {
      left: xPos + 10,
      top: yPos + 0,
    },
    mouseBottom: {
      left: xPos - 100,
      top: yPos + 20,
    },
    mouseTop: {
      left: xPos + 10,
      top: yPos - 100,
    },
  };
  
  return positions[tooltipPosition];
};

// Base tooltip styles
export const getTooltipStyle = (
  position: { left: number; top: number },
  customStyle?: React.CSSProperties
): React.CSSProperties => ({
  position: "absolute",
  left: position.left,
  top: position.top,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  pointerEvents: "none", // Prevents interfering with mouse events
  zIndex: 999,
  whiteSpace: "nowrap",
  ...customStyle,
});

// Custom data pre styles
export const customDataPreStyle: React.CSSProperties = {
  margin: "0", 
  whiteSpace: "pre-wrap"
}; 