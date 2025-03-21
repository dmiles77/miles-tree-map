import React from 'react';
import { XYPosition } from '../../interfaces/interfaces';

// Container Styles
export const containerStyles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
};

// Breadcrumbs Container Styles
export const getBreadcrumbsContainerStyles = (paddingOuter: number): React.CSSProperties => ({
  position: "absolute",
  top: 0,
  left: paddingOuter,
  right: paddingOuter,
  zIndex: 300,
  padding: "8px 0",
  height: "auto",
});

// TreeMap Content Container Styles
export const getTreeMapContentStyles = (
  breadcrumbEnabled: boolean, 
  breadcrumbsHeight: number
): React.CSSProperties => ({
  position: "absolute",
  top: breadcrumbEnabled ? breadcrumbsHeight : 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "hidden",
});

// Node Styles
export const getStaticNodeStyle = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colorResult: { backgroundColor: string; borderColor?: string; borderWidth?: number } | string,
  borderRadius: number
): React.CSSProperties => {
  // Only replace with 0 if the value is NaN or undefined, otherwise keep the original value
  const safeX0 = isNaN(x0) ? 0 : Math.floor(x0); // Floor for integer pixels
  const safeY0 = isNaN(y0) ? 0 : Math.floor(y0);
  const safeX1 = isNaN(x1) ? 0 : Math.ceil(x1); // Ceiling for integer pixels
  const safeY1 = isNaN(y1) ? 0 : Math.ceil(y1);
  
  // Ensure width and height are non-negative
  const width = Math.max(0, safeX1 - safeX0);
  const height = Math.max(0, safeY1 - safeY0);
  
  // Handle both string (backward compatibility) and object color result
  let backgroundColor = 'transparent';
  let borderColor: string | undefined;
  let borderWidth: number | undefined;
  
  if (typeof colorResult === 'string') {
    backgroundColor = colorResult;
  } else {
    backgroundColor = colorResult.backgroundColor;
    borderColor = colorResult.borderColor;
    borderWidth = colorResult.borderWidth;
  }
  
  const style: React.CSSProperties = {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor,
    width,
    height,
    transform: `translate(${safeX0}px, ${safeY0}px)`,
    zIndex: 10,
    overflow: "hidden",
    boxSizing: "border-box",
  };
  
  // Apply border if borderColor is provided
  if (borderColor) {
    // Create a small gap between nodes to prevent border overlap
    style.width = width - 1;
    style.height = height - 1;
    style.border = `${borderWidth || 1}px solid ${borderColor}`;
    style.margin = '0.5px';
  }
  
  return style;
};

// Children Node Styles
export const getChildNodeStyle = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colorResult: { backgroundColor: string; borderColor?: string; borderWidth?: number } | string,
  borderRadius: number,
  animationDuration: number,
  index: number
): React.CSSProperties => {
  // Only replace with 0 if the value is NaN or undefined, otherwise keep the original value
  const safeX0 = isNaN(x0) ? 0 : Math.floor(x0); // Floor for integer pixels
  const safeY0 = isNaN(y0) ? 0 : Math.floor(y0);
  const safeX1 = isNaN(x1) ? 0 : Math.ceil(x1); // Ceiling for integer pixels
  const safeY1 = isNaN(y1) ? 0 : Math.ceil(y1);
  
  // Ensure width and height are non-negative
  const width = Math.max(0, safeX1 - safeX0);
  const height = Math.max(0, safeY1 - safeY0);
  
  // Handle both string (backward compatibility) and object color result
  let backgroundColor = 'transparent';
  let borderColor: string | undefined;
  let borderWidth: number | undefined;
  
  if (typeof colorResult === 'string') {
    backgroundColor = colorResult;
  } else {
    backgroundColor = colorResult.backgroundColor;
    borderColor = colorResult.borderColor;
    borderWidth = colorResult.borderWidth;
  }
  
  const style: React.CSSProperties = {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor,
    width,
    height,
    transform: `translate(${safeX0}px, ${safeY0}px) scale(0.8)`,
    transformOrigin: "center",
    zIndex: 100,
    overflow: "hidden",
    boxSizing: "border-box",
    opacity: 0,
    animation: `fade-in-scale ${animationDuration}ms forwards ${index * 30}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    willChange: "opacity, transform",
  };
  
  // Apply border if borderColor is provided
  if (borderColor) {
    // Create a small gap between nodes to prevent border overlap
    style.width = width - 1;
    style.height = height - 1;
    style.border = `${borderWidth || 1}px solid ${borderColor}`;
    style.margin = '0.5px';
  }
  
  return style;
};

// Content Wrapper Styles
export const getNodeContentWrapperStyle = (
  isExpanding: boolean,
  animationPhase: string,
  animationDuration: number
): React.CSSProperties => {
  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    textAlign: 'center',
    padding: '4px',
    boxSizing: 'border-box',
  };
  
  if (isExpanding) {
    if (animationPhase === 'expanding') {
      // For expanding phase, don't animate the entire content, just scale the text elements
      // This ensures that positioned elements like the back button stay in place
      wrapperStyle.transformOrigin = 'center';
    } else if (animationPhase === 'expanded' || animationPhase === 'showing-children') {
      // Maintain transform properties but don't scale the whole wrapper
      wrapperStyle.transformOrigin = 'center';
    }
  }

  return wrapperStyle;
};

// Expanding Node Styles
interface InitialFinalStyles {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getExpandingNodeStyles = (
  initialStyles: InitialFinalStyles,
  finalStyles: InitialFinalStyles,
  colorResult: { backgroundColor: string; borderColor?: string; borderWidth?: number } | string,
  borderRadius: number,
  contentScale: number,
  animationPhase: string,
  animationDuration: number
): React.CSSProperties | null => {
  // Only replace with 0 if the value is NaN or undefined, otherwise keep the original value
  const safeInitialX = isNaN(initialStyles.x) ? 0 : initialStyles.x;
  const safeInitialY = isNaN(initialStyles.y) ? 0 : initialStyles.y;
  const safeInitialWidth = isNaN(initialStyles.width) ? 0 : Math.max(0, initialStyles.width);
  const safeInitialHeight = isNaN(initialStyles.height) ? 0 : Math.max(0, initialStyles.height);
  
  const safeFinalX = isNaN(finalStyles.x) ? 0 : finalStyles.x;
  const safeFinalY = isNaN(finalStyles.y) ? 0 : finalStyles.y;
  const safeFinalWidth = isNaN(finalStyles.width) ? 0 : Math.max(0, finalStyles.width);
  const safeFinalHeight = isNaN(finalStyles.height) ? 0 : Math.max(0, finalStyles.height);
  
  // Ensure contentScale is a valid number between 0.1 and 1
  const safeContentScale = isNaN(contentScale) ? 0.85 : Math.min(Math.max(0.1, contentScale), 1);
  
  // Handle both string (backward compatibility) and object color result
  let backgroundColor = 'transparent';
  let borderColor: string | undefined;
  let borderWidth: number | undefined;
  
  if (typeof colorResult === 'string') {
    backgroundColor = colorResult;
  } else {
    backgroundColor = colorResult.backgroundColor;
    borderColor = colorResult.borderColor;
    borderWidth = colorResult.borderWidth;
  }
  
  // Common styles for all animation phases
  const commonStyles: React.CSSProperties = {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor, // Provide a fallback
    zIndex: 200,
    overflow: "hidden",
    boxSizing: "border-box",
    willChange: "transform, width, height",
  };
  
  // Apply border if borderColor is provided
  if (borderColor) {
    commonStyles.border = `${borderWidth || 1}px solid ${borderColor}`;
    
    // Hide border in showing-children phase to prevent double borders
    if (animationPhase === 'showing-children') {
      commonStyles.border = 'none';
    }
  }
  
  if (animationPhase === 'expanding') {
    // During expansion - animate from initial to final size
    return {
      ...commonStyles,
      width: safeInitialWidth,
      height: safeInitialHeight,
      transform: `translate(${safeInitialX}px, ${safeInitialY}px)`,
      animation: `expand-node ${animationDuration}ms forwards cubic-bezier(0.4, 0, 0.2, 1)`,
      // CSS variables to store animation position values
      "--initial-x": `${safeInitialX}px`,
      "--initial-y": `${safeInitialY}px`,
      "--initial-width": `${safeInitialWidth}px`,
      "--initial-height": `${safeInitialHeight}px`,
      "--final-x": `${safeFinalX}px`,
      "--final-y": `${safeFinalY}px`,
      "--final-width": `${safeFinalWidth}px`,
      "--final-height": `${safeFinalHeight}px`,
      "--content-scale": safeContentScale,
    } as React.CSSProperties;
  } else if (animationPhase === 'expanded' || animationPhase === 'showing-children') {
    // For both expanded and showing-children phases, use the same styling to avoid the replacement effect
    // The only difference will be the opacity transition in showing-children phase
    const style: React.CSSProperties = {
      ...commonStyles,
      width: safeFinalWidth,
      height: safeFinalHeight,
      transform: `translate(${safeFinalX}px, ${safeFinalY}px)`,
      "--content-scale": safeContentScale,
      zIndex: animationPhase === 'showing-children' ? 150 : 200,
    } as React.CSSProperties;
    
    // Only add opacity transition for showing-children phase
    if (animationPhase === 'showing-children') {
      return {
        ...style,
        transition: `opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity: 0,
        pointerEvents: 'none', // Prevent interaction while fading out
      };
    }
    
    return style;
  }
  
  return null;
};

// Animation Keyframes
export const keyframesStyles = `
  @keyframes expand-node {
    from {
      width: var(--initial-width);
      height: var(--initial-height);
      transform: translate(var(--initial-x), var(--initial-y));
    }
    to {
      width: var(--final-width);
      height: var(--final-height);
      transform: translate(var(--final-x), var(--final-y));
    }
  }
  
  @keyframes content-adjust {
    0% {
      /* Start with no scaling */
      transform: scale(1);
    }
    45% {
      /* Keep text close to original size longer */
      transform: scale(0.95);
    }
    100% {
      /* Final scale - gradual application */
      transform: scale(var(--content-scale, 1));
    }
  }
  
  @keyframes fade-in-scale {
    from {
      opacity: 0;
      transform: translate(var(--x), var(--y)) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(var(--x), var(--y)) scale(1);
    }
  }
`; 