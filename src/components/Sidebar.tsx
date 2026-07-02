import React from 'react';
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
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onNewPlan: () => void;
}

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'plans', label: '学习计划', icon: ListTodo },
  { id: 'calendar', label: '日历视图', icon: Calendar },
  { id: 'skills', label: '技能面板', icon: BookOpen },
  { id: 'careers', label: '职业路径', icon: Briefcase },
  { id: 'projectGoals', label: '项目目标', icon: FolderKanban },
  { id: 'ai', label: 'AI推荐', icon: Sparkles },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  onNewPlan,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>📚 学习计划助手</h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button className="new-plan-btn" onClick={onNewPlan}>
          <PlusCircle size={20} />
          <span>新建计划</span>
        </button>
      </div>
    </aside>
  );
};