import { useRef, useState } from 'react';

const ExpenseItem = ({ k = [], onDelete }) => {
  const tapTracker = useRef({});
  const [deleteProgress, setDeleteProgress] = useState(null);

  const handleEntryTap = (entry) => {
    if (!entry?._id || !onDelete) return;

    const current = tapTracker.current[entry._id] || { count: 0, timer: null };
    const nextCount = current.count + 1;

    window.clearTimeout(current.timer);
    tapTracker.current[entry._id] = {
      count: nextCount,
      timer: window.setTimeout(() => {
        tapTracker.current[entry._id] = { count: 0, timer: null };
        setDeleteProgress(null);
      }, 6000),
    };

    if (nextCount >= 6) {
      window.clearTimeout(tapTracker.current[entry._id].timer);
      tapTracker.current[entry._id] = { count: 0, timer: null };
      setDeleteProgress({ id: entry._id, message: 'Deleting…' });
      Promise.resolve(onDelete(entry._id)).finally(() => {
        setDeleteProgress(null);
      });
      return;
    }

    setDeleteProgress({
      id: entry._id,
      message: `${6 - nextCount} more taps to delete`,
    });
  };

  return (
    <div className="table-wrap">
    {k.length === 0 ? (
      <p className="empty-table-message">No entries to show.</p>
    ) : (
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
        {k.map((element, index) => {
          return (
            <tr
              key={element._id || index}
              onPointerUp={() => handleEntryTap(element)}
              title="Tap 6 times to delete"
            >
              <td>{element.Datee}</td>
              <td>{element.ModeOfPayment}</td>
              <td>{element.Incoming}</td>
              <td>{element.Outgoing}</td>
              <td>{element.Expense}</td>
              <td>
                {element.Description}
                {deleteProgress?.id === element._id && (
                  <span className="delete-hint">{deleteProgress.message}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr id="table-foot"></tr>
      </tfoot>
    </table>
    )}
    </div>
  );
};

export default ExpenseItem;
