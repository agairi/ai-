import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Briefcase,
  Sparkles,
  PlusCircle,
  FolderKanban,
  BookOpen,
  ListTodo,
  Download,
  Upload,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Brain,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../store';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onNewPlan: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'plans', label: '学习计划', icon: ListTodo },
  { id: 'calendar', label: '日历视图', icon: Calendar },
  { id: 'skills', label: '技能面板', icon: BookOpen },
  { id: 'careers', label: '职业路径', icon: Briefcase },
  { id: 'projectGoals', label: '项目目标', icon: FolderKanban },
  { id: 'ai', label: 'AI推荐', icon: Sparkles },
  { id: 'quiz', label: 'AI测验', icon: Brain },
  { id: 'report', label: '学习报告', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  onNewPlan,
  collapsed,
  onToggleCollapse,
}) => {
  const { exportData, importData, resetAllData } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importData(text);
        alert(ok ? '导入成功！' : '导入失败，文件格式错误');
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('确定要重置所有学习记录吗？\n\n将清空：学习计划、技能进度、学习记录、统计数据、测验记录等。\n\n此操作不可撤销，建议先导出备份！')) {
      resetAllData();
      alert('已重置所有学习记录');
    }
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setCurrentPage('ai');
      setSearchQuery('');
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          {collapsed ? '📚' : '📚 学习计划助手'}
        </h1>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? '展开' : '收起'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-search">
          <Search size={16} className="sidebar-search-icon" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setCurrentPage('ai')}
          />
        </div>
      )}
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button className="new-plan-btn" onClick={onNewPlan} title={collapsed ? '新建计划' : ''}>
          <PlusCircle size={20} />
          {!collapsed && <span>新建计划</span>}
        </button>
        {!collapsed && (
          <div className="sidebar-data-actions">
            <button className="data-btn" onClick={handleExport} title="导出数据">
              <Download size={16} />
              <span>导出</span>
            </button>
            <button className="data-btn" onClick={handleImport} title="导入数据">
              <Upload size={16} />
              <span>导入</span>
            </button>
            <button className="data-btn reset-btn" onClick={handleReset} title="重置数据">
              <RotateCcw size={16} />
              <span>重置</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};