// Sidebar navigation component
// In a real app, this would integrate with the main app's sidebar

export function Sidebar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'workflows', label: 'Workflows', icon: '🔄' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="w-64 bg-gray-100 h-full p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Workflows App</h1>
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                currentPage === item.id
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
