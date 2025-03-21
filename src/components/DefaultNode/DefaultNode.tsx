import React, { useState } from 'react';
import { TreeNode } from '../../interfaces/interfaces';
import {
  getNodeContainerStyle,
  backButtonStyle,
  backButtonHoverStyle,
  backButtonActiveStyle,
  nodeNameStyle,
  nodeValueStyle,
  getExpandingTextStyle
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
  isExpanding?: boolean;
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
  isExpanding = false
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);
    
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

    // Get text styles that support animation during expansion
    const expandingTextStyle = getExpandingTextStyle(isExpanding);
    const combinedNameStyle = { ...nodeNameStyle, ...expandingTextStyle };
    const combinedValueStyle = { ...nodeValueStyle, ...expandingTextStyle };
    
    // Combine button styles based on state
    const currentButtonStyle = {
        ...backButtonStyle,
        ...(isHovering ? backButtonHoverStyle : {}),
        ...(isActive ? backButtonActiveStyle : {})
    };

    // Determine if we need to adjust content positioning
    const hasBackButton = history.length > 0 && backButtonEnabled && !isExpanding;

    return (
        <div style={containerStyle}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
                height: '100%',
                // Add bottom padding when back button is present to avoid overlap
                paddingBottom: hasBackButton ? '40px' : '0'
            }}>
                <span style={combinedNameStyle}>{node.name}</span>
                <span style={combinedValueStyle}>{nodeValue}</span>
            </div>
            
            {hasBackButton && (
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleBack(history.length - 1);
                }}
                style={currentButtonStyle}
                aria-label="Go back"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setIsActive(false);
                }}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onTouchStart={() => setIsActive(true)}
                onTouchEnd={() => setIsActive(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}>
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
        </div>
    );
};

export default DefaultNode;