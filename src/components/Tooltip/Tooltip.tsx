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
}

const Tooltip: React.FC<TooltipProps> = ({
  node,
  position,
  customTooltipPosition,
  customTooltipStyle,
  tooltipComponentRender,
}) => {
  const tooltipPosition = getTooltipPositionStyle(
    position.x,
    position.y,
    customTooltipPosition
  );
  
  const tooltipStyle = getTooltipStyle(tooltipPosition, customTooltipStyle);

  return (
    <div style={tooltipStyle}>
      {tooltipComponentRender ? (
        tooltipComponentRender({node, position})
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
