import ExpenseForm from './ExpenseForm';
import Hader from './Header';

function App() {
  return (
    
    <div
      style={{
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#EEE2DF',
        minHeight: '100vh',
      }}
    >
<h1 
style={{
  textAlign:'center',
  color:'#06D6A0',
  fontSize:'65px',
  padding:'0px',
 
}}
>Budget Tracker</h1>
      <ExpenseForm />
    </div>
  );
}

export default App;
