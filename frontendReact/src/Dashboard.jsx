import React from 'react';

let Dashboard = (props) => {
  let a = props.ke.map((e) => e.Incoming).reduce(add, 0);
  let b = props.ke.map((ek) => ek.Outgoing).reduce(add, 0);

  function add(accumulator, ele) {
    let q = (parseInt(accumulator) || 0) + (parseInt(ele) || 0);
    return q;
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        maxWidth: '400px',
      }}
    >
      <h4 style={headingStyle}>Incoming</h4>
      <p style={valueStyle}>{a}</p>

      <h4 style={headingStyle}>Outgoing</h4>
      <p style={valueStyle}>{b}</p>

      <h4 style={headingStyle}>Total</h4>
      <p style={valueStyle}>{a - b}</p>
    </div>
  );
};

const headingStyle = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '4px',
  marginTop: '12px',
};

const valueStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#4a4a4a',
};

export default Dashboard;
