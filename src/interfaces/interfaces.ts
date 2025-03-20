export interface TreeNode {
  id: string;
  name: string;
  value?: number;
  children?: TreeNode[];
  customData?: Record<string, unknown>;
}

export interface ICustomNodeProps {
  node: TreeNode;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  handleBack: (index: number) => void;
  history: Array<TreeNode>;
}

export interface ICustomTooltipProps {
  node: TreeNode;
  position?: XYPosition;
  containerWidth?: number;
  containerHeight?: number;
  calculatedPosition?: { left: number; top: number };
  tooltipPosition?: TooltipPosition;
}

export interface Position {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export type ColorRangeBehavior = "oneColor" | "gradient" | "discrete" | "transparent" | "borderOnly" | "random" | "randomRangeColor" | "wild" | "heatmap";

export type TooltipPosition = 
  | 'mouseRight' 
  | 'mouseTop' 
  | 'mouseBottom';

export interface XYPosition {
  x: number;
  y: number;
}

export interface ITooltip {
  x: number;
  y: number;
  data: TreeNode | null;
}
