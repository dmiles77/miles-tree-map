import { useState, useMemo, useEffect } from 'react';
import { hierarchy, treemap } from "d3-hierarchy";
import { TreeNode } from '../interfaces/inferfaces';
import { TREE_MAP_CONSTANTS } from '../constants/treeMap';

interface UseTreeMapLayoutProps {
  currentNode: TreeNode;
  dimensions: { width: number; height: number };
  paddingInner: number;
  paddingOuter: number;
  breadcrumbEnabled?: boolean;
}

interface LayoutCache {
  [key: string]: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export const useTreeMapLayout = ({
  currentNode,
  dimensions,
  paddingInner,
  paddingOuter,
  breadcrumbEnabled = false
}: UseTreeMapLayoutProps) => {
  const [prevLayout, setPrevLayout] = useState<LayoutCache>({});

  const nodes = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return [];

    const effectiveHeight = dimensions.height - (breadcrumbEnabled ? TREE_MAP_CONSTANTS.BREADCRUMBS_HEIGHT : 0);

    const root = hierarchy(currentNode)
      .sum((d) => d.children?.length ? 0 : Math.max(d.value || 0))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treeMapLayout = treemap<TreeNode>()
      .size([dimensions.width, effectiveHeight])
      .paddingOuter(paddingOuter)
      .paddingInner(paddingInner)
      .round(false);

    const layoutRoot = treeMapLayout(root);
    return layoutRoot.children || [];
  }, [currentNode, dimensions, paddingInner, paddingOuter, breadcrumbEnabled]);

  useEffect(() => {
    const newLayout: LayoutCache = {};
    nodes.forEach(node => {
      newLayout[node.data.id] = {
        x0: node.x0,
        y0: node.y0,
        x1: node.x1,
        y1: node.y1,
      };
    });
    setPrevLayout(newLayout);
  }, [nodes]);

  return { nodes, prevLayout };
}; 