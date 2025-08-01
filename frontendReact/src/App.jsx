import ExpenseForm from './ExpenseForm';
import Hader from './Header';

function App() {
  return (
    <div
      style={{
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >

      <ExpenseForm />
    </div>
  );
}

export default App;
