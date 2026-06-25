import { useState } from 'react';

const Login = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authenticate = async (path, body) => {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Authentication failed.');
    return data;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Enter your name.');
      return;
    }
    if (mode === 'register' && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    if (mode === 'login' && !password) {
      setError('Enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await authenticate(`/api/auth/${mode}`, { name, email, password });
      onAuthenticated(session);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <span className="auth-kicker">Your money, thoughtfully recorded</span>
        <h1>GuiltTrip</h1>
        <p>A quiet, private place to understand your spending and build better habits.</p>
      </section>
      <section className="auth-card">
        <div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Begin your diary'}</h2>
          <p>{mode === 'login' ? 'Sign in to continue to your entries.' : 'Create an account to start tracking.'}</p>
        </div>
        <form onSubmit={submit} className="auth-form" noValidate>
          {mode === 'register' && (
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
          )}
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label>
            Password
            <span className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
            {mode === 'register' && (
              <small className="password-help">
                Use at least 8 characters, including one letter and one number.
              </small>
            )}
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="submit-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setPassword(''); setShowPassword(false); }}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
};

export default Login;
