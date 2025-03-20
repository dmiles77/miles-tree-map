import React from "react";
import {
  TreeNode,
  TooltipPosition,
  ICustomTooltipProps,
} from "../../interfaces/interfaces";
import {
  getTooltipPositionStyle,
  getTooltipStyle,
  customDataPreStyle
} from "./tooltip.styles";

interface TooltipProps {
  node: TreeNode;
  position: { x: number; y: number };
  customTooltipPosition: TooltipPosition;
  customTooltipStyle?: React.CSSProperties;
  tooltipComponentRender?: (
    customTooltipProps: ICustomTooltipProps
  ) => React.ReactNode;
  containerWidth?: number;
  containerHeight?: number;
  nodeDimensions?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

const Tooltip: React.FC<TooltipProps> = ({
  node,
  position,
  customTooltipPosition,
  customTooltipStyle,
  tooltipComponentRender,
  containerWidth,
  containerHeight,
  nodeDimensions
}) => {
  // Calculate node width and height if dimensions are provided
  const nodeWidth = nodeDimensions ? nodeDimensions.x1 - nodeDimensions.x0 : 0;
  const nodeHeight = nodeDimensions ? nodeDimensions.y1 - nodeDimensions.y0 : 0;
  
  const tooltipPosition = getTooltipPositionStyle(
    position.x,
    position.y,
    customTooltipPosition,
    containerWidth,
    containerHeight,
    nodeDimensions ? {
      ...nodeDimensions,
      width: nodeWidth,
      height: nodeHeight
    } : undefined
  );
  
  const tooltipStyle = getTooltipStyle(tooltipPosition, customTooltipStyle);

  return (
    <div style={tooltipStyle}>
      {tooltipComponentRender ? (
        tooltipComponentRender({
          node, 
          position,
          containerWidth,
          containerHeight,
          calculatedPosition: tooltipPosition,
          tooltipPosition: customTooltipPosition,
          nodeDimensions: nodeDimensions ? {
            ...nodeDimensions,
            width: nodeWidth,
            height: nodeHeight
          } : undefined
        })
      ) : (
        <>
          <strong>{node.name}</strong> <br />
          {node.customData && (
            <pre style={customDataPreStyle}>
              {JSON.stringify(node.customData, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

export default Tooltip;
