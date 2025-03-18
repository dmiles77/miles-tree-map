import React from 'react';
import { TreeNode } from '../interfaces/interfaces'

interface BreadcrumbsProps {
  history: TreeNode[];
  onNavigate: (index: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ history, onNavigate }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px', 
      padding: '4px 8px',
    }}>
      {history.map((node, idx) => (
        <React.Fragment key={node.id}>
          {idx > 0 && <span style={{ color: '#666' }}>/</span>}
          <button
            onClick={() => onNavigate(idx)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#007bff',
              padding: '4px 8px',
              fontSize: '14px',
            }}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;