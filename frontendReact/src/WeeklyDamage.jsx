const roastForEntry = (entry) => {
  const category = entry.Expense?.toLowerCase() || '';
  const description = entry.Description || entry.Expense || 'this';

  if (category.includes('food') || description.toLowerCase().includes('zomato')) {
    return 'The stomach won. The budget lost.';
  }
  if (category.includes('travel') || description.toLowerCase().includes('uber') || description.toLowerCase().includes('auto')) {
    return 'Paying to move around while your savings stand still.';
  }
  if (category.includes('shopping') || description.toLowerCase().includes('shirt')) {
    return 'A bold fashion choice. Financially, less bold.';
  }
  if (category.includes('entertainment')) {
    return 'At least the dopamine had good lighting.';
  }
  return 'A purchase was made. Accountability has entered the chat.';
};

const getWeekStart = () => {
  const date = new Date();
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const WeeklyDamage = ({ entries, onClose }) => {
  const weekStart = getWeekStart();
  const topEntries = entries
    .filter((entry) => Number(entry.Outgoing || 0) > 0)
    .filter((entry) => new Date(entry.Datee) >= weekStart)
    .sort((a, b) => Number(b.Outgoing || 0) - Number(a.Outgoing || 0))
    .slice(0, 5);

  const totalDamage = topEntries.reduce(
    (sum, entry) => sum + Number(entry.Outgoing || 0),
    0
  );

  const shareReceipt = async () => {
    const text = `GuiltTrip Weekly Damage: ₹${totalDamage.toFixed(2)}. My wallet requests privacy during this difficult time.`;

    if (navigator.share) {
      await navigator.share({ title: 'Weekly Receipt of Shame', text });
      return;
    }

    await navigator.clipboard?.writeText(text);
  };

  return (
    <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Weekly Receipt of Shame">
      <section className="receipt-paper">
        <button className="receipt-close" type="button" onClick={onClose}>×</button>
        <div className="receipt-edge receipt-edge--top" />
        <div className="receipt-content">
          <p className="receipt-kicker">GuiltTrip presents</p>
          <h2>Weekly Receipt of Shame</h2>
          <p className="receipt-subtitle">Top 5 financial jump scares</p>

          {topEntries.length === 0 ? (
            <p className="receipt-empty">No expensive disasters this week. Suspicious, but okay.</p>
          ) : topEntries.map((entry) => (
            <article className="receipt-line" key={entry._id}>
              <div>
                <strong>{entry.Description || entry.Expense}</strong>
                <span>{entry.Expense} · {entry.Datee}</span>
                <em>{roastForEntry(entry)}</em>
              </div>
              <b>₹{Number(entry.Outgoing || 0).toFixed(2)}</b>
            </article>
          ))}

          <div className="receipt-total">
            <span>Total Damage</span>
            <strong>₹{totalDamage.toFixed(2)}</strong>
          </div>
          <div className="receipt-barcode" aria-hidden="true" />
          <button className="receipt-share" type="button" onClick={shareReceipt}>
            Share to Instagram Story
          </button>
        </div>
        <div className="receipt-edge receipt-edge--bottom" />
      </section>
    </div>
  );
};

export default WeeklyDamage;
