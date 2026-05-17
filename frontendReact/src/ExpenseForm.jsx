import { useEffect, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import Dashboard from './Dashboard';
import Hader from './Header';

function ExpenseForm() {
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
  const [income, setIncome] = useState('');
  const [outgo, setOutgo] = useState('');
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesResponse, refundsResponse] = await Promise.all([
          fetch('https://expense-tracker-e9gg.onrender.com'),
         // fetch('/api/refunds'),
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
  }, []);

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
      Incoming: Number(income || 0),
      Outgoing: Number(outgo || 0),
      Expense: expenseField,
      Description: description,
    };

    try {
      const response = await fetch('/api/expenses', {
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
    setIncome('');
    setOutgo('');
    setField('Food');
    setCustomField('');
    setDescription('');
  };

  const menuItems = [
    { id: 'form', label: 'Add Entry' },
    { id: 'entries', label: 'Past Entries' },
    { id: 'summary', label: 'Summary' },
    { id: 'refunds', label: 'Refunds' },
  ];

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
      const response = await fetch('/api/refunds', {
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
      const response = await fetch(`/api/refunds/${refundId}/done`, {
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

  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Menu: {menuItems.find((item) => item.id === activePage)?.label}
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
            {item.label}
          </button>
        ))}
      </nav>
      {isLoading && (
        <p className="status-message">Loading expenses...</p>
      )}
      {error && (
        <p className="status-message status-message--error">{error}</p>
      )}
      {activePage === 'form' && (
        <form className="expense-form" onSubmit={(e) => Approv(e)}>
          <div className="form-grid">
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

            <div className="form-field">
              <label>Incoming Amount</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Outgoing Amount</label>
              <input
                type="number"
                value={outgo}
                onChange={(e) => setOutgo(e.target.value)}
              />
            </div>

            <div></div>

            <div className="form-field form-field--wide">
              <label>Description</label>
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
                value="Approved"
              />
            </div>
          </div>
        </form>
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
    </>
  );
}

export default ExpenseForm;
