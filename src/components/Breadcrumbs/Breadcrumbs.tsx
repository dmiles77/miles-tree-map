import React from 'react';
import { TreeNode } from '../../interfaces/interfaces';
import {
  breadcrumbsContainerStyle,
  separatorStyle,
  breadcrumbButtonStyle
} from './breadcrumb.styles';

interface BreadcrumbsProps {
  history: TreeNode[];
  onNavigate: (index: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ history, onNavigate }) => {
  return (
    <div style={breadcrumbsContainerStyle}>
      {history.map((node, idx) => (
        <React.Fragment key={node.id}>
          {idx > 0 && <span style={separatorStyle}>/</span>}
          <button
            onClick={() => onNavigate(idx)}
            style={breadcrumbButtonStyle}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;