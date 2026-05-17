import { useEffect, useState } from 'react';

const isTravelExpense = (entry) =>
  entry.Expense?.trim().toLowerCase() === 'travel';

const getCurrentMonthEntries = (entries, currentMonth) =>
  entries?.filter(e => {
    const transactionMonth = new Date(e.Datee).getMonth() + 1;
    return transactionMonth === currentMonth;
  }) || [];

const getMonthlySpending = (entries) =>
  entries
    .filter(entry => !isTravelExpense(entry))
    .reduce((sum, e) => sum + Number(e.Outgoing || 0), 0);

const getTravelSpending = (entries) =>
  entries
    .filter(isTravelExpense)
    .reduce((sum, e) => sum + Number(e.Outgoing || 0), 0);

let Hader = (props) => {
  const [limit, setlimit] = useState(3000);
  const [monthlyLimit, setMonthlyLimit] = useState(3000);
  const [monthlyLimitInput, setMonthlyLimitInput] = useState('3000');
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [travelTotal, setTravelTotal] = useState(0);

  const current = new Date().getMonth() + 1;
  const limitKey = `${current}-limit`;

  useEffect(() => {
    const totals = JSON.parse(localStorage.getItem('monthlyTotals') || '{}');
    const last = current === 1 ? 12 : current - 1;
    const currentMonthEntries = getCurrentMonthEntries(props.keyss, current);

    const spentThisMonth = getMonthlySpending(currentMonthEntries);
    const travelSpentThisMonth = getTravelSpending(currentMonthEntries);

    // 2. Determine the initial limit for the current month
    let currentMonthBaseLimit;
    const savedLimit = localStorage.getItem(limitKey);

    if (savedLimit) {
      currentMonthBaseLimit = Number(savedLimit);
    } else {
      const overspent = Math.max(0, (totals[last] || 0) - 3000);
      currentMonthBaseLimit = 3000 - overspent;
      localStorage.setItem(limitKey, currentMonthBaseLimit);
    }

    setMonthlyLimit(currentMonthBaseLimit);
    setMonthlyLimitInput(String(currentMonthBaseLimit));
    setMonthlyTotal(spentThisMonth);
    setTravelTotal(travelSpentThisMonth);

    const remainingLimit = currentMonthBaseLimit - spentThisMonth;
    setlimit(remainingLimit);

    localStorage.setItem(
      'monthlyTotals',
      JSON.stringify({ ...totals, [current]: spentThisMonth })
    );

  }, [props.keyss, current, limitKey]);

  const updateMonthlyLimit = (e) => {
    e.preventDefault();
    const nextLimit = Number(monthlyLimitInput || 0);
    const currentMonthEntries = getCurrentMonthEntries(props.keyss, current);
    const spentThisMonth = getMonthlySpending(currentMonthEntries);
    const travelSpentThisMonth = getTravelSpending(currentMonthEntries);

    localStorage.setItem(limitKey, nextLimit);
    setMonthlyLimit(nextLimit);
    setMonthlyTotal(spentThisMonth);
    setTravelTotal(travelSpentThisMonth);
    setlimit(nextLimit - spentThisMonth);
  };

  return (
    <>
      <h1 className="limit-title">Remaining Limit: ${limit}</h1>
      <form className="limit-form" onSubmit={updateMonthlyLimit}>
        <div className="form-field">
          <label>Monthly Limit</label>
          <input
            type="number"
            min="0"
            value={monthlyLimitInput}
            onChange={(e) => setMonthlyLimitInput(e.target.value)}
          />
        </div>
        <button className="limit-save-button" type="submit">
          Save Limit
        </button>
      </form>
      <article className="stat-card stat-card--net">
        <h4>Monthly Limit</h4>
        <p className="amount-net">${Number(monthlyLimit || 0).toFixed(2)}</p>
        <small>Saved limit for this month</small>
      </article>
      <article className="stat-card stat-card--monthly">
  <h4>Monthly Total</h4>
  <p className="amount-monthly">
   ${Number(monthlyTotal || 0).toFixed(2)}
  </p>
  <small>Limit spending, excluding travel</small>
</article>
      <article className="stat-card stat-card--travel">
  <h4>Travel Total</h4>
  <p className="amount-travel">
   ${Number(travelTotal || 0).toFixed(2)}
  </p>
  <small>Tracked separately from monthly limit</small>
</article>

    </>
  );
};

export default Hader;
