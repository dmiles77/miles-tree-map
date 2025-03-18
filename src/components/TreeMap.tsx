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
} from "../interfaces/interfaces";
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
  customTooltipPosition = TREE_MAP_CONSTANTS.TOOLTIP.DEFAULT_POSITION,
  backButtonEnabled,
  tooltipEnabled,
  customTooltipStyle,
  tooltipComponentRender,
  onNodeClick,
}) => {
  const [currentNode, setCurrentNode] = useState<TreeNode>(data);
  const [history, setHistory] = useState<TreeNode[]>([]);
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
    paddingInner,
    paddingOuter,
    breadcrumbEnabled
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
    if (layoutNode.data.children?.length) {
      setClickedNode(layoutNode);
      setTimeout(() => {
        setHistory([...history, currentNode]);
        setCurrentNode(layoutNode.data);
        setIsTransitioning(false);
      }, animationDuration);
    }
    onNodeClick?.(layoutNode.data);
  };

  const handleBack = (index: number) => {
    if (index === history.length || isTransitioning) return;
    
    setIsTransitioning(true);
    const targetNode = history[index];
    setClickedNode(null);
    
    setCurrentNode(targetNode);
    setHistory(prev => prev.slice(0, index));
    setIsTransitioning(false);
  };

  const getTreeMapBounds = () => {
    const verticalSpace = breadcrumbEnabled ? TREE_MAP_CONSTANTS.BREADCRUMBS_HEIGHT : 0;
    const effectiveTopPadding = breadcrumbEnabled ? 0 : paddingOuter;
    
    return {
      x: paddingOuter,
      y: effectiveTopPadding + verticalSpace,
      width: dimensions.width - (paddingOuter * 2),
      height: dimensions.height - verticalSpace - (paddingOuter * 2),
    };
  };

  const transitions = useTransition(nodes, {
    keys: (node) => node.data.id,
    from: (node) => {
      if (clickedNode) {
        const bounds = getTreeMapBounds();
        const parentOriginalWidth = clickedNode.x1 - clickedNode.x0;
        const parentOriginalHeight = clickedNode.y1 - clickedNode.y0;
    
        // Calculate proportional positions within parent's original area
        const proportionalX = (node.x0 - bounds.x) / bounds.width;
        const proportionalY = (node.y0 - bounds.y) / bounds.height;
    
        return {
          opacity: 0,
          x: clickedNode.x0 + proportionalX * parentOriginalWidth,
          y: clickedNode.y0 + proportionalY * parentOriginalHeight,
          width: (node.x1 - node.x0) * (parentOriginalWidth / bounds.width),
          height: (node.y1 - node.y0) * (parentOriginalHeight / bounds.height),
        };
      }

      const prev = prevLayout[node.data.id];
      return {
        opacity: 0,
        x: prev?.x0 || node.x0,
        y: prev?.y0 || node.y0,
        width: prev ? prev.x1 - prev.x0 : node.x1 - node.x0,
        height: prev ? prev.y1 - prev.y0 : node.y1 - node.y0,
        scale: 1,
      };
    },
    enter: (node) => ({
      opacity: 1,
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
    }),
    update: (node) => ({
      opacity: 1,
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0,
      scale: 1,
    }),
    leave: { opacity: 0 },
    config: {
      duration: animationDuration,
      easing: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
  });

  const expandingNodeTransition = useTransition(clickedNode, {
    from: (node) => ({
      x: node?.x0 || 0,
      y: node?.y0 || 0,
      width: node ? node.x1 - node.x0 : 0,
      height: node ? node.y1 - node.y0 : 0,
      opacity: 1,
    }),
    enter: () => ({
      ...getTreeMapBounds(),
      opacity: 1,
    }),
    leave: { 
      opacity: 0,
      config: { 
        duration: animationDuration / 2 
      }
    },
    config: {
      duration: animationDuration,
      easing: t => t * (2 - t),
    },
    onRest: () => {
      setClickedNode(null);
      setIsTransitioning(false);
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
        clipPath: 'inset(0 0 0 0)'
      }}
    >
      {breadcrumbEnabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: paddingOuter,
            right: paddingOuter,
            zIndex: 101,
            padding: "8px 0",
            height: "auto",
          }}
        >
          <Breadcrumbs
            history={[...history, currentNode]}
            onNavigate={handleBack}
          />
        </div>
      )}
      {expandingNodeTransition((style: any, node: any) => 
        node && (
          <animated.div
            style={{
              position: "absolute",
              borderRadius: `${borderRadius}px`,
              backgroundColor: getNodeColor(node, nodes, colorRange, colorRangeBehavior),
              ...style,
              zIndex: 100,
            }}
          >
            {renderComponent ? (
              renderComponent({
                node: node.data,
                width: style.width,
                height: style.height,
                backgroundColor: getNodeColor(node, nodes, colorRange, colorRangeBehavior),
                handleBack,
                history
              })
            ) : (
              <DefaultNode
                node={node.data}
                width={style.width}
                height={style.height}
                backgroundColor={getNodeColor(node, nodes, colorRange, colorRangeBehavior)}
                handleBack={handleBack}
                history={history}
                backButtonEnabled={!!backButtonEnabled}
              />
            )}
          </animated.div>
        )
      )}
      {transitions((style: any, node: any) => (
        <animated.div
          key={node.data.id}
          style={{
            position: "absolute",
            borderRadius: `${borderRadius}px`,
            width: style.width,
            height: style.height,
            opacity: style.opacity,
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease',
            willChange: 'transform, opacity',
            border: 'none',
            boxShadow: 'none',
            transform: to(
              [style.x, style.y],
              (x, y) => `translate3d(${x}px, ${y}px, 0)`
            ),
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
