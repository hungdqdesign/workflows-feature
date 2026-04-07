import { useState, useEffect } from 'react';
import { workflowsApi } from '../api/workflows.js';

export function WorkflowDetail({ workflowId, companyId, onBack }) {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadWorkflow();
  }, [workflowId]);

  async function loadWorkflow() {
    try {
      setLoading(true);
      const data = await workflowsApi.get(workflowId);
      setWorkflow(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!selectedTaskId) return;

    const newStep = {
      issueId: selectedTaskId,
      stepOrder: workflow.steps.length + 1,
    };

    try {
      const updatedSteps = [...workflow.steps, { ...newStep, id: `temp-${Date.now()}` }];
      setWorkflow({ ...workflow, steps: updatedSteps });
      await workflowsApi.updateSteps(workflowId, [...workflow.steps, newStep]);
      setSelectedTaskId('');
      setShowTaskDialog(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRemoveTask(stepIndex) {
    const newSteps = workflow.steps.filter((_, i) => i !== stepIndex);
    // Reorder
    const reorderedSteps = newSteps.map((s, i) => ({ ...s, stepOrder: i + 1 }));

    try {
      setWorkflow({ ...workflow, steps: reorderedSteps });
      await workflowsApi.updateSteps(
        workflowId,
        reorderedSteps.map((s) => ({ issueId: s.issueId, stepOrder: s.stepOrder }))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  function handleDragStart(index) {
    setDraggedIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...workflow.steps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedStep);

    // Update stepOrder
    const reorderedSteps = newSteps.map((s, i) => ({ ...s, stepOrder: i + 1 }));
    setWorkflow({ ...workflow, steps: reorderedSteps });
    setDraggedIndex(index);
  }

  async function handleDragEnd() {
    setDraggedIndex(null);
    try {
      await workflowsApi.updateSteps(
        workflowId,
        workflow.steps.map((s) => ({ issueId: s.issueId, stepOrder: s.stepOrder }))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!workflow) return <div className="p-4">Workflow not found</div>;

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 text-blue-500 hover:bg-blue-50 rounded"
      >
        ← Back to Workflows
      </button>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
          {workflow.description && (
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowTaskDialog(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Task
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Steps ({workflow.steps?.length || 0})</h2>

      {(!workflow.steps || workflow.steps.length === 0) ? (
        <div className="text-gray-500 text-center py-8 border rounded-lg bg-gray-50">
          No tasks in this workflow yet. Click "Add Task" to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {workflow.steps.map((step, index) => (
            <div
              key={step.id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 border rounded-lg bg-white cursor-move ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <span className="text-gray-400 font-mono">{index + 1}.</span>
              <div className="flex-1">
                <span className="font-medium">Task {step.issueId}</span>
              </div>
              <button
                onClick={() => handleRemoveTask(index)}
                className="px-2 py-1 text-red-500 hover:bg-red-50 rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        Drag and drop to reorder steps. Changes are saved automatically.
      </p>

      {showTaskDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Task ID (Issue UUID)</label>
                <input
                  type="text"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter issue UUID"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
