interface TreeNode {
    id?: string;
    name: string;
    value: number;
    color?: string;
    extraProps?: Record<string, any>;
    children?: TreeNode[];
    parent?: TreeNode;
}
export declare const interpolateColor: (value: number, min: number, max: number, colorRange: [string, string]) => string;
export declare const calculateNodeColor: (node: TreeNode, siblings: TreeNode[], colorRange: [string, string]) => string;
export {};
//# sourceMappingURL=colorUtils.d.ts.map