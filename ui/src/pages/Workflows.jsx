import { useState, useEffect } from 'react';
import { workflowsApi } from '../api/workflows.js';

export function Workflows({ companyId, onSelectWorkflow }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadWorkflows();
  }, [companyId]);

  async function loadWorkflows() {
    try {
      setLoading(true);
      const data = await workflowsApi.list(companyId);
      setWorkflows(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await workflowsApi.create(companyId, formData);
      setFormData({ name: '', description: '' });
      setShowDialog(false);
      loadWorkflows();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await workflowsApi.update(editingWorkflow.id, formData);
      setFormData({ name: '', description: '' });
      setEditingWorkflow(null);
      setShowDialog(false);
      loadWorkflows();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(workflow) {
    if (!confirm(`Delete workflow "${workflow.name}"?`)) return;
    try {
      await workflowsApi.remove(workflow.id);
      loadWorkflows();
    } catch (err) {
      alert(err.message);
    }
  }

  function openCreateDialog() {
    setFormData({ name: '', description: '' });
    setEditingWorkflow(null);
    setShowDialog(true);
  }

  function openEditDialog(workflow) {
    setFormData({ name: workflow.name, description: workflow.description || '' });
    setEditingWorkflow(workflow);
    setShowDialog(true);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <button
          onClick={openCreateDialog}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No workflows yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer bg-white"
              onClick={() => onSelectWorkflow && onSelectWorkflow(workflow.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{workflow.name}</h3>
                  {workflow.description && (
                    <p className="text-gray-600 mt-1">{workflow.description}</p>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    {workflow.stepCount || 0} steps · Created {formatDate(workflow.createdAt)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(workflow);
                    }}
                    className="px-3 py-1 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(workflow);
                    }}
                    className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingWorkflow ? 'Edit Workflow' : 'New Workflow'}
            </h2>
            <form onSubmit={editingWorkflow ? handleUpdate : handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false);
                    setEditingWorkflow(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingWorkflow ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
