function StatCard({ title, value, detail }) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <h2>{value}</h2>
      <span>{detail}</span>
    </article>
  );
}

export default StatCard;
