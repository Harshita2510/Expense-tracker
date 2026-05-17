import { useEffect, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import Dashboard from './Dashboard';
import Hader from './Header';

function ExpenseForm() {
  var [arr, setArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('form');

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

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetch('/api/expenses');

        if (!response.ok) {
          throw new Error('Could not load expenses');
        }

        const expenses = await response.json();
        setArr(expenses);
      } catch {
        setError('Could not connect to the expense database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
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
  ];

  const paymentModes = [
    'Cash',
    'UPI',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
    ...arr.map((entry) => entry.ModeOfPayment).filter(Boolean),
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

  return (
    <>
      <nav className="menu-bar" aria-label="Main sections">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-button ${activePage === item.id ? 'menu-button--active' : ''}`}
            type="button"
            onClick={() => setActivePage(item.id)}
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
