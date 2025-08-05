import React, { useEffect, useState } from 'react';

let Hader = (props) => {
  const [limit, setlimit] = useState(3000);

  useEffect(() => {
    const current = new Date().getMonth() + 1;
    const totals = JSON.parse(localStorage.getItem('monthlyTotals') || '{}');
    const last = current === 1 ? 12 : current - 1;

    // 1. Calculate the total spending for the CURRENT month
    const spentThisMonth =
      props.keyss?.length > 0
        ? props.keyss
            .filter(e => {
              const transactionMonth = new Date(e.Datee).getMonth() + 1;
              return transactionMonth === current;
            })
            .reduce((sum, e) => sum + Number(e.Outgoing || 0), 0)
        : 0;

    // 2. Determine the initial limit for the current month
    let currentMonthBaseLimit;
    const limitKey = `${current}-limit`;
    const savedLimit = localStorage.getItem(limitKey);

    if (savedLimit) {
      currentMonthBaseLimit = Number(savedLimit);
    } else {
      const overspent = Math.max(0, (totals[last] || 0) - 3000);
      currentMonthBaseLimit = 3000 - overspent;
      localStorage.setItem(limitKey, currentMonthBaseLimit);
    }

    // 3. Calculate the final remaining limit
    const remainingLimit = currentMonthBaseLimit - spentThisMonth;
    setlimit(remainingLimit);

    // 4. Update the total spending for the current month in localStorage
    localStorage.setItem(
      'monthlyTotals',
      JSON.stringify({ ...totals, [current]: spentThisMonth })
    );

  }, [props.keyss]);
  return (
    <>
      <h1>Limit:{limit}</h1>
    </>
  );
};

export default Hader;
