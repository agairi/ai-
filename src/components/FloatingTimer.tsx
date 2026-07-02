import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Clock, Pause, Play, X } from 'lucide-react';
import { formatTime } from '../utils/skillLevels';

export const FloatingTimer: React.FC = () => {
  const {
    isTimerRunning,
    timerStartTime,
    currentTimerPlanId,
    currentTimerTaskId,
    plans,
    startTimer,
    stopTimer,
    getCurrentDuration,
  } = useStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Update elapsed time every second
  useEffect(() => {
    if (!isTimerRunning) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(getCurrentDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, getCurrentDuration]);

  // Get current task and plan info
  const currentPlan = plans.find((p) => p.id === currentTimerPlanId);
  const currentTask = currentPlan?.tasks.find((t) => t.id === currentTimerTaskId);

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      stopTimer();
      setIsPaused(false);
    } else if (currentTimerPlanId && currentTimerTaskId) {
      startTimer(currentTimerPlanId, currentTimerTaskId);
    }
  };

  if (!isTimerRunning && elapsedTime === 0) return null;

  return (
    <div className={`floating-timer ${isMinimized ? 'minimized' : ''}`}>
      <div className="timer-header">
        <Clock size={18} />
        <span className="timer-title">学习计时</span>
        <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
          {isMinimized ? '展开' : '收起'}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="timer-info">
            {currentPlan && <span className="plan-name">{currentPlan.title}</span>}
            {currentTask && <span className="task-name">{currentTask.title}</span>}
          </div>

          <div className="timer-display">
            <span className="time-value">{formatTime(elapsedTime)}</span>
          </div>

          <div className="timer-controls">
            <button className="control-btn stop" onClick={handleToggleTimer}>
              <Pause size={20} />
              停止计时
            </button>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="timer-mini">
          <span className="mini-time">{formatTime(elapsedTime)}</span>
        </div>
      )}
    </div>
  );
};