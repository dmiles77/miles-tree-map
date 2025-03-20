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

// Simple string hash function to create deterministic "random" values
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Return type for getNodeColor
export interface NodeColorResult {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
}

export const useTreeMapColors = () => {
  const getNodeColor = (
    node: HierarchyRectangularNode<TreeNode>,
    nodes: HierarchyRectangularNode<TreeNode>[],
    colorRange: string[],
    colorRangeBehavior: ColorRangeBehavior
  ): NodeColorResult => {
    if (!node || !nodes.length) return { backgroundColor: colorRange[0] };

    switch (colorRangeBehavior) {
      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.ONE_COLOR:
        return { backgroundColor: colorRange[0] };

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.GRADIENT: {
        const maxValue = Math.max(...nodes.map((n) => n.value || 0));
        const colorScale = scaleLinear<string>()
          .domain([0, maxValue])
          .range(colorRange as [string, string]);
        return { backgroundColor: colorScale(node.value || 0) };
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.DISCRETE: {
        const index = nodes.indexOf(node);
        const step = Math.floor((index * (colorRange.length - 1)) / (nodes.length - 1));
        return { backgroundColor: colorRange[step] };
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.TRANSPARENT:
        return { backgroundColor: "transparent" };

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.BORDER_ONLY: {
        const index = nodes.indexOf(node);
        const step = Math.floor((index * (colorRange.length - 1)) / (nodes.length - 1));
        const borderColor = colorRange[step] || colorRange[0];
        return { 
          backgroundColor: "transparent", 
          borderColor, 
          borderWidth: 1 
        };
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.RANDOM: {
        // Select a random color from our predefined schemes
        // We use the root node ID to ensure consistency for this TreeMap
        const rootNodeId = nodes[0]?.data?.id || 'default-seed';
        const rootSeed = Math.abs(hashCode(rootNodeId));
        
        // Pick a random scheme
        const schemeIndex = rootSeed % TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES.length;
        const selectedScheme = TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES[schemeIndex];
        
        // Pick a single color from the scheme
        const colorIndex = (rootSeed >> 4) % selectedScheme.length; // Use a bit-shifted seed for a different value
        const randomColor = selectedScheme[colorIndex];
        
        // Use one color behavior - all nodes get the same color
        return { 
          backgroundColor: randomColor,
          borderColor: randomColor, 
          borderWidth: 1 
        };
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.RANDOM_RANGE_COLOR: {
        // Select two random colors from our predefined schemes for gradient
        const rootNodeId = nodes[0]?.data?.id || 'default-seed';
        const rootSeed = Math.abs(hashCode(rootNodeId));
        
        // Pick a random scheme
        const schemeIndex = rootSeed % TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES.length;
        const selectedScheme = TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES[schemeIndex];
        
        // Always use the first color and the last color from the scheme
        // This ensures a good range of colors for the gradient
        const color1 = hexToRGB(selectedScheme[0]); // First color in scheme
        const color2 = hexToRGB(selectedScheme[selectedScheme.length - 1]); // Last color in scheme
        
        // Use heatmap-like logic with these two colors from the preset scheme
        const maxValue = Math.max(...nodes.map((n) => n.value || 0));
        const normalizedValue = Math.log1p(node.value || 0) / Math.log1p(maxValue);
        
        // Interpolate between the two colors based on node value
        const t = Math.pow(normalizedValue, 0.7);
        const finalColor = interpolateColor(color2, color1, t);
        
        return { 
          backgroundColor: `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`,
          borderColor: `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
          borderWidth: 1
        };
      }

      case TREE_MAP_CONSTANTS.COLOR_RANGE_BEHAVIOR.WILD: {
        // Select one of the predefined wild color schemes based on the root node ID
        const rootNodeId = nodes[0]?.data?.id || 'default-seed';
        const rootSeed = Math.abs(hashCode(rootNodeId));
        
        // Select a color scheme using the root seed
        const schemeIndex = rootSeed % TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES.length;
        const selectedScheme = TREE_MAP_CONSTANTS.WILD_COLOR_SCHEMES[schemeIndex];
        
        // Get a random color from the scheme for this specific node
        // We use both the root ID and node ID to create a unique but consistent color for each node
        const combinedSeed = Math.abs(hashCode(rootNodeId + node.data.id));
        const colorIndex = combinedSeed % selectedScheme.length;
        const wildColor = selectedScheme[colorIndex];
        
        // Use slightly darker version of the same color for the border
        const colorRGB = hexToRGB(wildColor);
        const darkerBorder = `rgb(${Math.floor(colorRGB.r * 0.8)}, ${Math.floor(colorRGB.g * 0.8)}, ${Math.floor(colorRGB.b * 0.8)})`;
        
        return {
          backgroundColor: wildColor,
          borderColor: darkerBorder,
          borderWidth: 1
        };
      }

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
        
        return { backgroundColor: `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})` };
      }

      default:
        return { backgroundColor: colorRange[0] };
    }
  };

  return { getNodeColor };
}; 