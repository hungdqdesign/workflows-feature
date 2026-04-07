import { Router } from 'express';
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  updateSteps,
  getWorkflowWithSteps,
} from '../services/workflows.js';

const router = Router();

// GET /companies/:companyId/workflows - List all workflows
router.get('/companies/:companyId/workflows', async (req, res) => {
  try {
    const { companyId } = req.params;
    const workflows = await getWorkflows(companyId);
    res.json(workflows);
  } catch (error) {
    console.error('Error getting workflows:', error);
    res.status(500).json({ error: 'Failed to get workflows' });
  }
});

// POST /companies/:companyId/workflows - Create a new workflow
router.post('/companies/:companyId/workflows', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const workflow = await createWorkflow(companyId, { name, description });
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// GET /companies/:companyId/workflows/:id - Get a single workflow
router.get('/companies/:companyId/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await getWorkflowWithSteps(id);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Error getting workflow:', error);
    res.status(500).json({ error: 'Failed to get workflow' });
  }
});

// PATCH /companies/:companyId/workflows/:id - Update a workflow
router.patch('/companies/:companyId/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const workflow = await updateWorkflow(id, { name, description });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
});

// DELETE /companies/:companyId/workflows/:id - Delete a workflow
router.delete('/companies/:companyId/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await deleteWorkflow(id);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

// PUT /companies/:companyId/workflows/:id/steps - Update workflow steps (reorder)
router.put('/companies/:companyId/workflows/:id/steps', async (req, res) => {
  try {
    const { id } = req.params;
    const { steps } = req.body;

    if (!Array.isArray(steps)) {
      return res.status(400).json({ error: 'Steps must be an array' });
    }

    const updatedSteps = await updateSteps(id, steps);
    res.json(updatedSteps);
  } catch (error) {
    console.error('Error updating steps:', error);
    res.status(500).json({ error: 'Failed to update steps' });
  }
});

// GET /companies/:companyId/workflows/:id/issues - Get workflow with issue details
router.get('/companies/:companyId/workflows/:id/issues', async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await getWorkflowWithSteps(id);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Error getting workflow issues:', error);
    res.status(500).json({ error: 'Failed to get workflow issues' });
  }
});

export default router;
