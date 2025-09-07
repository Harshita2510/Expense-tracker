import { useEffect, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import Dashboard from './Dashboard';
import Hader from './Header';

function ExpenseForm() {
  var [arr, setArr] = useState(JSON.parse(localStorage.getItem('chabi')) || []);

  const dte = new Date();

  const [date, setDate] = useState(
    dte.toISOString().slice(0, 10)
  );
  const [ModeOfPay, setModeOfPay] = useState('');
  const [income, setIncome] = useState('');
  const [outgo, setOutgo] = useState('');
  const [field, setField] = useState('Food');
  const [description, setDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('chabi', JSON.stringify(arr));
  }, [arr]);

  const Approv = async (e) => {
    e.preventDefault();
    let entries = {
      Datee:
      dte.toISOString().slice(0, 10),
      ModeOfPayment: ModeOfPay,
      Incoming: income,
      Outgoing: outgo,
      Expense: field,
      Description: description,
    };

  //   await fetch('http://localhost:3000/exp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(entries)
  // });

    setArr([...arr, entries]);

    setDate(
      dte.toISOString().slice(0, 10)
    );
    setModeOfPay('');
    setIncome('');
    setOutgo('');
    setField('Food');
    setDescription('');
  };

  return (
    <>
    < Hader keyss={arr}  />

      <Dashboard ke={arr} />
<form onSubmit={(e) => Approv(e)}>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // 3 equal columns
      gap: '20px',
      marginBottom: '20px',
      padding: '20px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
      width: '100%',          // covers full width
      boxSizing: 'border-box',
    }}
  >
    {/* Date */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Date *</label>
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      />
    </div>

    {/* Mode of Payment */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Mode of Payment</label>
      <input
        type="text"
        value={ModeOfPay}
        onChange={(e) => setModeOfPay(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      />
    </div>

    {/* Field */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Field *</label>
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      >
        <option value="Food">Food</option>
        <option value="Stationary">Stationary</option>
        <option value="hisab kitaab">hisab kitaab</option>
        <option value="Groww">Groww</option>
      </select>
    </div>

    {/* Incoming */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Incoming Amount</label>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      />
    </div>

    {/* Outgoing */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Outgoing Amount</label>
      <input
        type="number"
        value={outgo}
        onChange={(e) => setOutgo(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      />
    </div>

    {/* Empty spacer for alignment */}
    <div></div>

    {/* Description (spans full width) */}
    <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '500', marginBottom: '6px' }}>Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' }}
      />
    </div>

    {/* Submit Button (spans full width) */}
    <div style={{ gridColumn: 'span 3' }}>
      <input
        type="submit"
        value="Approved"
        style={{
          width: '100%',
          padding: '14px',
          background: '#4CAF50',
          color: '#fff',
          fontWeight: '600',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      />
    </div>
  </div>
</form>

    
      <ExpenseItem k={arr} />
    
     
    </>
  );
}

export default ExpenseForm;
