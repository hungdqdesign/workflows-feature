import { sql } from '../db.js';

/**
 * Get all workflows for a company
 */
export async function getWorkflows(companyId) {
  const workflows = await sql`
    SELECT
      w.id,
      w.company_id as "companyId",
      w.name,
      w.description,
      w.created_at as "createdAt",
      w.updated_at as "updatedAt",
      COUNT(ws.id)::int as "stepCount"
    FROM workflows w
    LEFT JOIN workflow_steps ws ON w.id = ws.workflow_id
    WHERE w.company_id = ${companyId}
    GROUP BY w.id
    ORDER BY w.created_at DESC
  `;
  return workflows;
}

/**
 * Get a single workflow by ID
 */
export async function getWorkflow(id) {
  const [workflow] = await sql`
    SELECT
      id,
      company_id as "companyId",
      name,
      description,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM workflows
    WHERE id = ${id}
    LIMIT 1
  `;
  return workflow || null;
}

/**
 * Create a new workflow
 */
export async function createWorkflow(companyId, data) {
  const [workflow] = await sql`
    INSERT INTO workflows (company_id, name, description)
    VALUES (${companyId}, ${data.name}, ${data.description || null})
    RETURNING
      id,
      company_id as "companyId",
      name,
      description,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return workflow;
}

/**
 * Update a workflow
 */
export async function updateWorkflow(id, data) {
  if (data.name !== undefined && data.description !== undefined) {
    const [workflow] = await sql`
      UPDATE workflows
      SET name = ${data.name}, description = ${data.description}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, company_id as "companyId", name, description, created_at as "createdAt", updated_at as "updatedAt"
    `;
    return workflow;
  } else if (data.name !== undefined) {
    const [workflow] = await sql`
      UPDATE workflows
      SET name = ${data.name}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, company_id as "companyId", name, description, created_at as "createdAt", updated_at as "updatedAt"
    `;
    return workflow;
  } else if (data.description !== undefined) {
    const [workflow] = await sql`
      UPDATE workflows
      SET description = ${data.description}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, company_id as "companyId", name, description, created_at as "createdAt", updated_at as "updatedAt"
    `;
    return workflow;
  }
  return null;
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id) {
  const [result] = await sql`
    DELETE FROM workflows
    WHERE id = ${id}
    RETURNING id
  `;
  return result;
}

/**
 * Update workflow steps (reorder)
 */
export async function updateSteps(workflowId, steps) {
  // Delete existing steps
  await sql`DELETE FROM workflow_steps WHERE workflow_id = ${workflowId}`;

  // Insert new steps
  for (const step of steps) {
    await sql`
      INSERT INTO workflow_steps (workflow_id, issue_id, step_order)
      VALUES (${workflowId}, ${step.issueId}, ${step.stepOrder})
    `;
  }

  // Update workflow's updatedAt
  await sql`UPDATE workflows SET updated_at = NOW() WHERE id = ${workflowId}`;

  // Return updated steps
  return getSteps(workflowId);
}

/**
 * Get steps for a workflow
 */
export async function getSteps(workflowId) {
  const steps = await sql`
    SELECT
      id,
      workflow_id as "workflowId",
      issue_id as "issueId",
      step_order as "stepOrder",
      created_at as "createdAt"
    FROM workflow_steps
    WHERE workflow_id = ${workflowId}
    ORDER BY step_order ASC
  `;
  return steps;
}

/**
 * Get workflow with its steps
 */
export async function getWorkflowWithSteps(id) {
  const workflow = await getWorkflow(id);
  if (!workflow) return null;

  const steps = await getSteps(id);

  return {
    ...workflow,
    steps,
  };
}
