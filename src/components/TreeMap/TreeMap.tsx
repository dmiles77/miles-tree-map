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
  renderComponent?: (componentProps: ICustomNodeProps) => React.ReactElement;
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
      setHistory((prev: TreeNode[]) => [...prev, currentNode]);
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
    setHistory((prev: TreeNode[]) => prev.slice(0, index));
  };

  const handleMouseEvents = (e: React.MouseEvent<HTMLDivElement>, node: HierarchyRectangularNode<TreeNode>) => {
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
    
    // Ensure dimensions are valid numbers
    const validWidth = isNaN(numWidth) ? 0 : Math.max(0, numWidth);
    const validHeight = isNaN(numHeight) ? 0 : Math.max(0, numHeight);
    
    return renderComponent ? (
      renderComponent({
        node,
        width: validWidth,
        height: validHeight,
        backgroundColor: backgroundColor || 'transparent',
        handleBack,
        history
      })
    ) : (
      <DefaultNode
        node={node}
        width={validWidth}
        height={validHeight}
        backgroundColor={backgroundColor || 'transparent'}
        handleBack={handleBack}
        history={history}
        backButtonEnabled={!!backButtonEnabled}
      />
    );
  };

  // Get styles for the children nodes
  const getChildrenNodeStyle = (node: HierarchyRectangularNode<TreeNode>, index: number) => {
    const colorResult = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    
    return getChildNodeStyle(
      node.x0,
      node.y0,
      node.x1,
      node.y1,
      colorResult,
      borderRadius,
      animationDuration,
      index
    );
  };

  // Get styles for static nodes
  const getStaticNodeBaseStyle = (node: HierarchyRectangularNode<TreeNode>) => {
    const colorResult = getNodeColor(node, nodes, colorRange, colorRangeBehavior);
    
    return getStaticNodeStyle(
      node.x0,
      node.y0,
      node.x1,
      node.y1,
      colorResult,
      borderRadius
    );
  };

  // Get expanding node style
  const getExpandingNodeStyle = () => {
    if (!clickedNode) return null;
    
    const bounds = getTreeMapBounds();
    const colorResult = getNodeColor(clickedNode, nodes, colorRange, colorRangeBehavior);
    
    // For border-only mode, hide the parent border when showing children
    // This prevents double borders being visible
    const modifiedColorResult = {
      ...colorResult,
      borderColor: animationPhase === TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN 
        ? undefined 
        : colorResult.borderColor
    };
    
    // Starting position - ensure values are valid
    const initialStyles = {
      x: isNaN(clickedNode.x0) ? 0 : clickedNode.x0,
      y: isNaN(clickedNode.y0) ? 0 : clickedNode.y0,
      width: Math.max(1, isNaN(clickedNode.x1 - clickedNode.x0) ? 0 : clickedNode.x1 - clickedNode.x0),
      height: Math.max(1, isNaN(clickedNode.y1 - clickedNode.y0) ? 0 : clickedNode.y1 - clickedNode.y0),
    };
    
    // Final position - ensure values are valid
    const finalStyles = {
      x: isNaN(bounds.x) ? 0 : bounds.x,
      y: isNaN(bounds.y) ? 0 : bounds.y,
      width: Math.max(1, isNaN(bounds.width) ? 100 : bounds.width),
      height: Math.max(1, isNaN(bounds.height) ? 100 : bounds.height),
    };
    
    // Calculate content scaling factor based on size difference
    // We need to maintain visual consistency, so we'll use a more moderate scaling approach
    const initialArea = initialStyles.width * initialStyles.height;
    const finalArea = finalStyles.width * finalStyles.height;
    
    // Use square root of area ratio for a more balanced scaling
    // This preserves the content size better during expansion
    // Ensure we don't get NaN values
    let areaRatio = 1;
    if (initialArea > 0 && finalArea > 0 && !isNaN(initialArea) && !isNaN(finalArea)) {
      areaRatio = Math.sqrt(finalArea / initialArea);
    }
    
    // Use a less dramatic scaling factor - closer to 1.0 means less scaling
    // 0.85 is a good balance - it prevents text from shrinking too much
    let contentScale = 0.85;
    if (!isNaN(areaRatio) && areaRatio > 0) {
      contentScale = Math.min(Math.max(0.85, 1 / Math.sqrt(areaRatio)), 1);
    }
    
    return getExpandingNodeStyles(
      initialStyles,
      finalStyles,
      modifiedColorResult,
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
        {animationPhase === TREE_MAP_CONSTANTS.ANIMATION_PHASE.IDLE && nodes.length > 0 && nodes.map((node: HierarchyRectangularNode<TreeNode>) => {
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

        {/* Render the expanding/expanded node - but hide when showing children */}
        {clickedNode && expandingNodeStyle && animationPhase !== TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN && (
          <div
            key={`expanding-${clickedNode.data.id}`}
            style={expandingNodeStyle}
          >
            {renderNodeContentWithWrapper(clickedNode.data, expandingNodeStyle.width as number, expandingNodeStyle.height as number, expandingNodeStyle.backgroundColor)}
          </div>
        )}

        {/* Render children nodes when they should appear */}
        {animationPhase === TREE_MAP_CONSTANTS.ANIMATION_PHASE.SHOWING_CHILDREN && nodes.length > 0 && nodes.map((node: HierarchyRectangularNode<TreeNode>, index: number) => {
          const style = getChildrenNodeStyle(node, index);
          const safeX0 = isNaN(node.x0) ? 0 : node.x0;
          const safeY0 = isNaN(node.y0) ? 0 : node.y0;
          
          return (
            <div
              key={node.data.id}
              style={{
                ...style,
                "--x": `${safeX0}px`,
                "--y": `${safeY0}px`,
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
