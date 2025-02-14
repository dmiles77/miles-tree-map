import React from 'react';

interface TreeNode {
    id: string;
    name: string;
    value: number;
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
    backButtonPosition?: 'top-left' | 'top-right';
    padding?: number;
    borderRadius?: number;
    minDisplayValue?: number;
    defaultZoomLevel?: number;
    fontSizeScale?: number;
    tooltipEnabled?: boolean;
    minCustomComponentSize?: number;
}
declare const MilesTreeMap: React.FC<MilesTreeMapProps>;
//# sourceMappingURL=MilesTreeMap.d.ts.map

export { MilesTreeMap };
