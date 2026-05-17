const ExpenseItem = (props) => {
  return (
    <div className="table-wrap">
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Mode of Payment</th>
          <th>Incoming</th>
          <th>Outgoing</th>
          <th>Field</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {(props.k || []).map((element, index) => {
          return (
            <tr key={element._id || index}>
              <td>{element.Datee}</td>
              <td>{element.ModeOfPayment}</td>
              <td>{element.Incoming}</td>
              <td>{element.Outgoing}</td>
              <td>{element.Expense}</td>
              <td>{element.Description}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr id="table-foot"></tr>
      </tfoot>
    </table>
    </div>
  );
};

export default ExpenseItem;
