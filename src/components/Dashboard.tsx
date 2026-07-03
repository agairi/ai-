import React, { useMemo } from 'react';
import {
  Clock,
  CheckCircle,
  Target,
  Flame,
  TrendingUp,
  BookOpen,
  Play,
  Calendar,
  Zap,
  Pause,
  Sparkles,
  ListTodo,
  Award,
  ChevronRight,
  Plus,
  Brain,
} from 'lucide-react';
import { useStore } from '../store';
import { formatDuration } from '../utils/skillLevels';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardProps {
  onNavigate?: (page: string) => void;
  onNewPlan?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onNewPlan }) => {
  const { plans, skills, stats, sessions, startTimer, stopTimer, isTimerRunning, currentTimerPlanId, currentTimerTaskId, toggleTask } = useStore();

  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter((t) => t.completed).length;
    return totalTasks > 0 && completedTasks < totalTasks;
  }).length;

  const topSkills = [...skills]
    .sort((a, b) => b.totalExp - a.totalExp)
    .slice(0, 5);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStudyTime = last7Days.map((date) => {
    const daySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
      return sessionDate === date;
    });
    const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
    return {
      date: date.slice(5),
      hours: Math.round((totalTime / 3600) * 10) / 10,
    };
  });

  // 今日待办
  const todayTodos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todos: { planId: string; planTitle: string; taskId: string; taskTitle: string; skillName?: string; skillColor?: string; dueDate?: string }[] = [];
    for (const plan of plans) {
      for (const task of plan.tasks) {
        if (task.completed) continue;
        // 有截止日期且是今天的，或没有截止日期但在活跃计划中
        if (task.dueDate && task.dueDate.split('T')[0] === today) {
          const skill = task.relatedSkillId ? skills.find((s) => s.id === task.relatedSkillId) : null;
          todos.push({
            planId: plan.id,
            planTitle: plan.title,
            taskId: task.id,
            taskTitle: task.title,
            skillName: skill?.name,
            skillColor: skill?.color,
            dueDate: task.dueDate,
          });
        }
      }
    }
    // 如果今天没有截止任务，取最近未完成的
    if (todos.length === 0) {
      for (const plan of plans) {
        for (const task of plan.tasks) {
          if (task.completed) continue;
          if (todos.length >= 5) break;
          const skill = task.relatedSkillId ? skills.find((s) => s.id === task.relatedSkillId) : null;
          todos.push({
            planId: plan.id,
            planTitle: plan.title,
            taskId: task.id,
            taskTitle: task.title,
            skillName: skill?.name,
            skillColor: skill?.color,
          });
        }
        if (todos.length >= 5) break;
      }
    }
    return todos.slice(0, 6);
  }, [plans, skills]);

  const todayTasks = plans.reduce((sum, plan) => {
    return sum + plan.tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return dueDate === today && !t.completed;
    }).length;
  }, 0);

  const totalSkillsWithExp = skills.filter((s) => s.totalExp > 0).length;

  // 学习热力图数据（最近12周）
  const heatmapData = useMemo(() => {
    const weeks: { date: string; minutes: number; level: number }[][] = [];
    const today = new Date();
    for (let w = 11; w >= 0; w--) {
      const week: { date: string; minutes: number; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];
        const dayMinutes = sessions
          .filter((s) => new Date(s.startTime).toISOString().split('T')[0] === dateStr)
          .reduce((sum, s) => sum + s.duration, 0) / 60;
        const level = dayMinutes === 0 ? 0 : dayMinutes < 30 ? 1 : dayMinutes < 60 ? 2 : dayMinutes < 120 ? 3 : 4;
        week.push({ date: dateStr, minutes: Math.round(dayMinutes), level });
      }
      weeks.push(week);
    }
    return weeks;
  }, [sessions]);

  const activePlan = plans.find((p) => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter((t) => t.completed).length;
    return totalTasks > 0 && completedTasks < totalTasks;
  });

  const firstPlan = plans[0];

  const handleQuickStart = () => {
    if (isTimerRunning) {
      stopTimer();
      return;
    }
    const planToUse = activePlan || firstPlan;
    if (!planToUse) return;
    const incompleteTaskWithSkill = planToUse.tasks.find(
      (t) => !t.completed && t.relatedSkillId
    );
    const incompleteTask = planToUse.tasks.find((t) => !t.completed);
    const taskId = incompleteTaskWithSkill?.id || incompleteTask?.id;
    startTimer(planToUse.id, taskId);
  };

  const currentTimerPlan = plans.find((p) => p.id === currentTimerPlanId);
  const currentTimerTask = currentTimerPlan?.tasks.find((t) => t.id === currentTimerTaskId);

  const weekTotalMinutes = heatmapData.flat().reduce((sum, d) => sum + d.minutes, 0);

  // 快速入口
  const quickActions = [
    { label: '新建计划', icon: Plus, color: '#3b82f6', page: 'plans', action: () => onNewPlan?.() },
    { label: '搜索技能', icon: Sparkles, color: '#8b5cf6', page: 'ai', action: () => onNavigate?.('ai') },
    { label: '技能面板', icon: BookOpen, color: '#22c55e', page: 'skills', action: () => onNavigate?.('skills') },
    { label: '学习报告', icon: Award, color: '#f59e0b', page: 'report', action: () => onNavigate?.('report') },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">仪表盘</h2>
          <p className="page-desc">欢迎回来，继续你的学习之旅吧！</p>
        </div>
        {plans.length > 0 && (
          <button className="quick-start-btn" onClick={handleQuickStart}>
            {isTimerRunning ? (
              <>
                <Pause size={18} />
                停止计时
                {currentTimerTask && (
                  <span className="timer-task-name"> · {currentTimerTask.title}</span>
                )}
              </>
            ) : (
              <>
                <Play size={18} />
                开始学习
              </>
            )}
          </button>
        )}
      </div>

      {/* 快速入口 */}
      <div className="quick-actions">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="quick-action-card"
              onClick={action.action}
            >
              <div className="quick-action-icon" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                <Icon size={20} />
              </div>
              <span className="quick-action-label">{action.label}</span>
              <ChevronRight size={16} className="quick-action-arrow" />
            </button>
          );
        })}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{formatDuration(stats.totalStudyTime)}</span>
            <span className="stat-label">总学习时长</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {stats.completedTasks}/{stats.totalTasks}
            </span>
            <span className="stat-label">完成任务</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {activePlans}/{totalPlans}
            </span>
            <span className="stat-label">进行中计划</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.currentStreak}天</span>
            <span className="stat-label">连续学习</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf6' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalSkillsWithExp}</span>
            <span className="stat-label">在学技能</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec4899' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayTasks}</span>
            <span className="stat-label">今日待办</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <TrendingUp size={20} />
                最近7天学习时长
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailyStudyTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} 小时`, '学习时长']}
                  />
                  <Bar dataKey="hours" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 今日待办清单 */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <ListTodo size={20} />
                今日待办
              </h3>
              {todayTodos.length > 0 && (
                <span className="todo-count">{todayTodos.length} 项</span>
              )}
            </div>
            <div className="today-todo-list">
              {todayTodos.map((todo) => (
                <div key={todo.taskId} className="today-todo-item">
                  <button
                    className="todo-checkbox"
                    onClick={() => toggleTask(todo.planId, todo.taskId)}
                    title="标记完成"
                  />
                  <div className="todo-content">
                    <span className="todo-title">{todo.taskTitle}</span>
                    <span className="todo-plan">{todo.planTitle}</span>
                  </div>
                  {todo.skillName && (
                    <span
                      className="todo-skill-tag"
                      style={{ backgroundColor: todo.skillColor || '#3b82f6' }}
                    >
                      {todo.skillName}
                    </span>
                  )}
                </div>
              ))}
              {todayTodos.length === 0 && (
                <div className="empty-state">
                  <Brain size={40} />
                  <p>今天没有待办任务</p>
                  <button className="empty-action-btn" onClick={() => onNewPlan?.()}>
                    <Plus size={16} /> 创建学习计划
                  </button>
                </div>
              )}
            </div>
          </div>

          {activePlan && (
            <div className="active-plan-card">
              <div className="active-plan-header">
                <h3>
                  <Zap size={20} style={{ color: '#f59e0b' }} />
                  当前学习计划
                </h3>
              </div>
              <div className="active-plan-body">
                <h4>{activePlan.title}</h4>
                <p className="plan-desc">{activePlan.description || '暂无描述'}</p>
                <div className="plan-progress">
                  <div className="progress-bar large">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${activePlan.tasks.length > 0
                          ? (activePlan.tasks.filter(t => t.completed).length / activePlan.tasks.length) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {activePlan.tasks.filter(t => t.completed).length}/{activePlan.tasks.length} 任务完成
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-side">
          {/* 学习热力图 */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <Flame size={20} />
                学习热力图
              </h3>
              <span className="heatmap-total">12周 · {Math.round(weekTotalMinutes)}分钟</span>
            </div>
            <div className="heatmap-container">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="heatmap-week">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`heatmap-cell level-${day.level}`}
                      title={`${day.date}: ${day.minutes}分钟`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>少</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} className={`heatmap-cell level-${l}`} />
              ))}
              <span>多</span>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <BookOpen size={20} />
                技能排行榜
              </h3>
            </div>
            <div className="skill-rank-list">
              {topSkills.map((skill, index) => (
                <div key={skill.id} className="skill-rank-item">
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <div
                    className="skill-color"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">Lv.{skill.level}</span>
                </div>
              ))}
              {topSkills.length === 0 && (
                <div className="empty-state-sm">
                  <BookOpen size={32} />
                  <p>还没有技能经验，开始学习吧！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
