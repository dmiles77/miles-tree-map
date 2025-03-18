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
  backgroundColor: string | undefined,
  borderRadius: number
): React.CSSProperties => {
  const width = x1 - x0;
  const height = y1 - y0;
  
  return {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor: backgroundColor || 'transparent',
    width,
    height,
    transform: `translate(${x0}px, ${y0}px)`,
    zIndex: 10,
    overflow: "hidden",
    boxSizing: "border-box",
  };
};

// Children Node Styles
export const getChildNodeStyle = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  backgroundColor: string | undefined,
  borderRadius: number,
  animationDuration: number,
  index: number
): React.CSSProperties => {
  const width = x1 - x0;
  const height = y1 - y0;
  
  return {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor: backgroundColor || 'transparent',
    width,
    height,
    transform: `translate(${x0}px, ${y0}px) scale(0.8)`,
    transformOrigin: "center",
    zIndex: 100,
    overflow: "hidden",
    boxSizing: "border-box",
    opacity: 0,
    animation: `fade-in-scale ${animationDuration}ms forwards ${index * 30}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    willChange: "opacity, transform",
  };
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
      wrapperStyle.animation = `content-adjust ${animationDuration}ms forwards cubic-bezier(0.4, 0, 0.2, 1)`;
      wrapperStyle.transformOrigin = 'center';
      wrapperStyle.willChange = 'transform';
    } else if (animationPhase === 'expanded' || animationPhase === 'showing-children') {
      wrapperStyle.transform = `scale(var(--content-scale, 1))`;
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
  backgroundColor: string | undefined,
  borderRadius: number,
  contentScale: number,
  animationPhase: string,
  animationDuration: number
): React.CSSProperties | null => {
  // Common styles for all animation phases
  const commonStyles: React.CSSProperties = {
    position: "absolute",
    borderRadius: `${borderRadius}px`,
    backgroundColor: backgroundColor || 'transparent', // Provide a fallback
    zIndex: 200,
    overflow: "hidden",
    boxSizing: "border-box",
    willChange: "transform, width, height",
  };
  
  if (animationPhase === 'expanding') {
    // During expansion - animate from initial to final size
    return {
      ...commonStyles,
      width: initialStyles.width,
      height: initialStyles.height,
      transform: `translate(${initialStyles.x}px, ${initialStyles.y}px)`,
      animation: `expand-node ${animationDuration}ms forwards cubic-bezier(0.4, 0, 0.2, 1)`,
      // CSS variables to store animation position values
      "--initial-x": `${initialStyles.x}px`,
      "--initial-y": `${initialStyles.y}px`,
      "--initial-width": `${initialStyles.width}px`,
      "--initial-height": `${initialStyles.height}px`,
      "--final-x": `${finalStyles.x}px`,
      "--final-y": `${finalStyles.y}px`,
      "--final-width": `${finalStyles.width}px`,
      "--final-height": `${finalStyles.height}px`,
      "--content-scale": contentScale,
    } as React.CSSProperties;
  } else if (animationPhase === 'expanded' || animationPhase === 'showing-children') {
    // For both expanded and showing-children phases, use the same styling to avoid the replacement effect
    // The only difference will be the opacity transition in showing-children phase
    const style: React.CSSProperties = {
      ...commonStyles,
      width: finalStyles.width,
      height: finalStyles.height,
      transform: `translate(${finalStyles.x}px, ${finalStyles.y}px)`,
      "--content-scale": contentScale,
      zIndex: animationPhase === 'showing-children' ? 150 : 200,
    } as React.CSSProperties;
    
    // Only add opacity transition for showing-children phase
    if (animationPhase === 'showing-children') {
      return {
        ...style,
        transition: `opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity: 0,
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