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

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentNode,
  rootNode,
  onNavigate,
  backButtonEnabled = true,
  backButtonPosition = 'top-left',
}) => {
  const path = React.useMemo(() => {
    const result: TreeNode[] = [];
    let node: TreeNode | undefined = currentNode;
    
    while (node) {
      result.unshift(node);
      node = node.parent;
    }
    
    return result;
  }, [currentNode]);

  return (
    <div className="breadcrumb">
      <div className="path">
        {path.map((node, index) => (
          <React.Fragment key={node.id}>
            {index > 0 && <span className="separator">/</span>}
            <span 
              className="crumb"
              onClick={() => onNavigate(node)}
            >
              {node.name}
            </span>
          </React.Fragment>
        ))}
      </div>
      {currentNode.id !== rootNode.id && backButtonEnabled && (
        <button 
          onClick={() => currentNode.parent && onNavigate(currentNode.parent)}
          className={backButtonPosition}
        >
          Back
        </button>
      )}
    </div>
  );
}; 