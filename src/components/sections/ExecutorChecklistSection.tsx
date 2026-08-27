import React, { useState } from 'react';
import { 
  CheckSquare, Square, ArrowRight, 
  Clock, ShieldAlert, ChevronDown, ChevronUp, Printer
} from 'lucide-react';
import { EXECUTOR_CHECKLIST_PHASES, type ChecklistTask } from '../../data/executorChecklist';
import { GuidanceTip } from '../common/GuidanceTip';

interface ExecutorChecklistSectionProps {
  onNavigateTab: (tabId: string) => void;
  onOpenPrintModal: () => void;
}

export const ExecutorChecklistSection: React.FC<ExecutorChecklistSectionProps> = ({
  onNavigateTab,
  onOpenPrintModal
}) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('deathbinder_executor_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    t_pronounce: true,
    t_will_loc: true,
    t_phone_2fa: true
  });

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    try {
      localStorage.setItem('deathbinder_executor_tasks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const totalTaskCount = EXECUTOR_CHECKLIST_PHASES.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTaskCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTaskCount / totalTaskCount) * 100);

  return (
    <div className="section-content-container">
      {/* Header Banner */}
      <div className="checklist-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Clock size={14} />
            <span>Settlement Action Guide</span>
          </div>
          <h1 className="hero-title">Executor & Family Action Checklist</h1>
          <p className="hero-description">
            A chronological, step-by-step administrative guide for the surviving spouse or named executor from the first 24 hours through probate settlement.
          </p>
        </div>

        <div className="checklist-progress-card">
          <div className="progress-stat">
            <span className="progress-number">{completedTaskCount} of {totalTaskCount}</span>
            <span className="progress-label">Tasks Completed</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <button type="button" className="btn btn-secondary no-print" onClick={onOpenPrintModal} style={{ marginTop: '12px' }}>
            <Printer size={14} /> Print Checklist
          </button>
        </div>
      </div>

      <GuidanceTip type="legal-warning" title="Primary Rule: Never Pay Estate Debts from Personal Money">
        Family members frequently rush to pay credit card bills or hospital bills from their own personal funds. <strong>You are not personally liable.</strong> Debts must be paid exclusively by the estate during probate.
      </GuidanceTip>

      {/* 4 Phases Stack */}
      <div className="phases-stack">
        {EXECUTOR_CHECKLIST_PHASES.map((phase) => {
          const phaseTasks = phase.tasks;
          const phaseCompleted = phaseTasks.filter(t => completedTasks[t.id]).length;

          return (
            <div key={phase.id} className="phase-card glass-panel">
              <div className="phase-card-header">
                <div className="phase-header-left">
                  <span className="phase-badge">{phase.badge}</span>
                  <h2 className="phase-title">{phase.title}</h2>
                  <span className="phase-timeframe">{phase.timeframeDescription}</span>
                </div>
                <div className="phase-header-right">
                  <span className="phase-counter">{phaseCompleted} of {phaseTasks.length} Done</span>
                </div>
              </div>

              <div className="phase-tasks-list">
                {phaseTasks.map((task: ChecklistTask) => {
                  const isDone = !!completedTasks[task.id];
                  const isExpanded = !!expandedTasks[task.id];

                  return (
                    <div 
                      key={task.id} 
                      className={`task-row ${isDone ? 'task-done' : ''} ${task.priority === 'urgent' ? 'task-urgent' : ''}`}
                    >
                      <div className="task-main-bar">
                        <button 
                          type="button" 
                          className="task-checkbox-btn" 
                          onClick={() => toggleTask(task.id)}
                          aria-label={isDone ? 'Mark task pending' : 'Mark task complete'}
                        >
                          {isDone ? (
                            <CheckSquare size={20} className="check-icon done" />
                          ) : (
                            <Square size={20} className="check-icon pending" />
                          )}
                        </button>

                        <div className="task-text-wrap" onClick={() => toggleExpand(task.id)}>
                          <div className="task-title-line">
                            <span className="task-title">{task.title}</span>
                            {task.priority === 'urgent' && (
                              <span className="priority-tag urgent">Urgent</span>
                            )}
                          </div>
                          <span className="task-subtitle">{task.subtitle}</span>
                        </div>

                        <div className="task-actions-wrap">
                          {task.binderTabLink && (
                            <button 
                              type="button" 
                              className="btn-jump-tab" 
                              onClick={() => onNavigateTab(task.binderTabLink!)}
                              title={`Jump to Section in Binder`}
                            >
                              <span>View Data</span>
                              <ArrowRight size={13} />
                            </button>
                          )}
                          <button 
                            type="button" 
                            className="btn-expand-task"
                            onClick={() => toggleExpand(task.id)}
                            aria-label={isExpanded ? 'Collapse instructions' : 'Expand instructions'}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Instructions & Cautions */}
                      {isExpanded && (
                        <div className="task-expanded-body">
                          <p className="task-instructions-text">{task.instructions}</p>
                          {task.caution && (
                            <div className="task-caution-box">
                              <ShieldAlert size={16} className="caution-icon" />
                              <span><strong>Warning:</strong> {task.caution}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
