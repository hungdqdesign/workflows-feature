import { pgTable, uuid, text, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Workflows table
export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Workflow steps junction table (workflow <-> issues)
// issueId references the issues table from the main app schema
export const workflowSteps = pgTable('workflow_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  issueId: uuid('issue_id').notNull(), // references issues.id in main app
  stepOrder: integer('step_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  // Unique constraint: one issue can only appear once per workflow
  primaryKey({ columns: [table.workflowId, table.issueId] }),
]);

// Relations
export const workflowsRelations = relations(workflows, ({ many }) => ({
  steps: many(workflowSteps),
}));

export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowSteps.workflowId],
    references: [workflows.id],
  }),
}));
