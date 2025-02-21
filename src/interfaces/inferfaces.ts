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
  handleBack: (index: number) => void;
  history: Array<{ node: TreeNode; position: Position }>;
}

export interface ICustomTooltipProps {
  node: TreeNode;
  position?: XYPosition;
}

export interface Position {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export type ColorRangeBehavior = "oneColor" | "gradient" | "discrete" | "transparent" | "borderOnly" | "patternFill" | "heatmap";

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
  data: TreeNode;
}
