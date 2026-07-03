/**
 * 本地智能搜索引擎
 * 支持自然语言查询、关联推荐、难度匹配、搜索结果排序
 * 基于用户画像的智能推荐算法
 */

import { LEARNING_RESOURCE_DB, type LearningResourceEntry } from '../data/learningResources';

export type SearchResult = {
  entry: LearningResourceEntry;
  score: number;
  matchReasons: string[];
  recommendedPhase?: number;
  recommendationType?: 'personalized' | 'popular' | 'related' | 'beginner' | 'advanced';
};

export type UserSkillContext = {
  skillId: string;
  level: number;
  totalExp: number;
};

export type SearchSuggestion = {
  text: string;
  type: 'skill' | 'intent' | 'question' | 'resource';
  icon: string;
  score: number;
};

const INTENT_KEYWORDS: Record<string, string[]> = {
  'web前端': ['前端', '网页', '网站', 'web', 'frontend', '页面', 'html', 'css', 'javascript'],
  '后端开发': ['后端', '服务端', 'backend', 'server', 'api', '接口', '服务器'],
  '移动开发': ['移动', 'app', '手机', 'android', 'ios', 'flutter', '小程序'],
  '人工智能': ['ai', '人工智能', '机器学习', '深度学习', '神经网络', 'gpt', '大模型', 'llm', 'chatgpt'],
  '数据分析': ['数据分析', '数据可视化', '大数据', 'bi', '报表', '统计'],
  '运维': ['运维', 'devops', '部署', 'docker', 'k8s', '容器', 'ci/cd'],
  '数据库': ['数据库', 'database', 'sql', 'mysql', 'redis', 'mongo'],
  '网络安全': ['安全', '渗透', '漏洞', '加密', '黑客', '攻防'],
  '游戏开发': ['游戏', 'game', 'unity', 'unreal', '引擎'],
  '区块链': ['区块链', 'blockchain', '智能合约', 'web3', '以太坊', 'defi'],
  '嵌入式': ['嵌入式', '单片机', 'arduino', '树莓派', 'iot', '物联网', '硬件'],
  '算法面试': ['算法', '面试', '刷题', 'leetcode', '数据结构', '笔试'],
  '项目管理': ['项目管理', 'pmp', '敏捷', 'scrum', '需求'],
};

const DIFFICULTY_MAP: Record<string, number> = {
  '入门': 1,
  '简单': 2,
  '中等': 3,
  '较难': 4,
  '困难': 5,
};

const LEARNING_ACTION_KEYWORDS = {
  learn: ['学习', '学', '入门', '开始', '掌握', '精通', '了解', '熟悉'],
  compare: ['对比', '比较', 'vs', '哪个好', '选哪个', '区别'],
  path: ['路线', '规划', '路径', '怎么学', '学习路线', '学习计划'],
  problem: ['怎么解决', '怎么办', '问题', '报错', 'bug', '错误', '解决'],
  practice: ['练习', '实战', '项目', '实战项目', '练手'],
  resource: ['资料', '教程', '视频', '书籍', '课程', '推荐'],
  job: ['就业', '工作', '职业', '转行', '岗位'],
};

function tokenize(query: string): string[] {
  const cleaned = query.toLowerCase().replace(/[，。、！？,.!?;:：；""''（）()\[\]{}]/g, ' ');
  const tokens = cleaned.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 1 && tokens[0].length > 3) {
    const subTokens: string[] = [tokens[0]];
    for (let i = 0; i < tokens[0].length - 1; i++) {
      subTokens.push(tokens[0].substring(i, i + 2));
    }
    return subTokens;
  }
  return tokens;
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8;
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function detectIntent(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const intents: string[] = [];
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        intents.push(intent);
        break;
      }
    }
  }
  return intents;
}

function detectLearningAction(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const actions: string[] = [];
  for (const [action, keywords] of Object.entries(LEARNING_ACTION_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        actions.push(action);
        break;
      }
    }
  }
  return actions;
}

function getUserProficiencyLevel(userSkills: UserSkillContext[]): 'beginner' | 'intermediate' | 'advanced' {
  if (userSkills.length === 0) return 'beginner';
  const avgLevel = userSkills.reduce((sum, s) => sum + s.level, 0) / userSkills.length;
  if (avgLevel < 2) return 'beginner';
  if (avgLevel < 4) return 'intermediate';
  return 'advanced';
}

function getCategoryDistribution(userSkills: UserSkillContext[]): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const skill of userSkills) {
    const entry = LEARNING_RESOURCE_DB.find((e) => e.skillId === skill.skillId);
    if (entry) {
      dist[entry.category] = (dist[entry.category] || 0) + skill.level;
    }
  }
  return dist;
}

// 主搜索函数 - AI增强版
export function smartSearch(
  query: string,
  userSkills?: UserSkillContext[]
): SearchResult[] {
  const tokens = tokenize(query);
  const intents = detectIntent(query);
  const actions = detectLearningAction(query);
  const proficiency = userSkills ? getUserProficiencyLevel(userSkills) : 'beginner';
  const categoryDist = userSkills ? getCategoryDistribution(userSkills) : {};
  const results: SearchResult[] = [];

  for (const entry of LEARNING_RESOURCE_DB) {
    let score = 0;
    const reasons: string[] = [];
    const recommendationTypes: SearchResult['recommendationType'][] = [];

    // ========== 语义理解层 ==========
    
    // 1. 精确匹配 skillId
    if (tokens.some((t) => t.toLowerCase() === entry.skillId.toLowerCase())) {
      score += 40;
      reasons.push('ID精确匹配');
    }

    // 2. 匹配技能名称（支持模糊匹配）
    for (const token of tokens) {
      const sim = similarity(entry.skillName.toLowerCase(), token.toLowerCase());
      if (sim >= 0.6) {
        score += Math.round(sim * 35);
        if (!reasons.includes('名称匹配')) reasons.push('名称匹配');
      } else if (entry.skillName.toLowerCase().includes(token.toLowerCase())) {
        score += 30;
        if (!reasons.includes('名称匹配')) reasons.push('名称匹配');
      }
    }

    // 3. 匹配别名（加权相似度）
    for (const alias of entry.aliases) {
      for (const token of tokens) {
        const sim = similarity(alias.toLowerCase(), token.toLowerCase());
        if (sim > 0.5) {
          score += Math.round(sim * 30);
          if (!reasons.includes('关键词匹配')) reasons.push('关键词匹配');
        }
      }
    }

    // 4. 匹配描述
    for (const token of tokens) {
      if (entry.description.toLowerCase().includes(token.toLowerCase())) {
        score += 12;
        if (!reasons.includes('描述相关')) reasons.push('描述相关');
      }
    }

    // 5. 匹配分类
    for (const token of tokens) {
      if (entry.category.toLowerCase().includes(token.toLowerCase())) {
        score += 18;
        if (!reasons.includes('分类相关')) reasons.push('分类相关');
      }
    }

    // 6. 意图匹配（增强版）
    for (const intent of intents) {
      const intentKeywords = INTENT_KEYWORDS[intent] || [];
      const allText = (entry.skillName + ' ' + entry.category + ' ' + entry.aliases.join(' ')).toLowerCase();
      for (const kw of intentKeywords) {
        if (allText.includes(kw.toLowerCase())) {
          score += 25;
          if (!reasons.includes(`属于「${intent}」方向`)) {
            reasons.push(`属于「${intent}」方向`);
          }
          break;
        }
      }
    }

    // ========== 学习行为理解 ==========
    
    // 7. 学习行为匹配
    if (actions.includes('learn')) {
      const skillLevel = DIFFICULTY_MAP[entry.difficulty] || 3;
      const profMap = { beginner: 1, intermediate: 3, advanced: 4 };
      const targetLevel = profMap[proficiency];
      const difficultyDiff = Math.abs(skillLevel - targetLevel);
      if (difficultyDiff <= 1) {
        score += 15;
        reasons.push('适合你的水平');
        recommendationTypes.push(proficiency === 'beginner' ? 'beginner' : proficiency === 'advanced' ? 'advanced' : 'personalized');
      }
    }

    if (actions.includes('practice') || actions.includes('project')) {
      if (entry.category === '实操' || entry.category === '编程') {
        score += 10;
        reasons.push('适合实战练习');
      }
    }

    if (actions.includes('resource') || actions.includes('path')) {
      if (entry.learningPath && entry.learningPath.length > 2) {
        score += 8;
        reasons.push('学习资源丰富');
      }
    }

    // ========== 用户画像加权 ==========
    
    // 8. 用户技能上下文加权
    if (userSkills && userSkills.length > 0) {
      const userSkill = userSkills.find((s) => s.skillId === entry.skillId);
      if (userSkill) {
        score += 35;
        reasons.push('你正在学习');
        recommendationTypes.push('personalized');
      }

      for (const userS of userSkills) {
        if (entry.prerequisites.includes(userS.skillId)) {
          score += userS.level * 5;
          reasons.push('是你已学技能的进阶');
          recommendationTypes.push('advanced');
        }
        if (entry.relatedSkills.includes(userS.skillId)) {
          score += userS.level * 4;
          reasons.push('与你已学技能相关');
          recommendationTypes.push('related');
        }
      }

      // 9. 兴趣领域匹配
      const catScore = categoryDist[entry.category] || 0;
      if (catScore > 0) {
        score += catScore * 3;
        reasons.push('你感兴趣的领域');
        recommendationTypes.push('personalized');
      }

      // 10. 技能多样性推荐（避免过度集中在同一领域）
      const userCategories = new Set(userSkills.map(s => {
        const e = LEARNING_RESOURCE_DB.find(er => er.skillId === s.skillId);
        return e?.category;
      }).filter(Boolean));
      if (!userCategories.has(entry.category) && userCategories.size >= 2) {
        score += 10;
        reasons.push('拓展新领域');
      }
    } else {
      // 新手推荐热门技能
      if (['python', 'javascript', 'html', 'css', 'git', 'sql'].includes(entry.skillId)) {
        score += 15;
        reasons.push('新手推荐');
        recommendationTypes.push('beginner');
      }
    }

    if (score > 0) {
      let recommendedPhase = 0;
      if (userSkills) {
        const userSkill = userSkills.find((s) => s.skillId === entry.skillId);
        if (userSkill) {
          recommendedPhase = userSkill.level >= 5 ? 2 : userSkill.level >= 2 ? 1 : 0;
        }
      }

      results.push({
        entry,
        score: Math.min(100, score),
        matchReasons: reasons,
        recommendedPhase,
        recommendationType: recommendationTypes[0] || 'popular',
      });
    }
  }

  // 智能排序：综合分数 + 多样性 + 时间衰减
  results.sort((a, b) => {
    let diff = b.score - a.score;
    
    // 如果分数相近，优先推荐用户没学过的技能
    if (Math.abs(diff) < 10 && userSkills) {
      const aLearned = userSkills.some(s => s.skillId === a.entry.skillId);
      const bLearned = userSkills.some(s => s.skillId === b.entry.skillId);
      if (!aLearned && bLearned) diff += 5;
      if (aLearned && !bLearned) diff -= 5;
    }
    
    // 优先推荐进阶技能
    if (Math.abs(diff) < 5) {
      if (a.recommendationType === 'advanced' && b.recommendationType !== 'advanced') diff += 3;
      if (b.recommendationType === 'advanced' && a.recommendationType !== 'advanced') diff -= 3;
    }
    
    return diff;
  });

  return results;
}

// 获取搜索建议
export function getSearchSuggestions(
  query: string,
  userSkills?: UserSkillContext[]
): SearchSuggestion[] {
  if (!query.trim() || query.length < 2) return [];
  
  const tokens = tokenize(query);
  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  // 1. 技能名称建议
  for (const entry of LEARNING_RESOURCE_DB) {
    const matchText = (entry.skillName + ' ' + entry.skillId).toLowerCase();
    for (const token of tokens) {
      if (matchText.includes(token)) {
        const sim = similarity(matchText, query.toLowerCase());
        if (sim > 0.3 && !seen.has(entry.skillName)) {
          suggestions.push({
            text: entry.skillName,
            type: 'skill',
            icon: '🎯',
            score: Math.round(sim * 100),
          });
          seen.add(entry.skillName);
        }
      }
    }
  }

  // 2. 意图建议
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (kw.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(kw.toLowerCase())) {
        if (!seen.has(intent)) {
          suggestions.push({
            text: intent,
            type: 'intent',
            icon: '🔍',
            score: 80,
          });
          seen.add(intent);
        }
      }
    }
  }

  // 3. 学习行为建议
  const actionTemplates: Record<string, string[]> = {
    learn: ['学习 {skill}', '{skill} 入门', '精通 {skill}'],
    compare: ['{skill} vs {other}', '{skill} 和 {other} 哪个好'],
    path: ['{skill} 学习路线', '{skill} 怎么学'],
    practice: ['{skill} 实战项目', '{skill} 练习题'],
    resource: ['{skill} 教程推荐', '{skill} 学习资料'],
  };

  const topSkills = LEARNING_RESOURCE_DB.slice(0, 10);
  for (const action of Object.keys(actionTemplates)) {
    for (const kw of LEARNING_ACTION_KEYWORDS[action as keyof typeof LEARNING_ACTION_KEYWORDS] || []) {
      if (query.toLowerCase().includes(kw.toLowerCase())) {
        for (const skill of topSkills.slice(0, 3)) {
          const template = actionTemplates[action][0].replace('{skill}', skill.skillName);
          if (!seen.has(template)) {
            suggestions.push({
              text: template,
              type: 'question',
              icon: '💡',
              score: 70,
            });
            seen.add(template);
          }
        }
      }
    }
  }

  // 4. 常见问题建议
  const commonQuestions = [
    '怎么入门编程',
    '前端学习路线',
    'Python能做什么',
    '推荐学习顺序',
    '学编程需要什么基础',
    '哪个编程语言好',
  ];
  for (const q of commonQuestions) {
    if (q.includes(query) || query.includes(q)) {
      if (!seen.has(q)) {
        suggestions.push({
          text: q,
          type: 'question',
          icon: '❓',
          score: 65,
        });
        seen.add(q);
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 8);
}

// 获取推荐：基于用户已有技能推荐下一步学什么
export function getRecommendations(
  userSkills: UserSkillContext[]
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const entry of LEARNING_RESOURCE_DB) {
    let score = 0;
    const reasons: string[] = [];

    // 如果用户已经在学这个技能
    const existingSkill = userSkills.find((s) => s.skillId === entry.skillId);
    if (existingSkill) {
      // 低等级的技能优先推荐继续学
      if (existingSkill.level < 5) {
        score += 50 - existingSkill.level * 5;
        reasons.push('继续学习 unfinished');
      } else {
        continue; // 已经高等级了，不推荐
      }
    }

    // 检查前置条件满足度
    const prereqMet = entry.prerequisites.filter((prereqId) =>
      userSkills.some((s) => s.skillId === prereqId && s.level >= 1)
    );
    if (prereqMet.length > 0 && !existingSkill) {
      score += prereqMet.length * 20;
      reasons.push(`已满足${prereqMet.length}个前置条件`);
    }

    // 相关技能已学
    const relatedMet = entry.relatedSkills.filter((relatedId) =>
      userSkills.some((s) => s.skillId === relatedId)
    );
    if (relatedMet.length > 0 && !existingSkill) {
      score += relatedMet.length * 15;
      reasons.push('与你已学技能关联');
    }

    if (score > 0) {
      results.push({
        entry,
        score: Math.min(100, score),
        matchReasons: reasons,
        recommendedPhase: existingSkill
          ? existingSkill.level >= 3
            ? 1
            : 0
          : 0,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 10);
}

// 获取热门推荐
export function getPopularSkills(): LearningResourceEntry[] {
  const popularIds = [
    'python',
    'javascript',
    'react',
    'machine-learning',
    'llm',
    'go',
    'rust',
    'docker',
    'algorithms',
    'vue',
  ];
  return popularIds
    .map((id) => LEARNING_RESOURCE_DB.find((e) => e.skillId === id))
    .filter((e): e is LearningResourceEntry => e !== undefined);
}

// 根据技能 ID 获取学习资源
export function getResourceBySkillId(
  skillId: string
): LearningResourceEntry | undefined {
  return LEARNING_RESOURCE_DB.find((e) => e.skillId === skillId);
}
