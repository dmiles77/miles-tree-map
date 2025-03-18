import React from 'react';
import { TreeNode } from '../interfaces/interfaces';

interface DefaultNodeProps {
  node: TreeNode;
  width: number;
  height: number;
  backgroundColor: string;
  handleBack: (index: number) => void;
  history: Array<TreeNode>;
  backButtonEnabled: boolean;
}

const DefaultNode: React.FC<DefaultNodeProps> = ({ 
  node, 
  width, 
  height, 
  backgroundColor, 
  handleBack, 
  history, 
  backButtonEnabled, 
}) => {
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
            }}
        >
            {history.length > 0 && backButtonEnabled && (
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
            <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{node.name}</span>
            <span style={{ fontSize: '10px' }}>{nodeValue}</span>
        </div>
    );
};

export default DefaultNode;