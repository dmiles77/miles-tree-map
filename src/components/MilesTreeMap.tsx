import * as React from "react";
import { useState } from "react";
import "./MilesTreeMap.scss";

interface TreeNode {
  id?: string;
  name: string;
  value: number;
  extraProps?: Record<string, any>;
  children?: TreeNode[];
}

interface MilesTreeMapProps {
  data: TreeNode;
  renderComponent?: (node: TreeNode) => React.ReactElement;
  colorRange?: [string, string];
  onNodeClick?: (node: TreeNode) => void;
  animationDuration?: number;
  breadcrumbEnabled?: boolean;
  backButtonEnabled?: boolean;
  backButtonPosition?: "top-left" | "top-right";
  padding?: number;
  borderRadius?: number;
  minDisplayValue?: number;
  defaultZoomLevel?: number;
  fontSizeScale?: number;
  tooltipEnabled?: boolean;
  minCustomComponentSize?: number;
}

const generateId = (parentId: string, name: string): string => {
  return `${parentId}-${name.replace(/\s+/g, "_")}-${Math.random().toString(36).substr(2, 9)}`;
};

const preprocessTree = (node: TreeNode, level = 0, parentId = "root"): TreeNode => {
  const id = node.id || generateId(parentId, node.name);
  return {
    ...node,
    id,
    extraProps: node.extraProps || {},
    children: node.children ? node.children.map((child) => preprocessTree(child, level + 1, id)) : [],
  };
};

const renderNodeContent = (node: TreeNode, renderComponent?: (node: TreeNode) => React.ReactElement, minCustomComponentSize?: number, sizePercentage?: number) => {
  if (sizePercentage !== undefined && sizePercentage >= (minCustomComponentSize || 0) && renderComponent) {
    return renderComponent(node);
  }
  return defaultNodeComponent(node);
};

const defaultNodeComponent = (node: TreeNode) => (
  <div className="default-node">
    <span className="node-text">{node.name} ({node.value})</span>
  </div>
);

const interpolateColor = (value: number, min: number, max: number, colorRange: [string, string]) => {
  const percentage = (value - min) / (max - min);
  return `linear-gradient(90deg, ${colorRange[0]} ${percentage * 100}%, ${colorRange[1]})`;
};

const MilesTreeMap = ({
  data,
  renderComponent,
  colorRange = ["#f00", "#0f0"],
  onNodeClick,
  animationDuration = 300,
  breadcrumbEnabled = true,
  backButtonEnabled = true,
  backButtonPosition = "top-left",
  padding = 5,
  borderRadius = 5,
  minDisplayValue = 0,
  fontSizeScale = 1,
  tooltipEnabled = true,
  minCustomComponentSize = 50,
}: MilesTreeMapProps): React.ReactElement => {
  const [tree, setTree] = useState<TreeNode>(preprocessTree(data));
  const [currentNode, setCurrentNode] = useState<TreeNode>(tree);
  
  const handleNodeClick = (node: TreeNode) => {
    if (node.children && node.children.length > 0) {
      setCurrentNode(node);
    }
    if (onNodeClick) onNodeClick(node);
  };

  const handleBackClick = () => {
    if (currentNode.id !== tree.id) {
      const parent = findParent(tree, currentNode.id!);
      if (parent) setCurrentNode(parent);
    }
  };

  const findParent = (node: TreeNode, childId: string): TreeNode | null => {
    if (!node.children) return null;
    for (const child of node.children) {
      if (child.id === childId) return node;
      const found = findParent(child, childId);
      if (found) return found;
    }
    return null;
  };

  return (
    <div className="miles-tree-map">
      {breadcrumbEnabled && (
        <div className="breadcrumb">
          {currentNode.name} {currentNode.id !== tree.id && backButtonEnabled && <button onClick={handleBackClick} className={backButtonPosition}>{"Back"}</button>}
        </div>
      )}
      <div className="tree-container">
        {currentNode.children?.map((node) => {
          if (node.value < minDisplayValue) return null;
          const totalValue = currentNode.children!.reduce((acc, n) => acc + n.value, 0);
          const sizePercentage = (node.value / totalValue) * 100;
          const backgroundColor = interpolateColor(node.value, 0, totalValue, colorRange);
          
          return (
            <div
              key={node.id}
              className="tree-node"
              style={{
                width: `${sizePercentage}%`,
                background: backgroundColor,
                borderRadius,
                padding,
                fontSize: `${fontSizeScale}rem`,
                transition: `all ${animationDuration}ms ease-in-out`,
              }}
              onClick={() => handleNodeClick(node)}
              title={tooltipEnabled ? `${node.name} (${node.value})` : undefined}
            >
              {renderNodeContent(node, renderComponent, minCustomComponentSize, sizePercentage)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilesTreeMap;
