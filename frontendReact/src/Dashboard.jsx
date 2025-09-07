import React from 'react';

let Dashboard = (props) => {
  let a = props.ke.map((e) => e.Incoming).reduce(add, 0);
  let b = props.ke.map((ek) => ek.Outgoing).reduce(add, 0);

  function add(accumulator, ele) {
    let q = (parseInt(accumulator) || 0) + (parseInt(ele) || 0);
    return q;
  }

  return (
    <div>
   <section
  style={{
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 cards side by side
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box',
  }}
>
  {/* Incoming */}
  <article
    style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#e6f9ec', // light green
      border: '1px solid #d1f2d9',
    }}
  >
    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Incoming</h4>
    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>
      ${a.toFixed(2)}
    </p>
    <small style={{ fontSize: '13px', color: '#6b7280' }}>Total income this period</small>
  </article>

  {/* Outgoing */}
  <article
    style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#fdeaea', // light red
      border: '1px solid #f5c2c2',
    }}
  >
    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Outgoing</h4>
    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>
      ${b.toFixed(2)}
    </p>
    <small style={{ fontSize: '13px', color: '#6b7280' }}>0.0% of limit used</small>
  </article>

  {/* Net Total */}
  <article
    style={{
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f0fdf4', // very light green
      border: '1px solid #bbf7d0',
    }}
  >
    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Net Total</h4>
    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>
      ${(a - b).toFixed(2)}
    </p>
    <small style={{ fontSize: '13px', color: '#6b7280' }}>Income - Outgoing</small>
  </article>
</section>
 
    </div>
  );
};



export default Dashboard;
