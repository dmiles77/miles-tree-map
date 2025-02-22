// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import { useTransition, animated, to } from "@react-spring/web";
import { HierarchyRectangularNode } from "d3-hierarchy";
import Breadcrumbs from "./Breadcrumbs";
import DefaultNode from "./DefaultNode";
import Tooltip from "./Tooltip";
import {
  TreeNode,
  ColorRangeBehavior,
  TooltipPosition,
  ICustomNodeProps,
  ICustomTooltipProps,
  ITooltip
} from "../interfaces/inferfaces";
import { TREE_MAP_CONSTANTS } from '../constants/treeMap';
import { useTreeMapLayout } from '../hooks/useTreeMapLayout';
import { useTreeMapColors } from '../hooks/useTreeMapColors';

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
  colorRange = TREE_MAP_CONSTANTS.COLORS.DEFAULT_RANGE,
  colorRangeBehavior = TREE_MAP_CONSTANTS.DEFAULT_COLOR_RANGE_BEHAVIOR,
  animationDuration = TREE_MAP_CONSTANTS.ANIMATION.DEFAULT_DURATION,
  breadcrumbEnabled = TREE_MAP_CONSTANTS.BREADCRUMBS_ENABLED,
  paddingInner = TREE_MAP_CONSTANTS.LAYOUT.DEFAULT_PADDING_INNER,
  paddingOuter = TREE_MAP_CONSTANTS.LAYOUT.DEFAULT_PADDING_OUTER,
  borderRadius = TREE_MAP_CONSTANTS.LAYOUT.DEFAULT_BORDER_RADIUS,
  minDisplayValue = TREE_MAP_CONSTANTS.LAYOUT.DEFAULT_MIN_DISPLAY_VALUE,
  customTooltipPosition = TREE_MAP_CONSTANTS.TOOLTIP.DEFAULT_POSITION,
  backButtonEnabled,
  tooltipEnabled,
  customTooltipStyle,
  tooltipComponentRender,
  onNodeClick,
}) => {
  const [currentNode, setCurrentNode] = useState<TreeNode>(data);
  const [history, setHistory] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [clickedNode, setClickedNode] = useState<HierarchyRectangularNode<TreeNode> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tooltip, setTooltip] = useState<ITooltip>({
    x: 0,
    y: 0,
    data: null,
  });

  const { nodes, prevLayout } = useTreeMapLayout({
    currentNode,
    dimensions,
    minDisplayValue,
    paddingInner,
    paddingOuter
  });

  const { getNodeColor } = useTreeMapColors();

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

  const handleNodeClick = (layoutNode: HierarchyRectangularNode<TreeNode>) => {
    if (layoutNode.data.children?.length && !isTransitioning) {
      setIsTransitioning(true);
      setClickedNode(layoutNode); // Store clicked node for zoom effect
      
      // Delay state updates slightly to allow zoom animation to start
      setTimeout(() => {
        setHistory(prev => [...prev, currentNode]);
        setCurrentNode(layoutNode.data);
        onNodeClick?.(layoutNode.data);
      }, 50);
    }
  };

  const handleBack = (index: number) => {
    if (index === history.length || isTransitioning) return;
    
    setIsTransitioning(true);
    const targetNode = history[index];
    setClickedNode(null);
    
    setTimeout(() => {
      setCurrentNode(targetNode);
      setHistory(prev => prev.slice(0, index));
      setIsTransitioning(false);
    }, 50);
  };

  const transitions = useTransition(nodes, {
    keys: (node) => node.data.id,
    from: (node) => {
      const prev = prevLayout[node.data.id];
      if (!prev) {
        // New nodes zoom in from clicked node position or center
        const sourceNode = clickedNode || {
          x0: dimensions.width / 2,
          y0: dimensions.height / 2,
          x1: dimensions.width / 2,
          y1: dimensions.height / 2
        };
        return {
          opacity: 0,
          x: sourceNode.x0,
          y: sourceNode.y0,
          width: 0,
          height: 0,
          scale: 0.5,
        };
      }
      
      return {
        opacity: 0.8,
        x: prev.x0,
        y: prev.y0,
        width: prev.x1 - prev.x0,
        height: prev.y1 - prev.y0,
        scale: 1,
      };
    },
    enter: (node) => ({
      opacity: 1,
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
      scale: 1,
    }),
    update: (node) => ({
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
      scale: 1,
      opacity: 1,
    }),
    leave: (node) => {
      const targetNode = clickedNode || {
        x0: dimensions.width / 2,
        y0: dimensions.height / 2
      };
      
      return {
        opacity: 0,
        x: targetNode.x0,
        y: targetNode.y0,
        width: 0,
        height: 0,
        scale: 0.5,
      };
    },
    config: {
      duration: animationDuration,
      easing: t => t * (2 - t), // Ease-out effect for smoother animation
    },
    onRest: () => {
      setIsTransitioning(false);
      setClickedNode(null);
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
            border: colorRangeBehavior === "borderOnly" 
              ? `2px solid ${colorRange[0]}`
              : "1px solid rgba(0, 0, 0, 0.1)",
            transform: to(
              [style.x, style.y, style.scale],
              (x, y, s) => `translate3d(${x}px, ${y}px, 0) scale(${s})`
            ),
            transformOrigin: 'center',
            width: style.width,
            height: style.height,
            opacity: style.opacity,
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease',
            willChange: 'transform, opacity, width, height',
          }}
          onClick={() => handleNodeClick(node)}
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
            setTooltip({ x: 0, y: 0, data: null });
          }}
        >
          {renderComponent ? (
            renderComponent({
              node: node.data,
              width: node.x1 - node.x0,
              height: node.y1 - node.y0,
              backgroundColor: getNodeColor(node, nodes, colorRange, colorRangeBehavior),
              handleBack,
              history
            })
          ) : (
            <DefaultNode
              node={node.data}
              width={node.x1 - node.x0}
              height={node.y1 - node.y0}
              backgroundColor={getNodeColor(node, nodes, colorRange, colorRangeBehavior)}
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
