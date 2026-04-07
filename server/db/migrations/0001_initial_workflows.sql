-- Migration: 0001_initial_workflows
-- Description: Create workflows and workflow_steps tables

-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create workflow_steps junction table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  issue_id UUID NOT NULL,
  step_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (workflow_id, issue_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflows_company_id ON workflows(company_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_issue_id ON workflow_steps(issue_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_step_order ON workflow_steps(step_order);
