import React from 'react';
import { TooltipPosition } from '../../interfaces/interfaces';

// Get tooltip position based on mouse position and tooltip position setting
export const getTooltipPositionStyle = (
  xPos: number,
  yPos: number,
  tooltipPosition: TooltipPosition,
  containerWidth?: number,
  containerHeight?: number,
  nodeDimensions?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    width: number;
    height: number;
  }
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
  
  // Container dimensions with defaults if not provided
  const safeContainerWidth = containerWidth || 300;
  const safeContainerHeight = containerHeight || 300;
  
  // Adjust based on tooltip position preference
  switch (tooltipPosition) {
    // Mouse-following positions
    case 'mouseRight':
      position = { left: xPos + OFFSET_X, top: yPos };
      break;
    case 'mouseBottom':
      position = { left: xPos - (TOOLTIP_WIDTH / 2), top: yPos + OFFSET_Y };
      break;
    case 'mouseTop':
      position = { left: xPos + OFFSET_X, top: yPos - TOOLTIP_HEIGHT - OFFSET_Y };
      break;
      
    // Fixed positions relative to container
    case 'fixedTopLeft':
      position = { left: OFFSET_X, top: OFFSET_Y };
      break;
    case 'fixedTopRight':
      position = { left: safeContainerWidth - TOOLTIP_WIDTH - OFFSET_X, top: OFFSET_Y };
      break;
    case 'fixedBottomLeft':
      position = { left: OFFSET_X, top: safeContainerHeight - TOOLTIP_HEIGHT - OFFSET_Y };
      break;
    case 'fixedBottomRight':
      position = { 
        left: safeContainerWidth - TOOLTIP_WIDTH - OFFSET_X, 
        top: safeContainerHeight - TOOLTIP_HEIGHT - OFFSET_Y 
      };
      break;
    case 'fixedTopCenter':
      position = { 
        left: (safeContainerWidth - TOOLTIP_WIDTH) / 2, 
        top: OFFSET_Y 
      };
      break;
    case 'fixedBottomCenter':
      position = { 
        left: (safeContainerWidth - TOOLTIP_WIDTH) / 2, 
        top: safeContainerHeight - TOOLTIP_HEIGHT - OFFSET_Y 
      };
      break;
      
    // Node-relative positions - requires nodeDimensions
    case 'nodeTopLeft':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x0, 
          top: nodeDimensions.y0 - TOOLTIP_HEIGHT - OFFSET_Y 
        };
      }
      break;
    case 'nodeTopRight':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x1 - TOOLTIP_WIDTH, 
          top: nodeDimensions.y0 - TOOLTIP_HEIGHT - OFFSET_Y 
        };
      }
      break;
    case 'nodeBottomLeft':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x0, 
          top: nodeDimensions.y1 + OFFSET_Y 
        };
      }
      break;
    case 'nodeBottomRight':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x1 - TOOLTIP_WIDTH, 
          top: nodeDimensions.y1 + OFFSET_Y 
        };
      }
      break;
    case 'nodeTopCenter':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x0 + (nodeDimensions.width / 2) - (TOOLTIP_WIDTH / 2), 
          top: nodeDimensions.y0 - TOOLTIP_HEIGHT - OFFSET_Y 
        };
      }
      break;
    case 'nodeBottomCenter':
      if (nodeDimensions) {
        position = { 
          left: nodeDimensions.x0 + (nodeDimensions.width / 2) - (TOOLTIP_WIDTH / 2), 
          top: nodeDimensions.y1 + OFFSET_Y 
        };
      }
      break;
    default:
      position = { left: xPos + OFFSET_X, top: yPos };
  }
  
  // Only apply boundary adjustments for mouse-following and node-relative tooltips
  if (containerWidth && containerHeight && 
      (!tooltipPosition.startsWith('fixed'))) {
    // Adjust horizontal position if needed
    if (position.left + TOOLTIP_WIDTH > containerWidth) {
      position.left = Math.max(0, position.left - TOOLTIP_WIDTH - (2 * OFFSET_X));
      
      // If still outside, just align to right edge with some padding
      if (position.left + TOOLTIP_WIDTH > containerWidth) {
        position.left = Math.max(0, containerWidth - TOOLTIP_WIDTH - OFFSET_X);
      }
    }
    
    // Ensure tooltip doesn't go off left edge
    if (position.left < 0) {
      position.left = OFFSET_X;
    }
    
    // Adjust vertical position if needed
    if (position.top + TOOLTIP_HEIGHT > containerHeight) {
      position.top = Math.max(0, position.top - TOOLTIP_HEIGHT - (2 * OFFSET_Y));
      
      // If still outside, just align to bottom edge with some padding
      if (position.top + TOOLTIP_HEIGHT > containerHeight) {
        position.top = Math.max(0, containerHeight - TOOLTIP_HEIGHT - OFFSET_Y);
      }
    }
    
    // Ensure tooltip doesn't go off top edge
    if (position.top < 0) {
      position.top = OFFSET_Y;
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