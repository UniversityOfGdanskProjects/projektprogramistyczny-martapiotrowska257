export default function ProduktLayout({ children }) {
  return (
    <div>
      Szczegóły produktu
      <div id="back-to-products-list">
        <a href="/">Wróć do listy produktów</a>
      </div>
      {children}
    </div>
  );
}
