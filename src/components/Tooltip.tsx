import React from "react";
import {
  TreeNode,
  TooltipPosition,
  ICustomTooltipProps,
} from "../interfaces/interfaces";

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
  const tooltipPosition = {
    mouseRight: {
      left: position.x + 10,
      top: position.y + 0,
    },
    mouseBottom: {
      left: position.x - 100,
      top: position.y + 20,
    },
    mouseTop: {
      left: position.x + 10,
      top: position.y - 100,
    },
  };
  return (
    <div
      style={{
        position: "absolute",
        left: tooltipPosition[customTooltipPosition].left, // Offset by 10px to avoid overlap
        top: tooltipPosition[customTooltipPosition].top,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        color: "white",
        padding: "6px 10px",
        borderRadius: "5px",
        pointerEvents: "none", // Prevents interfering with mouse events
        zIndex: 999,
        whiteSpace: "nowrap",
        ...customTooltipStyle,
      }}
    >
      {tooltipComponentRender ? (
        tooltipComponentRender({node, position})
      ) : (
        <>
          <strong>{node.name}</strong> <br />
          {node.customData && (
            <pre style={{ margin: "0", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(node.customData, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

export default Tooltip;
