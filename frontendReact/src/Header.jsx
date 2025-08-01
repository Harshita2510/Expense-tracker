import React, { useEffect, useState } from 'react';

let Hader = (props) => {
  const [limit, setlimit] = useState(3000);

  useEffect(() => {
    const current = new Date().getMonth() + 1;
    const totals = JSON.parse(localStorage.getItem('monthlyTotals') || '{}');
    const last = current === 1 ? 12 : current - 1;

    const spent =
      props.keyss?.length > 0
        ? props.keyss.reduce((sum, e) => sum + Number(e.Outgoing || 0), 0)
        : 0;

    // 🧠 Only "new" if monthlyTotals doesn't have current OR it's a new visit in current month
    const isNewMonth = !(current in totals);
    const limitAlreadySet =
      localStorage.getItem(`limitSet-${current}`) === 'true';
    // // 🔁 Set total for current month
    // const updatedTotals = { ...totals, [current]: spent };
    // localStorage.setItem('monthlyTotals', JSON.stringify(updatedTotals));
    if (isNewMonth && !limitAlreadySet) {
      const overspent = Math.max(0, (totals[last] || 0) - 3000);
      const newLimit = 3000 - overspent;
      localStorage.setItem(`limitSet-${current}`, 'true');
      localStorage.setItem(`${current}`, newLimit);

      // 🔁 Set total for current month

      localStorage.setItem(
        'monthlyTotals',
        JSON.stringify({ ...totals, [current]: spent })
      );
      setlimit(newLimit);
    } else {
      const savedLimit = Number(localStorage.getItem(`${current}`)) || 3000;
      localStorage.setItem(
        'monthlyTotals',
        JSON.stringify({ ...totals, [current]: spent })
      );
      setlimit(savedLimit - spent);
    }
  }, [props.keyss]);

  return (
    <>
      <h1>Limit:{limit}</h1>
    </>
  );
};

export default Hader;
