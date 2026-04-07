const API_BASE = '/api';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const workflowsApi = {
  list(companyId) {
    return request(`/companies/${companyId}/workflows`);
  },

  get(companyId, workflowId) {
    return request(`/companies/${companyId}/workflows/${workflowId}`);
  },

  create(companyId, data) {
    return request(`/companies/${companyId}/workflows`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(companyId, workflowId, data) {
    return request(`/companies/${companyId}/workflows/${workflowId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(companyId, workflowId) {
    return request(`/companies/${companyId}/workflows/${workflowId}`, {
      method: 'DELETE',
    });
  },

  updateSteps(companyId, workflowId, steps) {
    return request(`/companies/${companyId}/workflows/${workflowId}/steps`, {
      method: 'PUT',
      body: JSON.stringify({ steps }),
    });
  },
};
