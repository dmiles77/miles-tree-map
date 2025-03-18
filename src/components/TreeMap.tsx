import React, { useRef, useState, useEffect } from "react";
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

// Animation phases
type AnimationPhase = "idle" | "expanding" | "expanded" | "showing-children";

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
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
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
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      setDimensions({ width, height });
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    updateDimensions(); // Initial measurement

    return () => observer.disconnect();
  }, []);

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

  const handleNodeClick = (layoutNode: HierarchyRectangularNode<TreeNode>) => {
    if (!layoutNode.data.children?.length || animationPhase !== "idle") return;

    // Start the expansion animation
    setAnimationPhase("expanding");
    setClickedNode(layoutNode);

    // After expansion animation completes, update the state
    setTimeout(() => {
      // Expansion completed - update the data model
      setAnimationPhase("expanded");
      setHistory(prev => [...prev, currentNode]);
      setCurrentNode(layoutNode.data);
      
      // Short delay to ensure the expand animation completes fully before children appear
      setTimeout(() => {
        setAnimationPhase("showing-children");
        
        // Reset after children appear
        setTimeout(() => {
          setClickedNode(null);
          setAnimationPhase("idle");
        }, animationDuration);
      }, 50); // Small delay to ensure clean transition 
    }, animationDuration);
    
    onNodeClick?.(layoutNode.data);
  };

  const handleBack = (index: number) => {
    if (index === history.length || animationPhase !== "idle") return;
    
    const targetNode = history[index];
    setCurrentNode(targetNode);
    setHistory(prev => prev.slice(0, index));
  };

  const handleMouseEvents = (e: React.MouseEvent, node: HierarchyRectangularNode<TreeNode>) => {
    if (!tooltipEnabled) return;

    if (e.type === 'mouseenter' || e.type === 'mousemove') {
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        data: node.data,
      });
    } else if (e.type === 'mouseleave') {
      setTooltip({ x: 0, y: 0, data: null });
    }
  };

  const renderNodeContent = (node: TreeNode, width: number, height: number, backgroundColor: string) => {
    return renderComponent ? (
      renderComponent({
        node,
        width,
        height,
        backgroundColor,
        handleBack,
        history
      })
    ) : (
      <DefaultNode
        node={node}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        handleBack={handleBack}
        history={history}
        backButtonEnabled={!!backButtonEnabled}
      />
    );
  };

  // Get styles for the expanding node
  const getExpandingNodeStyle = () => {
    if (!clickedNode) return null;
    
    const bounds = getTreeMapBounds();
    const backgroundColor = getNodeColor(clickedNode, nodes, colorRange, colorRangeBehavior);
    
    // Starting position
    const initialStyles = {
      x: clickedNode.x0,
      y: clickedNode.y0,
      width: clickedNode.x1 - clickedNode.x0,
      height: clickedNode.y1 - clickedNode.y0,
    };
    
    // Final position (covering entire treemap)
    const finalStyles = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
    
    // Calculate content scaling factor based on size difference
    // We need to maintain visual consistency, so we'll use a more moderate scaling approach
    const initialArea = initialStyles.width * initialStyles.height;
    const finalArea = finalStyles.width * finalStyles.height;
    
    // Use square root of area ratio for a more balanced scaling
    // This preserves the content size better during expansion
    const areaRatio = Math.sqrt(finalArea / initialArea);
    
    // Use a less dramatic scaling factor - closer to 1.0 means less scaling
    // 0.85 is a good balance - it prevents text from shrinking too much
    const contentScale = Math.min(Math.max(0.85, 1 / Math.sqrt(areaRatio)), 1);
    
    // Common styles for all animation phases
    const commonStyles = {
      position: "absolute" as const,
      borderRadius: `${borderRadius}px`,
      backgroundColor, // Keep consistent color
      zIndex: 200,
      overflow: "hidden",
      boxSizing: "border-box" as const,
      willChange: "transform, width, height", // Optimize for animation performance
    };
    
    if (animationPhase === "expanding") {
      // During expansion - animate from initial to final size
      return {
        ...commonStyles,
        width: initialStyles.width,
        height: initialStyles.height,
        transform: `translate(${initialStyles.x}px, ${initialStyles.y}px)`,
        animation: `expand-node ${animationDuration}ms forwards cubic-bezier(0.4, 0, 0.2, 1)`,
        // CSS variables to store animation position values
        "--initial-x": `${initialStyles.x}px`,
        "--initial-y": `${initialStyles.y}px`,
        "--initial-width": `${initialStyles.width}px`,
        "--initial-height": `${initialStyles.height}px`,
        "--final-x": `${finalStyles.x}px`,
        "--final-y": `${finalStyles.y}px`,
        "--final-width": `${finalStyles.width}px`,
        "--final-height": `${finalStyles.height}px`,
        "--content-scale": contentScale,
      };
    } else if (animationPhase === "expanded" || animationPhase === "showing-children") {
      // For both expanded and showing-children phases, use the same styling to avoid the replacement effect
      // The only difference will be the opacity transition in showing-children phase
      const style = {
        ...commonStyles,
        width: finalStyles.width,
        height: finalStyles.height,
        transform: `translate(${finalStyles.x}px, ${finalStyles.y}px)`,
        "--content-scale": contentScale,
        zIndex: animationPhase === "showing-children" ? 150 : 200,
      };
      
      // Only add opacity transition for showing-children phase
      if (animationPhase === "showing-children") {
        return {
          ...style,
          transition: `opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          opacity: 0,
        };
      }
      
      return style;
    }
    
    return null;
  };

  // Render node content with wrapper to maintain positioning during animations
  const renderNodeContentWithWrapper = (node: TreeNode, width: number, height: number, backgroundColor: string, isExpanding: boolean = false) => {
    // Common styling for the content wrapper
    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
      textAlign: 'center',
      padding: '4px',
      boxSizing: 'border-box',
    };
    
    // Apply different animations based on the animation phase
    if (isExpanding) {
      // For expanding nodes, maintain text size better
      if (animationPhase === "expanding") {
        // Start with no scaling and gradually adjust to the final scale
        // This keeps text from scaling too early in the animation
        wrapperStyle.animation = `content-adjust ${animationDuration}ms forwards cubic-bezier(0.4, 0, 0.2, 1)`;
        wrapperStyle.transformOrigin = 'center';
        wrapperStyle.willChange = 'transform';
      } else if (animationPhase === "expanded" || animationPhase === "showing-children") {
        // Same scale for both phases to avoid the "replacement" effect
        wrapperStyle.transform = `scale(var(--content-scale, 1))`;
        wrapperStyle.transformOrigin = 'center';
      }
    }

    return (
      <div style={wrapperStyle}>
        {renderNodeContent(node, width, height, backgroundColor)}
      </div>
    );
  };

  // Get styles for the children nodes
  const getChildNodeStyle = (node: HierarchyRectangularNode<TreeNode>, index: number) => {
    const backgroundColor = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    const width = node.x1 - node.x0;
    const height = node.y1 - node.y0;
    
    return {
      position: "absolute" as const,
      borderRadius: `${borderRadius}px`,
      backgroundColor,
      width,
      height,
      transform: `translate(${node.x0}px, ${node.y0}px) scale(0.8)`,
      transformOrigin: "center",
      zIndex: 100,
      overflow: "hidden",
      boxSizing: "border-box" as const,
      opacity: 0,
      animation: `fade-in-scale ${animationDuration}ms forwards ${index * 30}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      willChange: "opacity, transform",
    };
  };

  // Get styles for static nodes
  const getStaticNodeStyle = (node: HierarchyRectangularNode<TreeNode>) => {
    const backgroundColor = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    const width = node.x1 - node.x0;
    const height = node.y1 - node.y0;
    
    return {
      position: "absolute" as const,
      borderRadius: `${borderRadius}px`,
      backgroundColor,
      width,
      height,
      transform: `translate(${node.x0}px, ${node.y0}px)`,
      zIndex: 10,
      overflow: "hidden",
      boxSizing: "border-box" as const,
    };
  };

  const expandingNodeStyle = getExpandingNodeStyle();

  // Update the animation keyframes
  const keyframesStyles = `
    @keyframes expand-node {
      from {
        width: var(--initial-width);
        height: var(--initial-height);
        transform: translate(var(--initial-x), var(--initial-y));
      }
      to {
        width: var(--final-width);
        height: var(--final-height);
        transform: translate(var(--final-x), var(--final-y));
      }
    }
    
    @keyframes content-adjust {
      0% {
        /* Start with no scaling */
        transform: scale(1);
      }
      45% {
        /* Keep text close to original size longer */
        transform: scale(0.95);
      }
      100% {
        /* Final scale - gradual application */
        transform: scale(var(--content-scale, 1));
      }
    }
    
    @keyframes fade-in-scale {
      from {
        opacity: 0;
        transform: translate(var(--x), var(--y)) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translate(var(--x), var(--y)) scale(1);
      }
    }
  `;

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
      <style>
        {keyframesStyles}
      </style>

      {breadcrumbEnabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: paddingOuter,
            right: paddingOuter,
            zIndex: 300,
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

      <div
        style={{
          position: "absolute",
          top: breadcrumbEnabled ? TREE_MAP_CONSTANTS.BREADCRUMBS_HEIGHT : 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Render static nodes (idle state) */}
        {animationPhase === "idle" && nodes.map((node) => {
          const style = getStaticNodeStyle(node);
          return (
            <div
              key={node.data.id}
              style={style}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={(e) => handleMouseEvents(e, node)}
              onMouseMove={(e) => handleMouseEvents(e, node)}
              onMouseLeave={(e) => handleMouseEvents(e, node)}
            >
              {renderNodeContentWithWrapper(node.data, style.width, style.height, style.backgroundColor)}
            </div>
          );
        })}

        {/* Render the expanding/expanded node */}
        {clickedNode && expandingNodeStyle && (
          <div
            key={`expanding-${clickedNode.data.id}`}
            style={expandingNodeStyle}
          >
            {renderNodeContentWithWrapper(clickedNode.data, expandingNodeStyle.width as number, expandingNodeStyle.height as number, expandingNodeStyle.backgroundColor, true)}
          </div>
        )}

        {/* Render children nodes when they should appear */}
        {animationPhase === "showing-children" && nodes.map((node, index) => {
          const style = getChildNodeStyle(node, index);
          return (
            <div
              key={node.data.id}
              style={{
                ...style,
                "--x": `${node.x0}px`,
                "--y": `${node.y0}px`,
              } as React.CSSProperties}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={(e) => handleMouseEvents(e, node)}
              onMouseMove={(e) => handleMouseEvents(e, node)}
              onMouseLeave={(e) => handleMouseEvents(e, node)}
            >
              {renderNodeContentWithWrapper(node.data, style.width, style.height, style.backgroundColor)}
            </div>
          );
        })}
      </div>

      {tooltipEnabled && tooltip.data && (
        <Tooltip 
          node={tooltip.data} 
          position={{x: tooltip.x, y: tooltip.y}} 
          customTooltipPosition={customTooltipPosition} 
          customTooltipStyle={customTooltipStyle} 
          tooltipComponentRender={tooltipComponentRender} 
        />
      )}
    </div>
  );
};
