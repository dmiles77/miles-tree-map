import { scaleLinear } from "d3-scale";
import { HierarchyRectangularNode } from "d3-hierarchy";
import { TreeNode, ColorRangeBehavior } from '../interfaces/interfaces';
import { TREE_MAP_CONSTANTS } from '../constants/treeMap';

export const useTreeMapColors = () => {
  const getNodeColor = (
    node: HierarchyRectangularNode<TreeNode>,
    nodes: HierarchyRectangularNode<TreeNode>[],
    colorRange: string[],
    colorRangeBehavior: ColorRangeBehavior
  ) => {
    switch (colorRangeBehavior) {
        case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.ONE_COLOR:
          return colorRange[0];
        case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.GRADIENT: {
          const colorScale = scaleLinear<string>()
            .domain([0, Math.max(...nodes.map((n) => n.value || 0))])
            .range(colorRange as [string, string]);
          return colorScale(node.value || 0);
        }
        case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.DISCRETE: {
          const index = nodes.indexOf(node);
          const step = Math.floor(
            (index * (colorRange.length - 1)) / (nodes.length - 1)
          );
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
          
          // Normalize value between 0 and 1 using log scale for better distribution
          const normalizedValue = Math.log1p(node.value || 0) / Math.log1p(maxValue);
          
          // Convert hex to RGB for the target color
          const hex = colorRange[0].replace("#", "");
          const targetR = parseInt(hex.substring(0, 2), 16);
          const targetG = parseInt(hex.substring(2, 4), 16);
          const targetB = parseInt(hex.substring(4, 6), 16);
          
          // Create darker version of the color for minimum values
          const darkR = Math.round(targetR * 0.2); // Keep 20% of original color
          const darkG = Math.round(targetG * 0.2);
          const darkB = Math.round(targetB * 0.2);
          
          // Interpolate between dark and target color based on normalized value
          // Using a power function to enhance contrast in mid-range
          const t = Math.pow(normalizedValue, 0.7); // Adjust power for contrast
          
          const finalR = Math.round(darkR + (targetR - darkR) * t);
          const finalG = Math.round(darkG + (targetG - darkG) * t);
          const finalB = Math.round(darkB + (targetB - darkB) * t);
          
          return `rgb(${finalR}, ${finalG}, ${finalB})`;
        }
        default:
          return colorRange[0];
      }
  };

  return { getNodeColor };
}; 