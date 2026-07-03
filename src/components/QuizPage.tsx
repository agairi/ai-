import React, { useState, useMemo, useCallback } from 'react';
import {
  Brain,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Target,
  Star,
  BookOpen,
  TrendingUp,
  Award,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { useStore } from '../store';
import { generateQuiz, gradeQuiz, aiTeach, type Quiz, type QuizResult, type QuizQuestion } from '../utils/quizService';
import { SKILLS_WITH_META } from '../data/skillsAndCareers';
import type { UserContext } from '../utils/aiChatEngine';

type QuizPhase = 'setup' | 'generating' | 'answering' | 'grading' | 'result';

interface QuizPageProps {
  initialSkillId?: string;
  onNavigate?: (page: string) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ initialSkillId, onNavigate }) => {
  const { skills, aiConfig, quizHistory, savedQuizzes, addQuizResult, saveQuiz, stats, plans } = useStore();
  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId || '');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [teachingText, setTeachingText] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [generatingError, setGeneratingError] = useState('');

  const skillOptions = useMemo(() => {
    return SKILLS_WITH_META
      .filter((s) => s.skillType !== undefined)
      .map((s) => ({ id: s.id, name: s.name, category: s.category }));
  }, []);

  const currentQuestion: QuizQuestion | null = currentQuiz?.questions[currentIndex] || null;

  const handleGenerate = useCallback(async () => {
    if (!selectedSkillId) {
      alert('请选择要测验的技能');
      return;
    }
    const skill = skills.find((s) => s.id === selectedSkillId);
    if (!skill) return;

    setPhase('generating');
    setGeneratingError('');

    try {
      const quiz = await generateQuiz(
        selectedSkillId,
        skill.name,
        difficulty,
        questionCount,
        aiConfig,
      );
      setCurrentQuiz(quiz);
      setAnswers({});
      setCurrentIndex(0);
      setStartTime(Date.now());
      setPhase('answering');
    } catch (err) {
      console.error('生成测验失败:', err);
      setGeneratingError('生成失败，请重试');
      setPhase('setup');
    }
  }, [selectedSkillId, difficulty, questionCount, aiConfig, skills]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!currentQuiz) return;

    const unanswered = currentQuiz.questions.filter((q) => !answers[q.id] || answers[q.id].trim() === '');
    if (unanswered.length > 0) {
      const ok = confirm(`还有 ${unanswered.length} 道题未作答，确定提交吗？`);
      if (!ok) return;
    }

    setPhase('grading');

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const quizResult = await gradeQuiz(currentQuiz, answers, aiConfig);
      quizResult.timeSpent = timeSpent;

      const userContext: UserContext = {
        skills: skills.map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level,
          totalExp: s.totalExp,
          category: s.category,
        })),
        plans: plans.map((p) => ({
          id: p.id,
          title: p.title,
          tasks: p.tasks.map((t) => ({
            id: t.id,
            title: t.title,
            completed: t.completed,
            dueDate: t.dueDate,
          })),
        })),
        stats: {
          totalStudyTime: stats.totalStudyTime,
          completedTasks: stats.completedTasks,
          streakDays: stats.currentStreak,
        },
      };

      const teaching = await aiTeach(currentQuiz, quizResult, userContext, aiConfig);
      setTeachingText(teaching);

      setResult(quizResult);
      addQuizResult(quizResult);
      saveQuiz(currentQuiz);
      setPhase('result');
    } catch (err) {
      console.error('批改失败:', err);
      setPhase('answering');
      alert('批改失败，请重试');
    }
  }, [currentQuiz, answers, aiConfig, startTime, skills, plans, stats, addQuizResult, saveQuiz]);

  const handleRetry = useCallback(() => {
    setPhase('setup');
    setCurrentQuiz(null);
    setResult(null);
    setTeachingText('');
    setAnswers({});
    setCurrentIndex(0);
  }, []);

  const renderStars = (level: number) => (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= level ? '#f59e0b' : 'none'}
          color={i <= level ? '#f59e0b' : '#475569'}
        />
      ))}
    </span>
  );

  return (
    <div className="quiz-page">
      <h2 className="page-title">
        <Brain size={24} />
        AI 智能测验
      </h2>
      <p className="page-desc">AI 自动出题、智能批改、个性化辅导，检验你的学习成果</p>

      {phase === 'setup' && (
        <div className="quiz-setup">
          <div className="quiz-setup-card">
            <h3>
              <Sparkles size={18} />
              创建测验
            </h3>

            <div className="setup-group">
              <label>选择技能</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
              >
                <option value="">-- 请选择 --</option>
                {skillOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}（{s.category}）
                  </option>
                ))}
              </select>
            </div>

            <div className="setup-group">
              <label>难度等级：{renderStars(difficulty)}</label>
              <div className="difficulty-slider">
                <span>简单</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                />
                <span>困难</span>
              </div>
            </div>

            <div className="setup-group">
              <label>题目数量：{questionCount} 道</label>
              <div className="count-buttons">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    className={`count-btn ${questionCount === n ? 'active' : ''}`}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n} 题
                  </button>
                ))}
              </div>
            </div>

            {generatingError && (
              <div className="error-msg">{generatingError}</div>
            )}

            <button className="btn-primary start-quiz-btn" onClick={handleGenerate}>
              <Play size={18} />
              开始生成测验
            </button>
          </div>

          {quizHistory.length > 0 && (
            <div className="quiz-history">
              <h3>
                <Clock size={18} />
                历史测验
              </h3>
              <div className="history-list">
                {quizHistory.slice(0, 5).map((h) => {
                  const percent = h.maxScore > 0 ? Math.round((h.totalScore / h.maxScore) * 100) : 0;
                  const quiz = savedQuizzes.find((q) => q.id === h.quizId);
                  return (
                    <div key={h.quizId + h.completedAt} className="history-item">
                      <div className="history-info">
                        <span className="history-title">{quiz?.title || '历史测验'}</span>
                        <span className="history-score" style={{
                          color: percent >= 80 ? '#22c55e' : percent >= 60 ? '#f59e0b' : '#ef4444'
                        }}>
                          {percent}%
                        </span>
                      </div>
                      <span className="history-date">
                        {new Date(h.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'generating' && (
        <div className="quiz-loading">
          <Loader2 size={48} className="spinning" />
          <p>AI 正在为你生成专属测验题...</p>
          <p className="loading-hint">请稍候，这可能需要几秒钟</p>
        </div>
      )}

      {phase === 'answering' && currentQuiz && currentQuestion && (
        <div className="quiz-answering">
          <div className="quiz-progress-header">
            <div className="quiz-info-bar">
              <span className="quiz-title">{currentQuiz.title}</span>
              <span className="quiz-progress-text">
                第 {currentIndex + 1} / {currentQuiz.questionCount} 题
              </span>
            </div>
            <div className="progress-bar large">
              <div
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / currentQuiz.questionCount) * 100}%` }}
              />
            </div>
            <div className="quiz-nav-bar">
              {currentQuiz.questions.map((q, i) => (
                <button
                  key={q.id}
                  className={`nav-dot ${i === currentIndex ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  title={`第 ${i + 1} 题`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="question-card">
            <div className="question-header">
              <span className={`question-type type-${currentQuestion.type}`}>
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>
              <span className="question-difficulty">
                {renderStars(currentQuestion.difficulty)}
              </span>
            </div>

            <h3 className="question-text">{currentQuestion.question}</h3>

            <div className="question-body">
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="choice-options">
                  {currentQuestion.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`choice-option ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      />
                      <span className="choice-letter">{String.fromCharCode(65 + idx)}.</span>
                      <span className="choice-text">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multi-choice' && currentQuestion.options && (
                <div className="choice-options">
                  {currentQuestion.options.map((opt, idx) => {
                    const selected = (answers[currentQuestion.id] || '').split('\n').filter(Boolean);
                    const isChecked = selected.includes(opt);
                    return (
                      <label
                        key={idx}
                        className={`choice-option ${isChecked ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let newSelected = [...selected];
                            if (e.target.checked) {
                              newSelected.push(opt);
                            } else {
                              newSelected = newSelected.filter((s) => s !== opt);
                            }
                            handleAnswer(currentQuestion.id, newSelected.join('\n'));
                          }}
                        />
                        <span className="choice-letter">{String.fromCharCode(65 + idx)}.</span>
                        <span className="choice-text">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'fill' && (
                <input
                  type="text"
                  className="fill-input"
                  placeholder="请输入答案..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
              )}

              {currentQuestion.type === 'short' && (
                <textarea
                  className="short-textarea"
                  placeholder="请输入你的答案..."
                  rows={6}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
              )}

              {currentQuestion.type === 'coding' && (
                <textarea
                  className="coding-textarea"
                  placeholder="请输入你的代码..."
                  rows={10}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="quiz-footer">
            <button
              className="btn-secondary"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={18} />
              上一题
            </button>

            {currentIndex < currentQuiz.questionCount - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                下一题
                <ChevronRight size={18} />
              </button>
            ) : (
              <button className="btn-primary submit-btn" onClick={handleSubmit}>
                <CheckCircle size={18} />
                提交答卷
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'grading' && (
        <div className="quiz-loading">
          <Loader2 size={48} className="spinning" />
          <p>AI 正在批改你的答卷...</p>
        </div>
      )}

      {phase === 'result' && result && currentQuiz && (
        <div className="quiz-result">
          <div className="result-score-card">
            <div className="score-circle">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#334155" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={result.totalScore / result.maxScore >= 0.8 ? '#22c55e' : result.totalScore / result.maxScore >= 0.6 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(result.totalScore / result.maxScore) * 339.292} 339.292`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{Math.round((result.totalScore / result.maxScore) * 100)}</span>
                <span className="score-unit">分</span>
              </div>
            </div>

            <div className="result-stats">
              <div className="result-stat-item">
                <CheckCircle size={20} color="#22c55e" />
                <span>正确 {result.correctCount} 题</span>
              </div>
              <div className="result-stat-item">
                <XCircle size={20} color="#ef4444" />
                <span>错误 {result.totalCount - result.correctCount} 题</span>
              </div>
              <div className="result-stat-item">
                <Clock size={20} color="#3b82f6" />
                <span>用时 {formatTime(result.timeSpent)}</span>
              </div>
            </div>

            <div className="result-grade">
              <Award size={24} />
              <span>{getGradeLabel(result.totalScore / result.maxScore)}</span>
            </div>
          </div>

          {result.weakPoints && result.weakPoints.length > 0 && (
            <div className="result-points weak">
              <h4>
                <Target size={18} />
                需要加强
              </h4>
              <div className="tag-list">
                {result.weakPoints.map((p) => (
                  <span key={p} className="weak-point-tag">{p}</span>
                ))}
              </div>
            </div>
          )}

          {result.strongPoints && result.strongPoints.length > 0 && (
            <div className="result-points strong">
              <h4>
                <TrendingUp size={18} />
                掌握较好
              </h4>
              <div className="tag-list">
                {result.strongPoints.map((p) => (
                  <span key={p} className="strong-point-tag">{p}</span>
                ))}
              </div>
            </div>
          )}

          {teachingText && (
            <div className="ai-teaching-card">
              <h4>
                <Lightbulb size={18} />
                AI 学习辅导
              </h4>
              <div className="teaching-content">
                {teachingText.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}

          <div className="result-detail-section">
            <h4>
              <BookOpen size={18} />
              答题详情
            </h4>
            <div className="result-questions">
              {result.answers.map((a, idx) => {
                const q = currentQuiz.questions.find((qq) => qq.id === a.questionId);
                if (!q) return null;
                return (
                  <div key={a.questionId} className={`result-question ${a.isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="rq-header">
                      <span className="rq-number">第 {idx + 1} 题</span>
                      <span className={`rq-status ${a.isCorrect ? 'correct' : 'wrong'}`}>
                        {a.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {a.isCorrect ? '正确' : '错误'}
                      </span>
                    </div>
                    <p className="rq-text">{q.question}</p>
                    <div className="rq-answer-row">
                      <span className="rq-label">你的答案：</span>
                      <span className="rq-value user">{a.answer || '未作答'}</span>
                    </div>
                    {!a.isCorrect && (
                      <div className="rq-answer-row">
                        <span className="rq-label">正确答案：</span>
                        <span className="rq-value correct">{q.correctAnswer}</span>
                      </div>
                    )}
                    {a.aiFeedback && (
                      <div className="rq-feedback">
                        <span className="rq-label">解析：</span>
                        <p>{a.aiFeedback}</p>
                      </div>
                    )}
                    {a.score !== undefined && (
                      <div className="rq-score">得分：{a.score.toFixed(1)} 分</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-secondary" onClick={handleRetry}>
              <RotateCcw size={18} />
              再来一套
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getQuestionTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'choice': '单选题',
    'multi-choice': '多选题',
    'fill': '填空题',
    'short': '简答题',
    'coding': '编程题',
  };
  return map[type] || type;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s}秒`;
}

function getGradeLabel(rate: number): string {
  if (rate >= 0.95) return '完美！';
  if (rate >= 0.9) return '优秀';
  if (rate >= 0.8) return '良好';
  if (rate >= 0.7) return '中等';
  if (rate >= 0.6) return '及格';
  return '继续努力';
}
