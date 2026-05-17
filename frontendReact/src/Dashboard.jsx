let Dashboard = (props) => {
  let a = props.ke.map((e) => e.Incoming).reduce(add, 0);
  let b = props.ke.map((ek) => ek.Outgoing).reduce(add, 0);

  function add(accumulator, ele) {
    let q = (parseInt(accumulator) || 0) + (parseInt(ele) || 0);
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
</section>
 
    </div>
  );
};



export default Dashboard;
