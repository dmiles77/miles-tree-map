import * as React from 'react';
import './Breadcrumb.scss';
interface TreeNode {
    id: string;
    name: string;
    value: number;
    parent?: TreeNode;
    children?: TreeNode[];
}
interface BreadcrumbProps {
    currentNode: TreeNode;
    rootNode: TreeNode;
    onNavigate: (node: TreeNode) => void;
    backButtonEnabled?: boolean;
    backButtonPosition?: 'top-left' | 'top-right';
}
export declare const Breadcrumb: React.FC<BreadcrumbProps>;
export {};
//# sourceMappingURL=Breadcrumb.d.ts.map