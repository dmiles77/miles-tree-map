import React from 'react';
import { ICustomNodeProps } from '../interfaces/inferfaces';

interface CustomNodeExampleProps {
  componentProps: ICustomNodeProps;
}

const CustomNodeExample: React.FC<CustomNodeExampleProps> = ({ componentProps }) => {
  const { node, width, height, backgroundColor, handleBack, history } = componentProps;
    // Recursive function to calculate total value of node and all its descendants
    const calcNodeValue = (node: { value?: number; children?: any[] }): number => {
        if (!node.children?.length) {
            return node.value || 0;
        }
        return node.children.reduce((acc, child) => acc + calcNodeValue(child), 0);
    };

    const nodeValue = node.value || calcNodeValue(node);

    return (
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: backgroundColor,
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
              borderRadius: '4px',
              padding: '4px',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {history.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                    handleBack(history.length - 1);
                }}
                style={{
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
                }}
              >
                ↩
              </button>
            )}
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              marginTop: history.length > 0 ? '20px' : '0'
            }}>
              {node.name}
            </span>
            <span style={{ fontSize: '10px' }}>{nodeValue}</span>
          </div>
    );
};

export default CustomNodeExample;