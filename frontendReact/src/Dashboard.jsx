let Dashboard = (props) => {
  let a = props.ke.map((e) => e.Incoming).reduce(add, 0);
  let b = props.ke.map((ek) => ek.Outgoing).reduce(add, 0);
  let cashBalance = props.ke
    .filter((entry) => entry.ModeOfPayment?.trim().toLowerCase() === 'cash')
    .reduce((sum, entry) => add(sum, Number(entry.Incoming || 0) - Number(entry.Outgoing || 0)), 0);
  let accountBalance = props.ke
    .filter((entry) => entry.ModeOfPayment?.trim().toLowerCase() !== 'cash')
    .reduce((sum, entry) => add(sum, Number(entry.Incoming || 0) - Number(entry.Outgoing || 0)), 0);

  function add(accumulator, ele) {
    let q = (Number(accumulator) || 0) + (Number(ele) || 0);
    return q;
  }

  return (
    <div>
   <section className="stats-grid">
  {/* Incoming */}
  <article className="stat-card stat-card--income">
    <h4>Incoming</h4>
    <p className="amount-income">
      ${a.toFixed(2)}
    </p>
    <small>Total income this period</small>
  </article>

  {/* Outgoing */}
  <article className="stat-card stat-card--expense">
    <h4>Outgoing</h4>
    <p className="amount-expense">
      ${b.toFixed(2)}
    </p>
    <small>0.0% of limit used</small>
  </article>

  {/* Net Total */}
  <article className="stat-card stat-card--net">
    <h4>Net Total</h4>
    <p className="amount-net">
      ${(a - b).toFixed(2)}
    </p>
    <small>Income - Outgoing</small>
  </article>

  <article className="stat-card stat-card--cash">
    <h4>Cash Balance</h4>
    <p className="amount-cash">
      ${cashBalance.toFixed(2)}
    </p>
    <small>Cash incoming - cash outgoing</small>
  </article>

  <article className="stat-card stat-card--account">
    <h4>Account Balance</h4>
    <p className="amount-account">
      ${accountBalance.toFixed(2)}
    </p>
    <small>Online/account incoming - outgoing</small>
  </article>
</section>
 
    </div>
  );
};



export default Dashboard;
