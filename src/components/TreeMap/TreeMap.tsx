import React, { useRef, useState, useEffect } from "react";
import { HierarchyRectangularNode } from "d3-hierarchy";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import DefaultNode from "../DefaultNode/DefaultNode";
import Tooltip from "../Tooltip/Tooltip";
import {
  TreeNode,
  ColorRangeBehavior,
  TooltipPosition,
  ICustomNodeProps,
  ICustomTooltipProps,
  ITooltip
} from "../../interfaces/interfaces";
import { TREE_MAP_CONSTANTS, AnimationPhase } from '../../constants/treeMap';
import { useTreeMapLayout } from '../../hooks/useTreeMapLayout';
import { useTreeMapColors } from '../../hooks/useTreeMapColors';
import {
  containerStyles,
  getBreadcrumbsContainerStyles,
  getTreeMapContentStyles,
  getStaticNodeStyle,
  getChildNodeStyle,
  getNodeContentWrapperStyle,
  getExpandingNodeStyles,
  keyframesStyles
} from './treeMap.styles';

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
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>(TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE);
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
    if (!layoutNode.data.children?.length || animationPhase !== TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE) return;

    // Start the expansion animation
    setAnimationPhase(TREE_MAP_CONSTANTS.ANIMATION_PHASE.EXPANDING);
    setClickedNode(layoutNode);

    // After expansion animation completes, update the state
    setTimeout(() => {
      // Expansion completed - update the data model
      setAnimationPhase(TREE_MAP_CONSTANTS.ANIMATION_PHASE.EXPANDED);
      setHistory(prev => [...prev, currentNode]);
      setCurrentNode(layoutNode.data);
      
      // Short delay to ensure the expand animation completes fully before children appear
      setTimeout(() => {
        setAnimationPhase(TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN);
        
        // Reset after children appear
        setTimeout(() => {
          setClickedNode(null);
          setAnimationPhase(TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE);
        }, animationDuration);
      }, 50); // Small delay to ensure clean transition 
    }, animationDuration);
    
    onNodeClick?.(layoutNode.data);
  };

  const handleBack = (index: number) => {
    if (index === history.length || animationPhase !== TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE) return;
    
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

  const renderNodeContent = (node: TreeNode, width: number | string | undefined, height: number | string | undefined, backgroundColor: string | undefined) => {
    // Convert width and height to numbers for calculations if they're strings
    const numWidth = typeof width === 'string' ? parseFloat(width) : (width || 0);
    const numHeight = typeof height === 'string' ? parseFloat(height) : (height || 0);
    
    return renderComponent ? (
      renderComponent({
        node,
        width: numWidth,
        height: numHeight,
        backgroundColor: backgroundColor || 'transparent',
        handleBack,
        history
      })
    ) : (
      <DefaultNode
        node={node}
        width={numWidth}
        height={numHeight}
        backgroundColor={backgroundColor || 'transparent'}
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
    
    return getExpandingNodeStyles(
      initialStyles,
      finalStyles,
      backgroundColor,
      borderRadius,
      contentScale,
      animationPhase,
      animationDuration
    );
  };

  // Render node content with wrapper to maintain positioning during animations
  const renderNodeContentWithWrapper = (node: TreeNode, width: number | string | undefined, height: number | string | undefined, backgroundColor: string | undefined, isExpanding: boolean = false) => {
    const wrapperStyle = getNodeContentWrapperStyle(isExpanding, animationPhase, animationDuration);
    
    return (
      <div style={wrapperStyle}>
        {renderNodeContent(node, width, height, backgroundColor)}
      </div>
    );
  };

  // Get styles for the children nodes
  const getChildrenNodeStyle = (node: HierarchyRectangularNode<TreeNode>, index: number) => {
    const backgroundColor = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    
    return getChildNodeStyle(
      node.x0,
      node.y0,
      node.x1,
      node.y1,
      backgroundColor,
      borderRadius,
      animationDuration,
      index
    );
  };

  // Get styles for static nodes
  const getStaticNodeBaseStyle = (node: HierarchyRectangularNode<TreeNode>) => {
    const backgroundColor = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    
    return getStaticNodeStyle(
      node.x0,
      node.y0,
      node.x1,
      node.y1,
      backgroundColor,
      borderRadius
    );
  };

  const expandingNodeStyle = getExpandingNodeStyle();

  return (
    <div
      ref={containerRef}
      style={containerStyles}
    >
      <style>
        {keyframesStyles}
      </style>

      {breadcrumbEnabled && (
        <div style={getBreadcrumbsContainerStyles(paddingOuter)}>
          <Breadcrumbs
            history={[...history, currentNode]}
            onNavigate={handleBack}
          />
        </div>
      )}

      <div style={getTreeMapContentStyles(breadcrumbEnabled, TREE_MAP_CONSTANTS.BREADCRUMBS_HEIGHT)}>
        {/* Render static nodes (idle state) */}
        {animationPhase === TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE && nodes.map((node) => {
          const style = getStaticNodeBaseStyle(node);
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
        {animationPhase === TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN && nodes.map((node, index) => {
          const style = getChildrenNodeStyle(node, index);
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
