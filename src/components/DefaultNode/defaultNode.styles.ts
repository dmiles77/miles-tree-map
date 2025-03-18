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
  position: 'relative'
});

// Back Button Styles
export const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px',
  left: '4px',
  padding: '2px 6px',
  fontSize: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  borderRadius: '3px',
  color: '#fff',
  cursor: 'pointer',
  zIndex: 10,
};

// Node Name Styles
export const nodeNameStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  textAlign: 'center'
};

// Node Value Styles
export const nodeValueStyle: React.CSSProperties = {
  fontSize: '10px'
}; 