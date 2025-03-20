import React from 'react';
import { TreeNode } from '../../interfaces/interfaces';
import {
  getNodeContainerStyle,
  backButtonStyle,
  nodeNameStyle,
  nodeValueStyle
} from './defaultNode.styles';

interface DefaultNodeProps {
  node: TreeNode;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  handleBack: (index: number) => void;
  history: Array<TreeNode>;
  backButtonEnabled: boolean;
}

const DefaultNode: React.FC<DefaultNodeProps> = ({ 
  node, 
  width, 
  height, 
  backgroundColor,
  borderColor,
  borderWidth, 
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

    // Get basic container style
    const containerStyle = getNodeContainerStyle(width, height, backgroundColor);
    
    // Add border if borderColor is provided
    if (borderColor) {
        containerStyle.border = `${borderWidth || 1}px solid ${borderColor}`;
    }

    return (
        <div style={containerStyle}>
            {history.length > 0 && backButtonEnabled && (
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleBack(history.length - 1);
                }}
                style={backButtonStyle}
              >
                ↩
              </button>
            )}
            <span style={nodeNameStyle}>{node.name}</span>
            <span style={nodeValueStyle}>{nodeValue}</span>
        </div>
    );
};

export default DefaultNode;