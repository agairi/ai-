// 本地类型定义
type SkillLevel = {
  level: number;
  name: string;
  requiredExp: number;
  color: string;
  // 是否为瓶颈等级：达到此等级后，需通过任务/项目突破才能继续累积升级
  breakthrough?: boolean;
  breakthroughDesc?: string;
};

export const SKILL_LEVELS: SkillLevel[] = [
  { level: 0, name: '一无所知', requiredExp: 0, color: '#9ca3af' },
  { level: 1, name: '初出茅庐', requiredExp: 100, color: '#22c55e' },
  { level: 2, name: '略知一二', requiredExp: 300, color: '#10b981' },
  { level: 3, name: '登堂入室', requiredExp: 600, color: '#14b8a6' },
  { level: 4, name: '渐入佳境', requiredExp: 1000, color: '#06b6d4', breakthrough: true, breakthroughDesc: '完成3个该技能任务 或 1个入门项目，方可突破至"炉火纯青"' },
  { level: 5, name: '炉火纯青', requiredExp: 2000, color: '#3b82f6' },
  { level: 6, name: '出神入化', requiredExp: 5000, color: '#8b5cf6', breakthrough: true, breakthroughDesc: '完成6个该技能任务 或 2个进阶项目，方可突破至"登峰造极"' },
  { level: 7, name: '登峰造极', requiredExp: 10000, color: '#a855f7' },
  { level: 8, name: '震古烁今', requiredExp: 25000, color: '#ec4899', breakthrough: true, breakthroughDesc: '完成10个该技能任务 或 3个困难项目，方可突破至"一代宗师"' },
  { level: 9, name: '一代宗师', requiredExp: 50000, color: '#eab308' },
];



// 突破条件配置：需要多少个任务 / 多少个项目（按难度门槛）
export const BREAKTHROUGH_REQUIREMENTS: Record<number, { tasks: number; projects: number; minProjectDifficulty: number }> = {
  4: { tasks: 3, projects: 1, minProjectDifficulty: 1 },
  6: { tasks: 6, projects: 2, minProjectDifficulty: 2 },
  8: { tasks: 10, projects: 3, minProjectDifficulty: 3 },
};

// 经验获取配置
export const EXP_CONFIG = {
  EXP_PER_MINUTE: 2, // 每分钟专注学习获得的基础经验
  DAILY_STREAK_BONUS: [1, 1.1, 1.2, 1.3, 1.5, 1.75, 2], // 连续1-7天的加成倍率
  TASK_BASE_EXP: 20, // 任务基础经验
  PROJECT_COMPLETE_EXP: 200, // 完成项目目标的经验
};

// 根据连续学习天数计算加成倍率
export function getStreakBonus(streak: number): number {
  if (streak <= 0) return 1;
  if (streak >= EXP_CONFIG.DAILY_STREAK_BONUS.length) {
    return EXP_CONFIG.DAILY_STREAK_BONUS[EXP_CONFIG.DAILY_STREAK_BONUS.length - 1];
  }
  return EXP_CONFIG.DAILY_STREAK_BONUS[streak - 1];
}

// 仅按经验计算等级（不考虑瓶颈）
export function getSkillLevelByExp(exp: number): number {
  for (let i = SKILL_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= SKILL_LEVELS[i].requiredExp) {
      return i;
    }
  }
  return 0;
}

// 保留旧函数名兼容（仅按经验）
export function getSkillLevel(exp: number): number {
  return getSkillLevelByExp(exp);
}

// 综合经验与突破状态计算当前等级：
// 若经验已达下一级，但当前处于未突破的瓶颈等级，则卡在瓶颈等级
export function getSkillLevelWithBreakthrough(exp: number, breakthroughs: number[] = []): number {
  const baseLevel = getSkillLevelByExp(exp);
  let level = baseLevel;
  for (let i = 0; i <= baseLevel; i++) {
    if (SKILL_LEVELS[i].breakthrough && !breakthroughs.includes(i) && level > i) {
      level = i;
      break;
    }
  }
  return level;
}

// 判断某技能当前是否卡在瓶颈等级（经验已够下一级，但瓶颈未突破）
export function isStuckAtBreakthrough(exp: number, breakthroughs: number[] = []): { stuck: boolean; level: number | null } {
  const baseLevel = getSkillLevelByExp(exp);
  for (let i = 0; i <= baseLevel; i++) {
    if (SKILL_LEVELS[i].breakthrough && !breakthroughs.includes(i) && baseLevel > i) {
      return { stuck: true, level: i };
    }
  }
  return { stuck: false, level: null };
}

export function getLevelInfo(level: number): SkillLevel {
  return SKILL_LEVELS[level] || SKILL_LEVELS[0];
}

// 计算到下一级的经验进度（考虑瓶颈：卡住时进度为满）
export function getExpToNextLevel(exp: number, breakthroughs: number[] = []): { current: number; required: number; progress: number } {
  const currentLevel = getSkillLevelWithBreakthrough(exp, breakthroughs);
  const currentLevelExp = SKILL_LEVELS[currentLevel].requiredExp;

  if (currentLevel >= 9) {
    return { current: exp - currentLevelExp, required: 0, progress: 100 };
  }

  const nextLevelExp = SKILL_LEVELS[currentLevel + 1].requiredExp;
  const expInLevel = exp - currentLevelExp;
  const expNeeded = nextLevelExp - currentLevelExp;

  // 若卡在瓶颈等级，进度显示满（等待突破）
  const stuck = isStuckAtBreakthrough(exp, breakthroughs).stuck;
  if (stuck) {
    return { current: expNeeded, required: expNeeded, progress: 100 };
  }

  return {
    current: expInLevel,
    required: expNeeded,
    progress: Math.round((expInLevel / expNeeded) * 100),
  };
}


export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  }
  return `${secs}秒`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}