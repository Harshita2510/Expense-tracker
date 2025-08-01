import React from 'react';

const ExpenseItem = (props) => {
  return (
    <table
      style={{
        width: '100%',
        tableLayout: 'fixed',
        border: '3px solid purple',
        borderCollapse: 'collapse',
        marginTop: '20px',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Mode of Payment</th>
          <th style={thStyle}>Incoming</th>
          <th style={thStyle}>Outgoing</th>
          <th style={thStyle}>Field</th>
          <th style={thStyle}>Description</th>
        </tr>
      </thead>
      <tbody>
        {(props.k || []).map((element, index) => {
          return (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td style={tdStyle}>{element.Datee}</td>
              <td style={tdStyle}>{element.ModeOfPayment}</td>
              <td style={tdStyle}>{element.Incoming}</td>
              <td style={tdStyle}>{element.Outgoing}</td>
              <td style={tdStyle}>{element.Expense}</td>
              <td style={tdStyle}>{element.Description}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr id="table-foot"></tr>
      </tfoot>
    </table>
  );
};

// ✅ Extracted inline styles to keep JSX readable
const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  fontWeight: 'bold',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px',
};

export default ExpenseItem;
