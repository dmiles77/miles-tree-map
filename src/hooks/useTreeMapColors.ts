import { scaleLinear } from "d3-scale";
import { HierarchyRectangularNode } from "d3-hierarchy";
import { TreeNode, ColorRangeBehavior } from '../interfaces/interfaces';
import { TREE_MAP_CONSTANTS } from '../constants/treeMap';

// Utility functions for color manipulation
const hexToRGB = (hex: string) => {
  const cleanHex = hex.replace("#", "");
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16)
  };
};

const interpolateColor = (start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, t: number) => {
  return {
    r: Math.round(start.r + (end.r - start.r) * t),
    g: Math.round(start.g + (end.g - start.g) * t),
    b: Math.round(start.b + (end.b - start.b) * t)
  };
};

export const useTreeMapColors = () => {
  const getNodeColor = (
    node: HierarchyRectangularNode<TreeNode>,
    nodes: HierarchyRectangularNode<TreeNode>[],
    colorRange: string[],
    colorRangeBehavior: ColorRangeBehavior
  ) => {
    if (!node || !nodes.length) return colorRange[0];

    switch (colorRangeBehavior) {
      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.ONE_COLOR:
        return colorRange[0];

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.GRADIENT: {
        const maxValue = Math.max(...nodes.map((n) => n.value || 0));
        const colorScale = scaleLinear<string>()
          .domain([0, maxValue])
          .range(colorRange as [string, string]);
        return colorScale(node.value || 0);
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.DISCRETE: {
        const index = nodes.indexOf(node);
        const step = Math.floor((index * (colorRange.length - 1)) / (nodes.length - 1));
        return colorRange[step];
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.TRANSPARENT:
        return "transparent";

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.BORDER_ONLY:
        return "transparent";

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.PATTERN_FILL:
        return `repeating-linear-gradient(45deg, ${colorRange[0]}, ${colorRange[0]} 10px, ${colorRange[1]} 10px, ${colorRange[1]} 20px)`;

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.HEATMAP: {
        const maxValue = Math.max(...nodes.map((n) => n.value || 0));
        const normalizedValue = Math.log1p(node.value || 0) / Math.log1p(maxValue);
        
        const targetColor = hexToRGB(colorRange[0]);
        const darkColor = {
          r: Math.round(targetColor.r * 0.2),
          g: Math.round(targetColor.g * 0.2),
          b: Math.round(targetColor.b * 0.2)
        };
        
        const t = Math.pow(normalizedValue, 0.7);
        const finalColor = interpolateColor(darkColor, targetColor, t);
        
        return `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`;
      }

      default:
        return colorRange[0];
    }
  };

  return { getNodeColor };
}; 