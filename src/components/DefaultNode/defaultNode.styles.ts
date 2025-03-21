import React from 'react';

// Node Container Styles
export const getNodeContainerStyle = (width: number, height: number, backgroundColor: string): React.CSSProperties => ({
  width: `${width}px`,
  height: `${height}px`,
  backgroundColor,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  borderRadius: '4px',
  padding: '4px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'visible'
});

// Back Button Styles
export const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  width: '60px',
  height: '60px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '28px',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '50%',
  color: '#fff',
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  transition: 'all 0.2s ease',
  padding: 0,
  outline: 'none',
  lineHeight: 1,
  backdropFilter: 'blur(4px)',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  transform: 'translateZ(0)',
  userSelect: 'none',
};

// Back Button Hover Style - to be applied in component with useState
export const backButtonHoverStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  transform: 'translateY(-1px) translateZ(0)',
};

// Back Button Active Style - to be applied in component with useState
export const backButtonActiveStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  transform: 'translateY(1px) translateZ(0)',
};

// Node Name Styles
export const nodeNameStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  textAlign: 'center',
  transition: 'all 0.3s ease',
};

// Node Value Styles
export const nodeValueStyle: React.CSSProperties = {
  fontSize: '10px',
  transition: 'all 0.3s ease',
};

// For when node is expanding - to apply to text elements
export const getExpandingTextStyle = (isExpanding: boolean): React.CSSProperties => ({
  animation: isExpanding ? 'content-adjust 400ms forwards cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
}); 