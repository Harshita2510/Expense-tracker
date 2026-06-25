import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import Login from './Login';

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('budgetDiarySession'));
    } catch {
      return null;
    }
  });

  const saveSession = (nextSession) => {
    try {
      localStorage.setItem('budgetDiarySession', JSON.stringify(nextSession));
    } catch {
      // Some private/embedded browser contexts block persistent storage.
      // Keep the authenticated session in memory for the current tab.
    }
    setSession(nextSession);
  };

  const logout = () => {
    localStorage.removeItem('budgetDiarySession');
    setSession(null);
  };

  return (
    <div className="app-shell">
      {session?.token ? (
        <ExpenseForm token={session.token} user={session.user} onLogout={logout} />
      ) : (
        <Login onAuthenticated={saveSession} />
      )}
    </div>
  );
}

export default App;
