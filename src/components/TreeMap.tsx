import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTransition, animated, to } from "@react-spring/web";
import { hierarchy, treemap, HierarchyRectangularNode } from "d3-hierarchy";
import { scaleLinear } from "d3-scale";
import Breadcrumbs from "./Breadcrumbs";
import DefaultNode from "./DefaultNode";
import Tooltip from "./Tooltip";
import {
  TreeNode,
  Position,
  ColorRangeBehavior,
  TooltipPosition,
  ICustomNodeProps,
  ICustomTooltipProps,
} from "../interfaces/inferfaces";

interface TreeMapProps {
  data: TreeNode;
  renderComponent?: (componentProps: ICustomNodeProps) => JSX.Element;
  colorRange?: string[];
  colorRangeBehavior?: ColorRangeBehavior;
  onNodeClick?: (node: TreeNode) => void;
  animationDuration?: number;
  breadcrumbEnabled?: boolean;
  backButtonEnabled?: boolean;
  paddingInner?: number;
  paddingOuter?: number;
  borderRadius?: number;
  minDisplayValue?: number;
  tooltipEnabled?: boolean;
  customTooltipPosition?: TooltipPosition;
  customTooltipStyle?: React.CSSProperties;
  tooltipComponentRender?: (customTooltipProps: ICustomTooltipProps) => React.ReactNode;
}

export const TreeMap: React.FC<TreeMapProps> = ({
  data,
  renderComponent,
  colorRange = ['#ff6b6b', '#4ecdc4'],
  colorRangeBehavior = "oneColor",
  onNodeClick,
  animationDuration = 300,
  breadcrumbEnabled = true,
  backButtonEnabled,
  paddingInner = 1,
  paddingOuter = 50,
  borderRadius = 2,
  minDisplayValue = 0,
  tooltipEnabled,
  customTooltipPosition = "mouseRight",
  customTooltipStyle,
  tooltipComponentRender,
}) => {
  const [currentNode, setCurrentNode] = useState<TreeNode>(data);
  const [history, setHistory] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const previousPosition = useRef<Position | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: TreeNode | null;
  }>({
    x: 0,
    y: 0,
    data: null,
  });

  const getNodeColor = (node: HierarchyRectangularNode<TreeNode>) => {
    switch (colorRangeBehavior) {
      case "oneColor":
        return colorRange[0];
      case "gradient": {
        const colorScale = scaleLinear<string>()
          .domain([0, Math.max(...nodes.map((n) => n.value || 0))])
          .range(colorRange as [string, string]);
        return colorScale(node.value || 0);
      }
      case "discrete": {
        const index = nodes.indexOf(node);
        const step = Math.floor(
          (index * (colorRange.length - 1)) / (nodes.length - 1)
        );
        return colorRange[step];
      }
      case "transparent":
        return "transparent";
      case "borderOnly":
        return "transparent";
      case "patternFill":
        return `repeating-linear-gradient(45deg, ${colorRange[0]}, ${colorRange[0]} 10px, ${colorRange[1]} 10px, ${colorRange[1]} 20px)`;
      case "heatmap": {
        const maxValue = Math.max(...nodes.map((n) => n.value || 0));
        const intensity = (node.value || 0) / maxValue;
        // Convert hex to RGB
        const hex = colorRange[0].replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Brighten for start color (add 50% of remaining value to each channel)
        const startR = Math.min(r + (255 - r) * 0.5, 255);
        const startG = Math.min(g + (255 - g) * 0.5, 255);
        const startB = Math.min(b + (255 - b) * 0.5, 255);
        // Interpolate between start and end colors based on intensity
        const finalR = Math.round(startR + (r - startR) * intensity);
        const finalG = Math.round(startG + (g - startG) * intensity);
        const finalB = Math.round(startB + (b - startB) * intensity);
        return `rgb(${finalR}, ${finalG}, ${finalB})`;
      }
      default:
        return colorRange[0];
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const nodes = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return [];

    const root = hierarchy(currentNode)
      .sum((d) =>
        d.children?.length ? 0 : Math.max(d.value || 0, minDisplayValue)
      )
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treeMapLayout = treemap<TreeNode>()
      .size([dimensions.width, dimensions.height])
      .paddingOuter(paddingOuter)
      .paddingInner(paddingInner)
      .round(false);

    const layoutRoot = treeMapLayout(root);
    return layoutRoot.children || [];
  }, [currentNode, dimensions, minDisplayValue, paddingInner, paddingOuter]);

  const handleNodeClick = (node: TreeNode) => {
    if (node.children?.length) {
      setHistory(prev => [...prev, currentNode] as any);
      setCurrentNode(node);
      onNodeClick?.(node);
    }
  };

  const handleBack = (index: number) => {
    // Don't do anything if clicking the current node
    if (index === history.length) return;
    // Get the node we want to navigate to
    const targetNode = history[index];
    // Update current node to the target
    setCurrentNode(targetNode);
    // Keep history up to the clicked index
    setHistory(prev => prev.slice(0, index));
  };

  const transitions = useTransition(nodes, {
    keys: (node: any) => node.data.id,
    from: (node: any) => {
      if (previousPosition.current) {
        return {
          opacity: 0,
          x: previousPosition.current.x0,
          y: previousPosition.current.y0,
          width: previousPosition.current.x1 - previousPosition.current.x0,
          height: previousPosition.current.y1 - previousPosition.current.y0,
        };
      }
      return {
        opacity: 0,
        x: node.x0,
        y: node.y0,
        width: 0,
        height: 0,
      };
    },
    enter: (node: any) => ({
      opacity: 1,
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
    }),
    update: (node: any) => ({
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
    }),
    leave: (node: any) => {
      if (previousPosition.current) {
        return {
          opacity: 0,
          x: previousPosition.current.x0,
          y: previousPosition.current.y0,
          width: previousPosition.current.x1 - previousPosition.current.x0,
          height: previousPosition.current.y1 - previousPosition.current.y0,
        };
      }
      return {
        opacity: 0,
        x: node.x0,
        y: node.y0,
        width: 0,
        height: 0,
      };
    },
    config: {
      duration: animationDuration,
    },
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
      }}
    >
      {breadcrumbEnabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px",
          }}
        >
          <Breadcrumbs
            history={[...history, currentNode]}
            onNavigate={handleBack}
          />
        </div>
      )}
      {transitions((style: any, node: any) => (
        <animated.div
          key={node.data.id}
          style={{
            position: "absolute",
            borderRadius: `${borderRadius}px`,
            border:
              colorRangeBehavior === "borderOnly"
                ? `2px solid ${colorRange[0]}`
                : "1px solid rgba(255, 255, 255, 0.2)",
            width: style.width.to((w: number) => `${w}px`),
            height: style.height.to((h: number) => `${h}px`),
            opacity: style.opacity,
            transform: to(
              [style.x, style.y],
              (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`
            ),
          }}
          onClick={() => handleNodeClick(node.data)}
          onMouseEnter={(e: any) => {
            setTooltip({
              x: e.clientX,
              y: e.clientY,
              data: node.data,
            });
          }}
          onMouseMove={(e: any) => {
            setTooltip((prev) => ({
              ...prev,
              x: e.clientX,
              y: e.clientY,
            }));
          }}
          onMouseLeave={() => {
            setTooltip({ x: 0, y: 0, data: null }); // Hide tooltip
          }}
        >
          {renderComponent ? (
            renderComponent({
              node: node.data,
              width: node.x1 - node.x0,
              height: node.y1 - node.y0,
              backgroundColor: getNodeColor(node),
              handleBack,
              history
            })
          ) : (
            <DefaultNode
              node={node.data}
              width={node.x1 - node.x0}
              height={node.y1 - node.y0}
              backgroundColor={getNodeColor(node)}
              handleBack={handleBack}
              history={history}
              backButtonEnabled={!!backButtonEnabled}
            />
          )}
        </animated.div>
      ))}
      {tooltipEnabled && tooltip.data && (
        <Tooltip node={tooltip.data} position={{x: tooltip.x, y: tooltip.y}} customTooltipPosition={customTooltipPosition} customTooltipStyle={customTooltipStyle} tooltipComponentRender={tooltipComponentRender} />
      )}
    </div>
  );
};
