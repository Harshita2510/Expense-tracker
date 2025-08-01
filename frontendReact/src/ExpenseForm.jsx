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

  const Approv = (e) => {
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
      <form onSubmit={(e) => Approv(e)}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              {[
                'Date',
                'Mode of Payment',
                'Incoming',
                'Outgoing',
                'Field',
                'Description',
                'Action',
              ].map((item, i) => (
                <th
                  key={i}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'left',
                  }}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="text"
                  value={ModeOfPay}
                  onChange={(e) => setModeOfPay(e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="number"
                  value={outgo}
                  onChange={(e) => setOutgo(e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Food">Food</option>
                  <option value="Stationary">Stationary</option>
                  <option value="hisab kitaab">hisab kitaab</option>
                  <option value="Groww">Groww</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="submit"
                  value="Approved"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    
      <ExpenseItem k={arr} />
      <Dashboard ke={arr} />
     
    </>
  );
}

export default ExpenseForm;
