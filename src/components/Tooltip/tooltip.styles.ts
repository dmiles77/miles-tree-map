import React from 'react';
import { TooltipPosition } from '../../interfaces/interfaces';

// Get tooltip position based on mouse position and tooltip position setting
export const getTooltipPositionStyle = (
  xPos: number,
  yPos: number,
  tooltipPosition: TooltipPosition,
  containerWidth?: number,
  containerHeight?: number
): { left: number; top: number } => {
  // Default offsets
  const OFFSET_X = 10;
  const OFFSET_Y = 10;
  const TOOLTIP_WIDTH = 200; // Approximate width
  const TOOLTIP_HEIGHT = 100; // Approximate height
  
  // Base positions
  let position = {
    left: xPos + OFFSET_X,
    top: yPos
  };
  
  // Adjust based on tooltip position preference
  switch (tooltipPosition) {
    case 'mouseRight':
      position = { left: xPos + OFFSET_X, top: yPos };
      break;
    case 'mouseBottom':
      position = { left: xPos - (TOOLTIP_WIDTH / 2), top: yPos + OFFSET_Y };
      break;
    case 'mouseTop':
      position = { left: xPos + OFFSET_X, top: yPos - TOOLTIP_HEIGHT - OFFSET_Y };
      break;
    default:
      position = { left: xPos + OFFSET_X, top: yPos };
  }
  
  // Ensure tooltip doesn't go outside container bounds
  if (containerWidth && containerHeight) {
    // Adjust horizontal position if needed
    if (position.left + TOOLTIP_WIDTH > containerWidth) {
      position.left = Math.max(0, xPos - TOOLTIP_WIDTH - OFFSET_X);
    }
    
    // Adjust vertical position if needed
    if (position.top + TOOLTIP_HEIGHT > containerHeight) {
      position.top = Math.max(0, yPos - TOOLTIP_HEIGHT - OFFSET_Y);
    }
  }
  
  return position;
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