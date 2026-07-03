import { generateWithAi, type AiProviderConfig } from './localAiService';
import type { UserContext } from './aiChatEngine';

// ============ 类型定义 ============

export type QuestionType = 'choice' | 'multi-choice' | 'fill' | 'short' | 'coding';

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  knowledgePoint: string;
  skillId: string;
  skillName: string;
};

export type Quiz = {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  projectId?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questionCount: number;
  questions: QuizQuestion[];
  createdAt: string;
  timeLimit?: number;
};

export type UserAnswer = {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  score?: number;
  aiFeedback?: string;
};

export type QuizResult = {
  quizId: string;
  answers: UserAnswer[];
  totalScore: number;
  maxScore: number;
  correctCount: number;
  totalCount: number;
  timeSpent: number;
  completedAt: string;
  aiTeaching?: string;
  weakPoints?: string[];
  strongPoints?: string[];
};

// ============ 内置出题引擎（离线可用） ============

const BUILTIN_QUESTION_BANK: Record<string, QuizQuestion[]> = {};

function generateId(): string {
  return 'q_' + Math.random().toString(36).slice(2, 10);
}

function builtinGenerateQuiz(
  skillId: string,
  skillName: string,
  difficulty: number,
  count: number,
): Quiz {
  const questions: QuizQuestion[] = [];
  const types: QuestionType[] = ['choice', 'multi-choice', 'fill', 'short'];
  const difficultyLevel = Math.min(5, Math.max(1, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5;

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const knowledgeBase = getKnowledgeForSkill(skillName, i);
    const q = generateBuiltinQuestion(skillId, skillName, type, difficultyLevel, knowledgeBase, i);
    questions.push(q);
  }

  return {
    id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    title: `${skillName} 能力测验`,
    skillId,
    skillName,
    difficulty: difficultyLevel,
    questionCount: count,
    questions,
    createdAt: new Date().toISOString(),
  };
}

function getKnowledgeForSkill(skillName: string, index: number): { topic: string; concepts: string[] } {
  const topics: Record<string, { topic: string; concepts: string[] }[]> = {
    'JavaScript': [
      { topic: '变量与数据类型', concepts: ['var', 'let', 'const', '基本类型', '引用类型'] },
      { topic: '函数与作用域', concepts: ['函数声明', '箭头函数', '闭包', '作用域链'] },
      { topic: '数组与对象', concepts: ['数组方法', '对象操作', '解构赋值', '展开运算符'] },
      { topic: '异步编程', concepts: ['Promise', 'async/await', '回调', '事件循环'] },
      { topic: 'DOM操作', concepts: ['选择器', '事件监听', 'DOM修改', '事件冒泡'] },
    ],
    'Python': [
      { topic: '基础语法', concepts: ['变量', '数据类型', '缩进', '注释'] },
      { topic: '函数与模块', concepts: ['函数定义', '参数', '返回值', '模块导入'] },
      { topic: '数据结构', concepts: ['列表', '字典', '元组', '集合'] },
      { topic: '面向对象', concepts: ['类', '继承', '封装', '多态'] },
      { topic: '文件与异常', concepts: ['文件读写', '异常处理', '上下文管理器'] },
    ],
    'React': [
      { topic: '组件基础', concepts: ['函数组件', 'JSX', 'props', '状态'] },
      { topic: 'Hooks', concepts: ['useState', 'useEffect', 'useContext', '自定义Hook'] },
      { topic: '状态管理', concepts: ['Context', 'Redux', 'Zustand', '状态提升'] },
      { topic: '路由与导航', concepts: ['React Router', '嵌套路由', '动态路由'] },
      { topic: '性能优化', concepts: ['memo', 'useMemo', 'useCallback', '懒加载'] },
    ],
  };

  const skillTopics = topics[skillName] || [
    { topic: '基础概念', concepts: ['定义', '用途', '基本操作', '常见场景'] },
    { topic: '进阶应用', concepts: ['高级特性', '最佳实践', '设计模式', '性能优化'] },
    { topic: '实战项目', concepts: ['项目搭建', '功能实现', '问题调试', '代码优化'] },
  ];

  return skillTopics[index % skillTopics.length];
}

function generateBuiltinQuestion(
  skillId: string,
  skillName: string,
  type: QuestionType,
  difficulty: 1 | 2 | 3 | 4 | 5,
  knowledge: { topic: string; concepts: string[] },
  index: number,
): QuizQuestion {
  const concept = knowledge.concepts[index % knowledge.concepts.length];

  if (type === 'choice') {
    const options = [
      `${concept} 的正确定义和用法`,
      `与 ${concept} 无关的描述`,
      `${concept} 的错误用法`,
      `另一个完全不同的概念`,
    ];
    return {
      id: generateId(),
      type: 'choice',
      question: `在${skillName}中，关于"${concept}"的描述，以下哪项是正确的？`,
      options: shuffleArray([...options]),
      correctAnswer: options[0],
      explanation: `${concept}是${knowledge.topic}中的重要概念。正确理解它对于掌握${skillName}至关重要。建议结合实际代码进行练习，加深理解。`,
      difficulty,
      knowledgePoint: knowledge.topic,
      skillId,
      skillName,
    };
  }

  if (type === 'multi-choice') {
    const options = [
      `${concept}的核心特性 A`,
      `${concept}的核心特性 B`,
      `${concept}的常见应用场景`,
      `与${concept}无关的选项`,
      `${concept}的最佳实践`,
    ];
    return {
      id: generateId(),
      type: 'multi-choice',
      question: `在${skillName}中，以下哪些是"${concept}"的正确描述？（多选）`,
      options: shuffleArray([...options]),
      correctAnswer: `${options[0]}\n${options[1]}\n${options[2]}\n${options[4]}`,
      explanation: `${concept}是${knowledge.topic}的重要组成部分。需要掌握其核心特性、应用场景和最佳实践，才能在实际项目中灵活运用。`,
      difficulty,
      knowledgePoint: knowledge.topic,
      skillId,
      skillName,
    };
  }

  if (type === 'fill') {
    return {
      id: generateId(),
      type: 'fill',
      question: `在${skillName}中，${knowledge.topic}的核心概念是______，它主要用于解决${concept}相关的问题。`,
      correctAnswer: concept,
      explanation: `${concept}是${knowledge.topic}中的关键概念。理解它的定义、用途和使用场景，是掌握${skillName}的基础。`,
      difficulty,
      knowledgePoint: knowledge.topic,
      skillId,
      skillName,
    };
  }

  return {
    id: generateId(),
    type: 'short',
    question: `请简述${skillName}中"${concept}"的概念、作用和使用场景，并举例说明。`,
    correctAnswer: `${concept}是${knowledge.topic}中的重要概念，主要用于处理相关问题。在实际开发中常用于...`,
    explanation: `这是一个开放性问题，考察对${concept}的深入理解。建议从定义、作用、使用场景、代码示例等多个角度来回答。`,
    difficulty,
    knowledgePoint: knowledge.topic,
    skillId,
    skillName,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============ AI 智能出题 ============

const QUIZ_GENERATE_SYSTEM_PROMPT = `你是一名专业的出题老师，擅长根据指定技能和难度生成高质量的测验题目。

请严格按照以下 JSON 格式输出题目，不要输出任何其他文字：
{
  "title": "测验标题",
  "questions": [
    {
      "type": "choice",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": "正确答案（选择题填选项完整文本）",
      "explanation": "详细解析，说明为什么正确以及错误选项的问题",
      "difficulty": 3,
      "knowledgePoint": "知识点名称"
    }
  ]
}

题型说明：
- choice: 单选题，必须有4个选项，correctAnswer 填正确选项的完整文本
- multi-choice: 多选题，必须有5个选项，correctAnswer 每行一个正确选项
- fill: 填空题，correctAnswer 填写正确答案
- short: 简答题，correctAnswer 填写参考答案要点
- coding: 编程题，correctAnswer 填写参考代码或解题思路

要求：
1. 题目难度要与指定等级匹配
2. 题目要有实际应用价值
3. 解析要详细，能帮助用户理解
4. 知识点分布要均匀
5. 所有输出必须是合法的 JSON 格式`;

export async function generateQuiz(
  skillId: string,
  skillName: string,
  difficulty: number,
  count: number,
  aiConfig: AiProviderConfig,
  projectContext?: string,
): Promise<Quiz> {
  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return builtinGenerateQuiz(skillId, skillName, difficulty, count);
  }

  try {
    const prompt = `请为技能"${skillName}"生成一份测验，难度等级 ${difficulty}/5，共 ${count} 道题。

题型分布：
- 单选题：${Math.ceil(count * 0.4)} 道
- 多选题：${Math.floor(count * 0.2)} 道
- 填空题：${Math.floor(count * 0.2)} 道
- 简答题：${Math.max(1, count - Math.ceil(count * 0.4) - Math.floor(count * 0.2) - Math.floor(count * 0.2))} 道

${projectContext ? `项目背景：${projectContext}\n题目请结合该项目的实际需求。` : ''}

请输出严格的 JSON 格式。`;

    const response = await generateWithAi(prompt, aiConfig, QUIZ_GENERATE_SYSTEM_PROMPT);
    const parsed = parseQuizJson(response, skillId, skillName, difficulty);
    return parsed;
  } catch (err) {
    console.warn('AI出题失败，使用内置题库:', err);
    return builtinGenerateQuiz(skillId, skillName, difficulty, count);
  }
}

function parseQuizJson(jsonStr: string, skillId: string, skillName: string, difficulty: number): Quiz {
  let clean = jsonStr.trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) clean = jsonMatch[0];

  try {
    const data = JSON.parse(clean);
    const questions: QuizQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
      id: generateId(),
      type: q.type || 'choice',
      question: q.question || '',
      options: q.options,
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      difficulty: (q.difficulty || Math.min(5, Math.max(1, Math.round(difficulty)))) as 1 | 2 | 3 | 4 | 5,
      knowledgePoint: q.knowledgePoint || '综合',
      skillId,
      skillName,
    }));

    return {
      id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: data.title || `${skillName} 能力测验`,
      skillId,
      skillName,
      difficulty: Math.min(5, Math.max(1, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5,
      questionCount: questions.length,
      questions,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('解析 AI 出题结果失败:', err);
    return builtinGenerateQuiz(skillId, skillName, difficulty, 5);
  }
}

// ============ AI 批改 ============

const GRADE_SYSTEM_PROMPT = `你是一名严格公正的阅卷老师，请对用户的答题进行评分和解析。

请严格按照以下 JSON 格式输出结果，不要输出任何其他文字：
{
  "score": 85,
  "maxScore": 100,
  "answers": [
    {
      "questionId": "题目ID",
      "isCorrect": true,
      "score": 10,
      "maxScore": 10,
      "aiFeedback": "详细的反馈和解析"
    }
  ],
  "overallFeedback": "整体评价和改进建议",
  "weakPoints": ["薄弱知识点1", "薄弱知识点2"],
  "strongPoints": ["掌握较好的知识点1"]
}

评分标准：
- 选择题：完全正确得满分，错误得0分
- 多选题：全对得满分，部分对得一半分，错选得0分
- 填空题：意思对即可得分
- 简答题：按要点给分，观点清晰、举例恰当得高分
- 编程题：按功能完整性、代码质量给分

要求：
1. 评分要客观公正
2. 反馈要具体，指出问题所在
3. 解析要清晰，帮助用户理解
4. 薄弱点和优势点分析要准确`;

export async function gradeQuiz(
  quiz: Quiz,
  userAnswers: Record<string, string>,
  aiConfig: AiProviderConfig,
): Promise<QuizResult> {
  const answers: UserAnswer[] = quiz.questions.map((q) => {
    const userAns = userAnswers[q.id] || '';
    return {
      questionId: q.id,
      answer: userAns,
    };
  });

  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return builtinGradeQuiz(quiz, answers);
  }

  try {
    const prompt = JSON.stringify({
      quizTitle: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        knowledgePoint: q.knowledgePoint,
        userAnswer: userAnswers[q.id] || '',
      })),
    });

    const response = await generateWithAi(prompt, aiConfig, GRADE_SYSTEM_PROMPT);
    const result = parseGradeJson(response, quiz, answers);
    return result;
  } catch (err) {
    console.warn('AI批改失败，使用内置批改:', err);
    return builtinGradeQuiz(quiz, answers);
  }
}

function builtinGradeQuiz(quiz: Quiz, answers: UserAnswer[]): QuizResult {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;

  const graded = answers.map((ua) => {
    const question = quiz.questions.find((q) => q.id === ua.questionId);
    if (!question) return { ...ua, isCorrect: false, score: 0, aiFeedback: '题目不存在' };

    const baseScore = 100 / quiz.questionCount;
    maxScore += baseScore;

    let isCorrect = false;
    let score = 0;
    let feedback = '';

    const userAns = ua.answer.trim().toLowerCase();
    const correctAns = question.correctAnswer.trim().toLowerCase();

    if (question.type === 'choice') {
      isCorrect = userAns === correctAns || !!(question.options?.some(
        (opt) => opt.toLowerCase() === userAns && opt === question.correctAnswer
      ));
      score = isCorrect ? baseScore : 0;
      feedback = isCorrect
        ? `回答正确！${question.explanation}`
        : `回答错误。正确答案是：${question.correctAnswer}。${question.explanation}`;
    } else if (question.type === 'multi-choice') {
      const userOptions = userAns.split(/[\n,，;；]/).map((s) => s.trim()).filter(Boolean);
      const correctOptions = correctAns.split(/[\n,，;；]/).map((s) => s.trim()).filter(Boolean);
      const correctCount = userOptions.filter((o) => correctOptions.includes(o)).length;
      const wrongCount = userOptions.filter((o) => !correctOptions.includes(o)).length;
      if (wrongCount === 0 && correctCount === correctOptions.length) {
        isCorrect = true;
        score = baseScore;
      } else if (wrongCount === 0 && correctCount > 0) {
        score = (baseScore * correctCount) / correctOptions.length * 0.8;
      }
      feedback = isCorrect
        ? `全部正确！${question.explanation}`
        : `部分正确或错误。正确答案有 ${correctOptions.length} 项。${question.explanation}`;
    } else if (question.type === 'fill') {
      isCorrect = userAns === correctAns ||
        correctAns.includes(userAns) ||
        (userAns.length > 0 && correctAns.includes(userAns.slice(0, Math.min(5, userAns.length))));
      score = isCorrect ? baseScore : 0;
      feedback = isCorrect
        ? `回答正确！${question.explanation}`
        : `答案不准确。参考答案：${question.correctAnswer}。${question.explanation}`;
    } else {
      const keywords = question.correctAnswer.split(/[，。,.;；\s]+/).filter((s) => s.length >= 2);
      const matchCount = keywords.filter((k) => userAns.includes(k.toLowerCase())).length;
      const matchRate = keywords.length > 0 ? matchCount / keywords.length : 0;
      isCorrect = matchRate >= 0.6;
      score = baseScore * Math.min(1, matchRate);
      feedback = matchRate >= 0.8
        ? `回答很好！要点基本覆盖。${question.explanation}`
        : matchRate >= 0.5
          ? `回答尚可，但不够全面。${question.explanation}`
          : `回答需要加强。参考要点：${question.correctAnswer}。${question.explanation}`;
    }

    if (isCorrect) correctCount++;

    return {
      ...ua,
      isCorrect,
      score: Math.round(score * 10) / 10,
      aiFeedback: feedback,
    };
  });

  totalScore = Math.round(graded.reduce((sum, a) => sum + (a.score || 0), 0) * 10) / 10;
  maxScore = Math.round(maxScore * 10) / 10;

  const weakPoints = graded
    .filter((a) => !a.isCorrect)
    .map((a) => quiz.questions.find((q) => q.id === a.questionId)?.knowledgePoint)
    .filter(Boolean) as string[];

  const strongPoints = graded
    .filter((a) => a.isCorrect)
    .map((a) => quiz.questions.find((q) => q.id === a.questionId)?.knowledgePoint)
    .filter(Boolean) as string[];

  return {
    quizId: quiz.id,
    answers: graded,
    totalScore,
    maxScore,
    correctCount,
    totalCount: quiz.questionCount,
    timeSpent: 0,
    completedAt: new Date().toISOString(),
    weakPoints: [...new Set(weakPoints)].slice(0, 5),
    strongPoints: [...new Set(strongPoints)].slice(0, 5),
    aiTeaching: generateBuiltinTeaching(totalScore, maxScore, weakPoints, strongPoints, quiz.skillName),
  };
}

function parseGradeJson(jsonStr: string, quiz: Quiz, answers: UserAnswer[]): QuizResult {
  let clean = jsonStr.trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) clean = jsonMatch[0];

  try {
    const data = JSON.parse(clean);
    const gradedAnswers = answers.map((ua) => {
      const aiAnswer = (data.answers || []).find((a: any) => a.questionId === ua.questionId);
      return {
        ...ua,
        isCorrect: aiAnswer?.isCorrect ?? false,
        score: aiAnswer?.score ?? 0,
        aiFeedback: aiAnswer?.aiFeedback || '',
      };
    });

    const totalScore = Math.round((data.score || 0) * 10) / 10;
    const maxScore = data.maxScore || 100;

    return {
      quizId: quiz.id,
      answers: gradedAnswers,
      totalScore,
      maxScore,
      correctCount: gradedAnswers.filter((a) => a.isCorrect).length,
      totalCount: quiz.questionCount,
      timeSpent: 0,
      completedAt: new Date().toISOString(),
      weakPoints: data.weakPoints || [],
      strongPoints: data.strongPoints || [],
      aiTeaching: data.overallFeedback || '',
    };
  } catch (err) {
    console.error('解析 AI 批改结果失败:', err);
    return builtinGradeQuiz(quiz, answers);
  }
}

// ============ AI 教学辅导 ============

function generateBuiltinTeaching(
  score: number,
  maxScore: number,
  weakPoints: string[],
  strongPoints: string[],
  skillName: string,
): string {
  const rate = maxScore > 0 ? score / maxScore : 0;
  const percent = Math.round(rate * 100);

  let level = '';
  let advice = '';

  if (rate >= 0.9) {
    level = '优秀';
    advice = `你对${skillName}的掌握非常扎实！建议继续挑战更高难度的内容，可以尝试复杂的实战项目来进一步提升。`;
  } else if (rate >= 0.75) {
    level = '良好';
    advice = `整体掌握不错，但还有提升空间。建议重点复习薄弱知识点，通过更多练习来巩固。`;
  } else if (rate >= 0.6) {
    level = '及格';
    advice = `基础还需要加强。建议系统地回顾一下${skillName}的核心概念，多做练习题。`;
  } else {
    level = '需要努力';
    advice = `目前基础还比较薄弱，建议从基础概念开始重新学习，一步一个脚印地打牢基础。`;
  }

  let weakPointAdvice = '';
  if (weakPoints.length > 0) {
    weakPointAdvice = `\n\n需要重点加强的知识点：\n${weakPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
  }

  let strongPointMention = '';
  if (strongPoints.length > 0) {
    strongPointMention = `\n\n掌握较好的知识点：${strongPoints.join('、')}`;
  }

  return `成绩：${percent}%（${level}）\n\n${advice}${weakPointAdvice}${strongPointMention}\n\n学习建议：\n1. 针对错题进行复盘，理解每个错误的原因\n2. 结合项目实践加深理解\n3. 定期复习，避免遗忘\n4. 可以挑战更高难度的测验来检验提升效果`;
}

const TEACHING_SYSTEM_PROMPT = `你是一名耐心的AI学习导师，根据用户的测验结果提供个性化的学习建议和辅导。

请从以下几个方面给出建议：
1. 整体评价（鼓励为主）
2. 薄弱知识点分析（具体、可操作）
3. 掌握较好的方面（肯定成绩）
4. 下一步学习计划（分阶段、可执行）
5. 推荐的学习资源和方法

语气要亲切、鼓励，避免打击用户积极性。建议要具体、可操作，避免空泛。`;

export async function aiTeach(
  quiz: Quiz,
  result: QuizResult,
  userContext: UserContext,
  aiConfig: AiProviderConfig,
): Promise<string> {
  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return result.aiTeaching || generateBuiltinTeaching(result.totalScore, result.maxScore, result.weakPoints || [], result.strongPoints || [], quiz.skillName);
  }

  try {
    const prompt = `用户技能水平：${JSON.stringify({
      skillName: quiz.skillName,
      score: result.totalScore,
      maxScore: result.maxScore,
      correctRate: `${result.correctCount}/${result.totalCount}`,
      weakPoints: result.weakPoints,
      strongPoints: result.strongPoints,
      wrongAnswers: result.answers
        .filter((a) => !a.isCorrect)
        .map((a) => {
          const q = quiz.questions.find((qq) => qq.id === a.questionId);
          return {
            question: q?.question,
            userAnswer: a.answer,
            feedback: a.aiFeedback,
            knowledgePoint: q?.knowledgePoint,
          };
        }),
    })}

用户整体学习情况：
- 学习总时长：${Math.round(userContext.stats.totalStudyTime / 60)} 分钟
- 完成任务数：${userContext.stats.completedTasks}
- 连续学习天数：${userContext.stats.streakDays} 天

请给出个性化的学习辅导建议。`;

    const response = await generateWithAi(prompt, aiConfig, TEACHING_SYSTEM_PROMPT);
    return response;
  } catch (err) {
    console.warn('AI教学失败，使用内置教学:', err);
    return result.aiTeaching || generateBuiltinTeaching(result.totalScore, result.maxScore, result.weakPoints || [], result.strongPoints || [], quiz.skillName);
  }
}
