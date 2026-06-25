import { useCallback, useEffect, useRef, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import Dashboard from './Dashboard';
import Hader from './Header';
import MemeCard from './MemeCard';
import WeeklyDamage from './WeeklyDamage';

function ExpenseForm({ token, user, onLogout }) {
  var [arr, setArr] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('form');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dte = new Date();

  const [date, setDate] = useState(
    dte.toISOString().slice(0, 10)
  );
  const [ModeOfPay, setModeOfPay] = useState('Cash');
  const [customModeOfPay, setCustomModeOfPay] = useState('');
  const [entryType, setEntryType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [field, setField] = useState('Food');
  const [customField, setCustomField] = useState('');
  const [description, setDescription] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [refundDate, setRefundDate] = useState(dte.toISOString().slice(0, 10));
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMode, setRefundMode] = useState('UPI');
  const [customRefundMode, setCustomRefundMode] = useState('');
  const [refundDescription, setRefundDescription] = useState('');
  const [aiText, setAiText] = useState('');
  const [isAiSaving, setIsAiSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceAgentState, setVoiceAgentState] = useState('idle');
  const [hasOpenedIntro, setHasOpenedIntro] = useState(false);
  const [toast, setToast] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const shouldCaptureAfterWakeRef = useRef(false);

  const apiFetch = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) onLogout();
    return response;
  }, [token, onLogout]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesResponse, refundsResponse] = await Promise.all([
          apiFetch('/api/expenses'),
          apiFetch('/api/refunds'),
        ]);

        if (!expensesResponse.ok || !refundsResponse.ok) {
          throw new Error('Could not load data');
        }

        const expenses = await expensesResponse.json();
        const refundEntries = await refundsResponse.json();
        setArr(expenses);
        setRefunds(refundEntries);
      } catch {
        setError('Could not connect to the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [apiFetch]);

  const Approv = async (e) => {
    e.preventDefault();
    const expenseField = field === 'Other' ? customField.trim() : field;
    const paymentMode = ModeOfPay === 'Other' ? customModeOfPay.trim() : ModeOfPay;

    if (!expenseField) {
      setError('Please enter a custom field name.');
      return;
    }

    if (!paymentMode) {
      setError('Please enter a custom payment mode.');
      return;
    }

    let entries = {
      Datee: date,
      ModeOfPayment: paymentMode,
      Incoming: entryType === 'income' ? Number(amount || 0) : 0,
      Outgoing: entryType === 'expense' ? Number(amount || 0) : 0,
      Expense: expenseField,
      Description: description,
    };

    try {
      const response = await apiFetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      });

      if (!response.ok) {
        throw new Error('Could not save expense');
      }

      const savedExpense = await response.json();
      setArr([savedExpense, ...arr]);
      setError('');
    } catch {
      setError('Could not save this expense. Check that the API server is running.');
      return;
    }

    setDate(
      dte.toISOString().slice(0, 10)
    );
    setModeOfPay('Cash');
    setCustomModeOfPay('');
    setEntryType('expense');
    setAmount('');
    setField('Food');
    setCustomField('');
    setDescription('');
  };

  const menuItems = [
    { id: 'form', label: 'Add Entry', icon: '□' },
    { id: 'entries', label: 'Past Entries', icon: '☷' },
    { id: 'summary', label: 'Summary', icon: '◷' },
    { id: 'refunds', label: 'Refunds', icon: '↻' },
    { id: 'receipt', label: 'Receipt of Shame', icon: '▧' },
  ];

  const pageCopy = {
    form: ['Dear Diary,', 'Log a new financial entry for today.'],
    entries: ['Past Entries', 'Look back at where your money has been.'],
    summary: ['Your Summary', 'A clear view of your financial story.'],
    refunds: ['Refunds', 'Keep track of money making its way back to you.'],
    receipt: ['Receipt of Shame', 'Your weekly spending damage, printed beautifully.'],
  };

  const paymentModes = [
    'Cash',
    'UPI',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
    ...arr.map((entry) => entry.ModeOfPayment).filter(Boolean),
    ...refunds.map((refund) => refund.ModeOfPayment).filter(Boolean),
  ].filter((mode, index, modes) => modes.indexOf(mode) === index);

  const fieldOptions = arr
    .map((entry) => entry.Expense)
    .filter(Boolean)
    .filter((expense, index, expenses) => expenses.indexOf(expense) === index);

  const filteredEntries = arr.filter((entry) => {
    const matchesEntryType =
      entryTypeFilter === 'all' ||
      (entryTypeFilter === 'incoming' && Number(entry.Incoming || 0) > 0) ||
      (entryTypeFilter === 'outgoing' && Number(entry.Outgoing || 0) > 0);
    const matchesPayment =
      paymentFilter === 'all' || entry.ModeOfPayment === paymentFilter;
    const matchesField =
      fieldFilter === 'all' || entry.Expense === fieldFilter;

    return matchesEntryType && matchesPayment && matchesField;
  });

  const pendingRefunds = refunds.filter((refund) => refund.Status !== 'done');
  const completedRefunds = refunds.filter((refund) => refund.Status === 'done');
  const pendingRefundTotal = pendingRefunds.reduce(
    (sum, refund) => sum + Number(refund.Amount || 0),
    0
  );

  const addRefund = async (e) => {
    e.preventDefault();
    const paymentMode = refundMode === 'Other' ? customRefundMode.trim() : refundMode;

    if (!paymentMode) {
      setError('Please enter a refund payment mode.');
      return;
    }

    if (!Number(refundAmount || 0)) {
      setError('Please enter a refund amount.');
      return;
    }

    try {
      const response = await apiFetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Datee: refundDate,
          ModeOfPayment: paymentMode,
          Amount: Number(refundAmount || 0),
          Description: refundDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not save refund');
      }

      const savedRefund = await response.json();
      setRefunds([savedRefund, ...refunds]);
      setRefundDate(dte.toISOString().slice(0, 10));
      setRefundAmount('');
      setRefundMode('UPI');
      setCustomRefundMode('');
      setRefundDescription('');
      setError('');
    } catch {
      setError('Could not save this refund.');
    }
  };

  const markRefundDone = async (refundId) => {
    try {
      const response = await apiFetch(`/api/refunds/${refundId}/done`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CompletedDate: dte.toISOString().slice(0, 10) }),
      });

      if (!response.ok) {
        throw new Error('Could not complete refund');
      }

      const data = await response.json();
      setRefunds(refunds.map((refund) => (
        refund._id === data.refund._id ? data.refund : refund
      )));

      if (data.expense && !arr.some((entry) => entry._id === data.expense._id)) {
        setArr([data.expense, ...arr]);
      }

      setError('');
    } catch {
      setError('Could not mark this refund as done.');
    }
  };

  const saveAiTransaction = async (e, textOverride = '') => {
    e?.preventDefault();
    const text = (textOverride || aiText).trim();

    if (!text) {
      setError('Tell me what happened first, for example: "I spent 300 on Uber".');
      return;
    }

    setIsAiSaving(true);
    setError('');

    try {
      const aiResponse = await apiFetch('/api/transactions/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(aiData.message || 'Could not understand this transaction.');
      }

      const transactions = Array.isArray(aiData.transactions)
        ? aiData.transactions
        : [aiData.transaction || aiData];

      const savedExpenses = await Promise.all(transactions.map(async (transaction) => {
        const parsedDate = transaction.date
        ? new Date(transaction.date).toISOString().slice(0, 10)
        : dte.toISOString().slice(0, 10);

        const expenseResponse = await apiFetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Datee: parsedDate,
            ModeOfPayment: transaction.paymentMethod === 'Cash' ? 'Cash' : 'UPI',
            Incoming: transaction.type === 'income' ? Number(transaction.amount || 0) : 0,
            Outgoing: transaction.type === 'expense' ? Number(transaction.amount || 0) : 0,
            Expense: transaction.category || 'Other',
            Description: transaction.description || text,
          }),
        });

        if (!expenseResponse.ok) {
          throw new Error('AI understood it, but the entry could not be saved.');
        }

        return expenseResponse.json();
      }));

      setArr((currentEntries) => [...savedExpenses, ...currentEntries]);
      setAiText('');
      setError('');
      setToast({
        message: `Logged ${savedExpenses.length} ${savedExpenses.length === 1 ? 'item' : 'items'}.`,
        roast: aiData.roast
          ? `AI says: '${aiData.roast}'`
          : "AI says: 'I see we are funding the local economy one bad decision at a time.'",
      });
      window.setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError(err.message || 'Could not record this transaction.');
    } finally {
      setIsAiSaving(false);
    }
  };

  const wakePhrasePattern = /\b(hey|hi|hello)\s+(dear|diary|there|deer)\b/i;

  const listenOnce = ({ onTranscript, onStart, onEnd }) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice agent is not supported in this browser. Try Chrome, or type the sentence.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language?.startsWith('en') ? 'en-IN' : navigator.language || 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      onStart?.();
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      onTranscript(transcript);
    };

    recognition.onerror = () => {
      setError('Voice agent could not hear clearly. Click the meme card and try again.');
        setVoiceAgentState('idle');
      shouldCaptureAfterWakeRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.start();
  };

  const captureTransactionByVoice = () => {
    listenOnce({
      onStart: () => setVoiceAgentState('capture'),
      onTranscript: (transcript) => {
        const text = transcript.trim();
        setAiText(text);

        if (text) {
          setVoiceAgentState('saving');
          saveAiTransaction(null, text).finally(() => {
            setVoiceAgentState('idle');
          });
        }
      },
      onEnd: () => {
        setVoiceAgentState((state) => (state === 'capture' ? 'idle' : state));
      },
    });
  };

  const activateVoiceAgent = () => {
    if (isListening || isAiSaving) return;

    setHasOpenedIntro(true);
    shouldCaptureAfterWakeRef.current = false;

    listenOnce({
      onStart: () => setVoiceAgentState('wake'),
      onTranscript: (transcript) => {
        const wakeMatch = transcript.match(wakePhrasePattern);

        if (!wakeMatch || typeof wakeMatch.index !== 'number') {
          setError('I heard you, but not “hey dear”. Click the meme card and say “hey dear”.');
          setVoiceAgentState('idle');
          return;
        }

        const transactionText = transcript
          .slice(wakeMatch.index + wakeMatch[0].length)
          .trim()
          .replace(/^,?\s*/, '');

        if (transactionText) {
          setAiText(transactionText);
          setVoiceAgentState('saving');
          saveAiTransaction(null, transactionText).finally(() => {
            setVoiceAgentState('idle');
          });
          return;
        }

        shouldCaptureAfterWakeRef.current = true;
        setVoiceAgentState('capture');
      },
      onEnd: () => {
        if (shouldCaptureAfterWakeRef.current) {
          shouldCaptureAfterWakeRef.current = false;
          window.setTimeout(captureTransactionByVoice, 250);
          return;
        }

        setVoiceAgentState((state) => (state === 'wake' ? 'idle' : state));
      },
    });
  };

  if (!hasOpenedIntro) {
    return (
      <main
        className="meme-intro-page"
        onClick={activateVoiceAgent}
        role="button"
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') activateVoiceAgent();
        }}
        aria-label="Open GuiltTrip and wake voice agent"
      >
        <div className="meme-intro-shell">
          <MemeCard
            name={user?.name}
            onActivate={activateVoiceAgent}
          />
          <p>Click anywhere to open GuiltTrip. Then say “hey dear”.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="diary-layout">
      <aside className="sidebar">
        <div className="brand-block">
          <h1 className="app-title">GuiltTrip</h1>
          <p>Your personal financial companion</p>
          <div className="user-block">
            <span>{user?.name}</span>
            <button type="button" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span>Menu</span>
        <strong>{menuItems.find((item) => item.id === activePage)?.label}</strong>
      </button>
      <nav
        id="main-menu"
        className={`menu-bar ${isMenuOpen ? 'menu-bar--open' : ''}`}
        aria-label="Main sections"
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-button ${activePage === item.id ? 'menu-button--active' : ''}`}
            type="button"
            onClick={() => {
              setActivePage(item.id);
              setIsMenuOpen(false);
            }}
          >
            <span className="menu-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      </aside>
      <main className="page-content">
      <header className="page-header">
        <h2>{pageCopy[activePage][0]}</h2>
        <p>{pageCopy[activePage][1]}</p>
      </header>
      {isLoading && (
        <p className="status-message">Loading expenses...</p>
      )}
      {error && (
        <p className="status-message status-message--error">{error}</p>
      )}
      {activePage === 'form' && (
        <>
        {(voiceAgentState !== 'idle' || isAiSaving) && (
          <section className="agent-status-card" aria-live="polite">
            <div>
              <span className="eyebrow">
                {isAiSaving ? 'Processing' : voiceAgentState === 'wake' ? 'Listening' : 'Recording'}
              </span>
              <h3>
                {isAiSaving
                  ? 'Logging your damage…'
                  : voiceAgentState === 'wake'
                    ? 'Say “hey dear”'
                    : 'Tell me the transaction'}
              </h3>
            </div>
            <div className={`heartbeat-panel ${isAiSaving ? 'heartbeat-panel--saving' : ''}`} aria-hidden="true">
              <span className="heartbeat-panel-dot" />
              <span className="heartbeat-panel-line" />
            </div>
          </section>
        )}

        <form className="ai-entry-form" onSubmit={saveAiTransaction}>
          <div>
            <span className="eyebrow">Smart entry</span>
            <h3>Say it like you would tell a friend.</h3>
            <p>Example: “I spent 300 on Uber” or “Got 5000 salary today”.</p>
          </div>
          <div className="ai-entry-row">
            <input
              type="text"
              value={aiText}
              onChange={(event) => setAiText(event.target.value)}
              placeholder="Type your transaction here, or click the meme card to speak..."
              disabled={isAiSaving}
            />
            <button
              className="submit-button ai-save-button"
              type="submit"
              disabled={isAiSaving}
            >
              {isAiSaving ? 'Recording…' : 'Record'}
            </button>
          </div>
        </form>

        <form className="expense-form" onSubmit={(e) => Approv(e)}>
          <div className="form-grid">
            <div className="entry-type-picker form-field--wide">
              <label className={`type-option ${entryType === 'expense' ? 'type-option--active' : ''}`}>
                <input
                  type="radio"
                  name="entryType"
                  value="expense"
                  checked={entryType === 'expense'}
                  onChange={(e) => setEntryType(e.target.value)}
                />
                <span>Expense</span>
              </label>
              <label className={`type-option ${entryType === 'income' ? 'type-option--active' : ''}`}>
                <input
                  type="radio"
                  name="entryType"
                  value="income"
                  checked={entryType === 'income'}
                  onChange={(e) => setEntryType(e.target.value)}
                />
                <span>Income</span>
              </label>
            </div>

            <div className="form-field">
              <label>Amount (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-field">
              <label>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Mode of Payment</label>
              <select
                value={ModeOfPay}
                onChange={(e) => setModeOfPay(e.target.value)}
              >
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {ModeOfPay === 'Other' && (
              <div className="form-field">
                <label>Custom Payment Mode *</label>
                <input
                  type="text"
                  value={customModeOfPay}
                  onChange={(e) => setCustomModeOfPay(e.target.value)}
                  placeholder="e.g. Paytm, PhonePe, Sodexo"
                />
              </div>
            )}

            <div className="form-field">
              <label>Field *</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Stationary">Stationary</option>
                <option value="hisab kitaab">hisab kitaab</option>
                <option value="Groww">Groww</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {field === 'Other' && (
              <div className="form-field">
                <label>Custom Field *</label>
                <input
                  type="text"
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  placeholder="e.g. Travel, Rent, Books"
                />
              </div>
            )}

            <div className="form-field form-field--wide">
              <label>Description / Note</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <input
                className="submit-button"
                type="submit"
                value={`Save ${entryType === 'expense' ? 'Expense' : 'Income'}`}
              />
            </div>
          </div>
        </form>
        </>
      )}

      {activePage === 'entries' && (
        <>
          <section className="filter-panel" aria-label="Past entries filters">
            <div className="form-field">
              <label>Entry Type</label>
              <select
                value={entryTypeFilter}
                onChange={(e) => setEntryTypeFilter(e.target.value)}
              >
                <option value="all">All Entries</option>
                <option value="incoming">Incoming Only</option>
                <option value="outgoing">Outgoing Only</option>
              </select>
            </div>

            <div className="form-field">
              <label>Mode of Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Modes</option>
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Field</label>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                {fieldOptions.map((expense) => (
                  <option key={expense} value={expense}>{expense}</option>
                ))}
              </select>
            </div>
          </section>

          <p className="filter-count">
            Showing {filteredEntries.length} of {arr.length} entries
          </p>

          <ExpenseItem k={filteredEntries} />
        </>
      )}

      {activePage === 'refunds' && (
        <>
          <section className="refund-summary">
            <article className="stat-card stat-card--travel">
              <h4>Pending Refunds</h4>
              <p className="amount-travel">${pendingRefundTotal.toFixed(2)}</p>
              <small>{pendingRefunds.length} waiting to be received</small>
            </article>
          </section>

          <form className="expense-form" onSubmit={addRefund}>
            <div className="form-grid">
              <div className="form-field">
                <label>Refund Date *</label>
                <input
                  type="date"
                  value={refundDate}
                  onChange={(e) => setRefundDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Payment Mode *</label>
                <select
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value)}
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {refundMode === 'Other' && (
                <div className="form-field">
                  <label>Custom Payment Mode *</label>
                  <input
                    type="text"
                    value={customRefundMode}
                    onChange={(e) => setCustomRefundMode(e.target.value)}
                    placeholder="e.g. Razorpay, Paytm"
                  />
                </div>
              )}

              <div className="form-field">
                <label>Refund Amount *</label>
                <input
                  type="number"
                  min="0"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div className="form-field form-field--wide">
                <label>Description</label>
                <input
                  type="text"
                  value={refundDescription}
                  onChange={(e) => setRefundDescription(e.target.value)}
                  placeholder="e.g. Cancelled order, failed payment"
                />
              </div>

              <div className="form-actions">
                <input
                  className="submit-button"
                  type="submit"
                  value="Track Refund"
                />
              </div>
            </div>
          </form>

          <section className="refund-list" aria-label="Pending refunds">
            <h2>Pending Refunds</h2>
            {pendingRefunds.length === 0 ? (
              <p className="filter-count">No pending refunds</p>
            ) : pendingRefunds.map((refund) => (
              <article className="refund-card" key={refund._id}>
                <div>
                  <h3>${Number(refund.Amount || 0).toFixed(2)}</h3>
                  <p>{refund.Description || 'Refund pending'}</p>
                  <small>{refund.Datee} | {refund.ModeOfPayment}</small>
                </div>
                <button
                  className="limit-save-button"
                  type="button"
                  onClick={() => markRefundDone(refund._id)}
                >
                  Mark Done
                </button>
              </article>
            ))}
          </section>

          <section className="refund-list" aria-label="Completed refunds">
            <h2>Completed Refunds</h2>
            {completedRefunds.length === 0 ? (
              <p className="filter-count">No completed refunds yet</p>
            ) : completedRefunds.map((refund) => (
              <article className="refund-card refund-card--done" key={refund._id}>
                <div>
                  <h3>${Number(refund.Amount || 0).toFixed(2)}</h3>
                  <p>{refund.Description || 'Refund received'}</p>
                  <small>
                    Received {refund.CompletedDate || refund.Datee} | {refund.ModeOfPayment}
                  </small>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {activePage === 'summary' && (
        <>
          <Hader keyss={arr} />
          <Dashboard ke={arr} />
        </>
      )}

      {activePage === 'receipt' && (
        <section className="receipt-preview-card">
          <div>
            <span className="eyebrow">Weekly damage report</span>
            <h3>Print your shame.</h3>
            <p>See your top 5 expenses this week with a roast attached to each one.</p>
          </div>
          <button
            className={`weekly-damage-button ${new Date().getDay() === 0 ? 'weekly-damage-button--glow' : ''}`}
            type="button"
            onClick={() => setIsReceiptOpen(true)}
          >
            View Weekly Damage
          </button>
        </section>
      )}
      </main>
      {toast && (
        <div className="ramble-toast" role="status">
          <strong>{toast.message}</strong>
          <p>{toast.roast}</p>
        </div>
      )}
      {isReceiptOpen && (
        <WeeklyDamage entries={arr} onClose={() => setIsReceiptOpen(false)} />
      )}
    </div>
  );
}

export default ExpenseForm;
