import React, { useState, useMemo } from 'react';
import { Target, Star, Clock, CheckSquare, Award, Check, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { PROJECT_GOALS } from '../data/projectGoals';
import { CAREER_PROJECTS } from '../data/careerProjects';
import type { ProjectGoal } from '../data/projectGoals';
import { SKILLS_WITH_META } from '../data/skillsAndCareers';
import { useStore } from '../store';
import { EXP_CONFIG } from '../utils/skillLevels';

const ALL_PROJECTS = [...PROJECT_GOALS, ...CAREER_PROJECTS];

const SKILL_NAME_MAP: Record<string, string> = SKILLS_WITH_META.reduce((acc, s) => {
  acc[s.id] = s.name;
  return acc;
}, {} as Record<string, string>);

const TYPE_LABEL: Record<ProjectGoal['type'], string> = {
  '个人项目': '个人项目',
  '团队项目': '团队项目',
  '实战练习': '实战练习',
};

const VERIFY_LABEL: Record<ProjectGoal['verificationMethod'], string> = {
  '项目完成': '项目完成',
  '实操演示': '实操演示',
  '代码提交': '代码提交',
};

export const ProjectGoals: React.FC = () => {
  const { completedProjects, toggleProjectComplete } = useStore();
  const [filterType, setFilterType] = useState<string>('全部');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'default' | 'difficulty' | 'time'>('default');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const types = ['全部', '个人项目', '团队项目', '实战练习'];

  const filtered = useMemo(() => {
    const list = ALL_PROJECTS.filter((p) => filterType === '全部' || p.type === filterType)
      .filter((p) => filterDifficulty === '全部' || String(p.difficulty) === filterDifficulty)
      .filter((p) => {
        if (filterStatus === '全部') return true;
        const done = !!completedProjects[p.id];
        return filterStatus === '已完成' ? done : !done;
      });

    if (sortBy === 'difficulty') {
      return [...list].sort((a, b) => a.difficulty - b.difficulty);
    }
    if (sortBy === 'time') {
      return [...list].sort((a, b) => a.estimatedTime.length - b.estimatedTime.length);
    }
    return list;
  }, [filterType, filterDifficulty, filterStatus, sortBy, completedProjects]);

  const stats = useMemo(() => {
    const done = Object.keys(completedProjects).length;
    const totalExp = Object.values(completedProjects).reduce((sum, p) => sum + p.expReward, 0);
    return {
      total: ALL_PROJECTS.length,
      completed: done,
      totalExp,
      personal: ALL_PROJECTS.filter((p) => p.type === '个人项目').length,
      practice: ALL_PROJECTS.filter((p) => p.type === '实战练习').length,
    };
  }, [completedProjects]);

  const renderStars = (difficulty: number) => (
    <span className="pg-difficulty">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11} fill={i <= difficulty ? '#f59e0b' : 'none'} color={i <= difficulty ? '#f59e0b' : '#475569'} />
      ))}
    </span>
  );

  return (
    <div className="project-goals">
      <h2 className="page-title">
        <Target size={24} />
        项目目标
      </h2>
      <p className="page-desc">通过实战项目巩固技能，完成项目获得大量经验奖励，也是突破等级瓶颈的重要方式。</p>

      <div className="pg-stats">
        <div className="pg-stat-card">
          <div className="pg-stat-label">项目总数</div>
          <div className="pg-stat-value">{stats.total}</div>
        </div>
        <div className="pg-stat-card">
          <div className="pg-stat-label">已完成</div>
          <div className="pg-stat-value">{stats.completed}</div>
        </div>
        <div className="pg-stat-card">
          <div className="pg-stat-label">实战练习</div>
          <div className="pg-stat-value">{stats.practice}</div>
        </div>
        <div className="pg-stat-card">
          <div className="pg-stat-label">总获得经验</div>
          <div className="pg-stat-value">{stats.totalExp}</div>
        </div>
      </div>

      <div className="pg-filters">
        <div className="filter-group">
          <label>类型</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>难度</label>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
            <option value="全部">全部</option>
            <option value="1">★1 入门</option>
            <option value="2">★2 基础</option>
            <option value="3">★3 进阶</option>
            <option value="4">★4 困难</option>
            <option value="5">★5 挑战</option>
          </select>
        </div>
        <div className="filter-group">
          <label>状态</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="全部">全部</option>
            <option value="未完成">未完成</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
        <div className="filter-group">
          <label>排序</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="default">默认</option>
            <option value="difficulty">按难度</option>
            <option value="time">按预计时长</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Target size={48} />
          <p>没有符合条件的项目</p>
        </div>
      )}

      <div className="pg-grid">
        {filtered.map((p) => {
          const isCompleted = !!completedProjects[p.id];
          const expReward = EXP_CONFIG.PROJECT_COMPLETE_EXP * p.difficulty;
          const isExpanded = expandedProjectId === p.id;
          return (
            <div key={p.id} className={`pg-card ${isCompleted ? 'pg-card-completed' : ''} ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="pg-card-header clickable"
                onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
              >
                <div className="pg-header-main">
                  <h3 className="pg-card-title">{p.title}</h3>
                  <div className="pg-card-meta-row">
                    <span className="pg-skill-tag">
                      {SKILL_NAME_MAP[p.skillId] || p.skillId}
                    </span>
                    {renderStars(p.difficulty)}
                    <span className="pg-time">
                      <Clock size={12} />
                      {p.estimatedTime}
                    </span>
                    <span className="pg-exp-reward">
                      <Zap size={12} color="#f59e0b" />
                      +{expReward} EXP
                    </span>
                  </div>
                </div>
                <div className="pg-header-side">
                  <span className={`pg-type-tag ${p.type}`}>{TYPE_LABEL[p.type]}</span>
                  <span className="pg-expand-icon">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="pg-card-details">
                  <p className="pg-desc">{p.description}</p>

                  <div className="pg-meta">
                    <span className="pg-verify">
                      <Award size={12} />
                      检验方式：{VERIFY_LABEL[p.verificationMethod]}
                    </span>
                    {isCompleted && (
                      <span className="pg-completed-badge">
                        <Check size={12} />
                        已完成
                      </span>
                    )}
                  </div>

                  <div className="pg-requirements">
                    <div className="pg-requirements-label">
                      <CheckSquare size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      验收要求：
                    </div>
                    <ul className="pg-req-list">
                      {p.requirements.map((r, idx) => (
                        <li key={idx} className="pg-req-item">{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pg-card-footer">
                    <button
                      className={isCompleted ? 'btn-secondary' : 'btn-primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProjectComplete(p.id, p.skillId, p.difficulty);
                      }}
                    >
                      <Check size={14} />
                      {isCompleted ? '取消完成' : '标记完成'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectGoals;
