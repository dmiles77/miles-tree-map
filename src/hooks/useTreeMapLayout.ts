import { useState, useMemo, useEffect } from 'react';
import { hierarchy, treemap } from "d3-hierarchy";
import { TreeNode } from '../interfaces/inferfaces';

interface UseTreeMapLayoutProps {
  currentNode: TreeNode;
  dimensions: { width: number; height: number };
  minDisplayValue: number;
  paddingInner: number;
  paddingOuter: number;
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
  minDisplayValue,
  paddingInner,
  paddingOuter
}: UseTreeMapLayoutProps) => {
  const [prevLayout, setPrevLayout] = useState<LayoutCache>({});

  const nodes = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return [];

    const root = hierarchy(currentNode)
      .sum((d) => d.children?.length ? 0 : Math.max(d.value || 0, minDisplayValue))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treeMapLayout = treemap<TreeNode>()
      .size([dimensions.width, dimensions.height])
      .paddingOuter(paddingOuter)
      .paddingInner(paddingInner)
      .round(false);

    const layoutRoot = treeMapLayout(root);
    return layoutRoot.children || [];
  }, [currentNode, dimensions, minDisplayValue, paddingInner, paddingOuter]);

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