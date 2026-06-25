import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import Login from './Login';

const PIN_HASH_KEY = 'guiltTripPinHash';

const hashPin = async (pin) => {
  const data = new TextEncoder().encode(`guilttrip-pin-v1:${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const PinScreen = ({ mode, user, onSetPin, onUnlock, onUsePassword }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(pin)) {
      setError('Use exactly 4 digits.');
      return;
    }

    if (mode === 'setup') {
      await onSetPin(pin);
      return;
    }

    const nextHash = await hashPin(pin);
    if (nextHash !== localStorage.getItem(PIN_HASH_KEY)) {
      setError('Wrong PIN. Try again.');
      setPin('');
      return;
    }

    onUnlock();
  };

  return (
    <main className="auth-page pin-page">
      <section className="auth-intro">
        <span className="auth-kicker">Fast private unlock</span>
        <h1>GuiltTrip</h1>
        <p>
          {mode === 'setup'
            ? 'Set a 4-digit PIN for this device so you do not have to type your email and password every time.'
            : `Welcome back${user?.name ? `, ${user.name}` : ''}. Unlock with your PIN.`}
        </p>
      </section>
      <section className="auth-card pin-card">
        <div>
          <h2>{mode === 'setup' ? 'Create PIN' : 'Enter PIN'}</h2>
          <p>{mode === 'setup' ? 'This PIN only works on this device.' : 'Your session is still saved locally.'}</p>
        </div>
        <form className="auth-form" onSubmit={submit} noValidate>
          <label>
            4-digit PIN
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="4"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              autoFocus
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="submit-button" type="submit">
            {mode === 'setup' ? 'Save PIN' : 'Unlock'}
          </button>
        </form>
        {mode === 'unlock' && (
          <button className="auth-switch" type="button" onClick={onUsePassword}>
            Use email/password instead
          </button>
        )}
      </section>
    </main>
  );
};

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('budgetDiarySession'));
    } catch {
      return null;
    }
  });
  const [isLocked, setIsLocked] = useState(false);
  const [needsPinSetup, setNeedsPinSetup] = useState(() => (
    Boolean(session?.token) && !localStorage.getItem(PIN_HASH_KEY)
  ));

  const saveSession = (nextSession) => {
    try {
      localStorage.setItem('budgetDiarySession', JSON.stringify(nextSession));
    } catch {
      // Some private/embedded browser contexts block persistent storage.
      // Keep the authenticated session in memory for the current tab.
    }
    setSession(nextSession);
    if (!localStorage.getItem(PIN_HASH_KEY)) {
      setNeedsPinSetup(true);
    } else {
      setIsLocked(false);
    }
  };

  const logout = () => {
    if (localStorage.getItem(PIN_HASH_KEY) && session?.token) {
      setIsLocked(true);
      return;
    }

    localStorage.removeItem('budgetDiarySession');
    setSession(null);
    setIsLocked(false);
    setNeedsPinSetup(false);
  };

  const lock = () => {
    if (localStorage.getItem(PIN_HASH_KEY)) setIsLocked(true);
  };

  const setPin = async (pin) => {
    localStorage.setItem(PIN_HASH_KEY, await hashPin(pin));
    setNeedsPinSetup(false);
    setIsLocked(false);
  };

  const clearSessionForPasswordLogin = () => {
    localStorage.removeItem('budgetDiarySession');
    setSession(null);
    setIsLocked(false);
    setNeedsPinSetup(false);
  };

  return (
    <div className="app-shell">
      {session?.token && needsPinSetup ? (
        <PinScreen mode="setup" user={session.user} onSetPin={setPin} />
      ) : session?.token && isLocked ? (
        <PinScreen
          mode="unlock"
          user={session.user}
          onUnlock={() => setIsLocked(false)}
          onUsePassword={clearSessionForPasswordLogin}
        />
      ) : session?.token ? (
        <ExpenseForm token={session.token} user={session.user} onLogout={logout} onLock={lock} />
      ) : (
        <Login onAuthenticated={saveSession} />
      )}
    </div>
  );
}

export default App;
