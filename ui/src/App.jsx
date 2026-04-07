import { useState } from 'react';
import { Workflows } from './pages/Workflows.jsx';
import { WorkflowDetail } from './pages/WorkflowDetail.jsx';

// This is a placeholder App component
// In a real app, this would use react-router or similar
export function App({ companyId }) {
  // Simple state-based routing for demonstration
  const [currentPage, setCurrentPage] = useState('workflows');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);

  function handleSelectWorkflow(id) {
    setSelectedWorkflowId(id);
    setCurrentPage('workflow-detail');
  }

  function handleBack() {
    setSelectedWorkflowId(null);
    setCurrentPage('workflows');
  }

  if (currentPage === 'workflow-detail' && selectedWorkflowId) {
    return (
      <WorkflowDetail
        workflowId={selectedWorkflowId}
        companyId={companyId}
        onBack={handleBack}
      />
    );
  }

  return <Workflows companyId={companyId} onSelectWorkflow={handleSelectWorkflow} />;
}
