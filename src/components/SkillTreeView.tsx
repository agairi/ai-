import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Circle, CheckCircle2 } from 'lucide-react';
import type { SkillTreeNode } from '../data/skillTrees';

interface SkillTreeViewProps {
  tree: SkillTreeNode[];
  masteredNodes: Set<string>;
  onToggleMaster: (nodeId: string) => void;
}

const TreeNode: React.FC<{
  node: SkillTreeNode;
  level: number;
  masteredNodes: Set<string>;
  onToggleMaster: (nodeId: string) => void;
}> = ({ node, level, masteredNodes, onToggleMaster }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isMastered = masteredNodes.has(node.id);

  const childrenMasteredCount = hasChildren
    ? node.children!.filter((c) => masteredNodes.has(c.id)).length
    : 0;
  const childrenTotal = hasChildren ? node.children!.length : 0;

  return (
    <div className="tree-node">
      <div
        className={`tree-node-row ${isMastered ? 'mastered' : ''}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
      >
        {hasChildren ? (
          <button
            className="tree-expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span className="tree-node-leaf" />
        )}

        <button
          className="tree-node-check"
          onClick={() => onToggleMaster(node.id)}
          title={isMastered ? '标记为未掌握' : '标记为已掌握'}
        >
          {isMastered ? (
            <CheckCircle2 size={16} color="#22c55e" />
          ) : (
            <Circle size={16} color="#64748b" />
          )}
        </button>

        <span className="tree-node-name">{node.name}</span>

        {hasChildren && (
          <span className="tree-node-count">
            {childrenMasteredCount}/{childrenTotal}
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="tree-node-children">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              masteredNodes={masteredNodes}
              onToggleMaster={onToggleMaster}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  tree,
  masteredNodes,
  onToggleMaster,
}) => {
  const totalNodes = (() => {
    let count = 0;
    const walk = (nodes: SkillTreeNode[]) => {
      for (const n of nodes) {
        count++;
        if (n.children) walk(n.children);
      }
    };
    walk(tree);
    return count;
  })();

  const masteredCount = (() => {
    let count = 0;
    const walk = (nodes: SkillTreeNode[]) => {
      for (const n of nodes) {
        if (masteredNodes.has(n.id)) count++;
        if (n.children) walk(n.children);
      }
    };
    walk(tree);
    return count;
  })();

  const progress = totalNodes > 0 ? (masteredCount / totalNodes) * 100 : 0;

  return (
    <div className="skill-tree-view">
      <div className="skill-tree-header">
        <div className="skill-tree-progress">
          <div className="skill-tree-progress-text">
            知识点掌握进度：{masteredCount}/{totalNodes} ({progress.toFixed(0)}%)
          </div>
          <div className="skill-tree-progress-bar">
            <div
              className="skill-tree-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="skill-tree-content">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            masteredNodes={masteredNodes}
            onToggleMaster={onToggleMaster}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillTreeView;