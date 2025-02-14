interface TreeNode {
  id?: string;
  name: string;
  value: number;
  color?: string;
  extraProps?: Record<string, any>;
  children?: TreeNode[];
  parent?: TreeNode;
}

export const interpolateColor = (
  value: number, 
  min: number, 
  max: number, 
  colorRange: [string, string]
): string => {
  const percentage = (value - min) / (max - min);
  return `linear-gradient(90deg, ${colorRange[0]} ${percentage * 100}%, ${colorRange[1]})`;
};

export const calculateNodeColor = (
  node: TreeNode, 
  siblings: TreeNode[], 
  colorRange: [string, string]
): string => {
  if (node.color) return node.color;
  
  const totalValue = siblings.reduce((acc, n) => acc + n.value, 0);
  return interpolateColor(node.value, 0, totalValue, colorRange);
}; 