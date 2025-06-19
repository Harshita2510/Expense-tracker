import { useEffect, useState } from 'react';
import ExpenseItem from './ExpenseItem';
import Dashboard from './Dashboard';
function ExpenseForm(){
  var [arr, setArr] = useState(JSON.parse(localStorage.getItem("chabi")) || []);

const dte = new Date();
// then use d.getDate(), d.getMonth(), etc.
//variables banaye
  const [date, setDate] = useState( dte.getDate() + "/" + (dte.getMonth() + 1) + "/" + dte.getFullYear(),);
  const [ModeOfPay, setModeOfPay] = useState('');
  const [income, setIncome] = useState('');
  const [outgo, setOutgo] = useState('');
  const [field, setField] = useState('Food');
  const [description, setDescription] = useState('');
useEffect(() => {
    localStorage.setItem("chabi", JSON.stringify(arr));
   }, [arr]);
  const Approv = (e) => {
    e.preventDefault();
    //object banya changed value ka
let entries = {
    Datee:
      dte.getDate() + "/" + (dte.getMonth() + 1) + "/" + dte.getFullYear(),
    ModeOfPayment:ModeOfPay,
    Incoming:income ,
    Outgoing: outgo ,
    Expense: field,
    Description: description,
  };
//usko array mein store kardia
   setArr([...arr,entries]);
    //console.log(arr);

    // Reset inputs so that user apna input daal sake
    setDate( dte.getDate() + "/" + (dte.getMonth() + 1) + "/" + dte.getFullYear());
    setModeOfPay('');
    setIncome('');
    setOutgo('');
    setField('Food');
    setDescription('');

  };

  return (
    <>
    {/* on submit */}
    <form onSubmit={(e)=>
        //call approve function 
    Approv(e)
    }>
        {/* but usse pehle */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Mode of Payment</th>
            <th>Incoming</th>
            <th>Outgoing</th>
            <th>Field</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
        <td>     {/*         jo variable ki value hai na vo change ho jaye input value mein */}
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
            </td>
            <td>
              <input type="text" value={ModeOfPay} onChange={(e) => setModeOfPay(e.target.value)} />
            </td>
            <td>
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
            </td>
            <td>
              <input type="number" value={outgo} onChange={(e) => setOutgo(e.target.value)} />
            </td>
            <td>
              <select value={field} onChange={(e) => setField(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Stationary">Stationary</option>
                <option value="hisab kitaab">hisab kitaab</option>
                <option value="Groww">Groww</option>
              </select>
            </td>
            <td>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </td>
            <td>
              <input type="submit" value="Approved" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
        <ExpenseItem k={arr}/>
        <Dashboard ke={arr}/>
        </>
  );

}

export default ExpenseForm