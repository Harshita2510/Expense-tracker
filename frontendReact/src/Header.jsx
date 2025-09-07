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
      <h1 
      style={{
          color:'#696773',
          textAlign:'center',
          fontSize:'25px',
          padding:'0px'
      }}
      >Current Limit: ${limit}</h1>
      <article
  style={{
    paddingTop:'25px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#fff7ed', // light orange/yellow
    border: '1px solid #fed7aa',
  }}
>
  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Monthly Total</h4>
  <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: '#d97706' }}>
   ${(() => {
    const current = new Date().getMonth() + 1;
    const totals = JSON.parse(localStorage.getItem('monthlyTotals') || '{}');
    return (totals[current] || 0).toFixed(2);
  })()}
  </p>
  <small style={{ fontSize: '13px', color: '#6b7280' }}>Total for this month</small>
</article>

    </>
  );
};

export default Hader;
