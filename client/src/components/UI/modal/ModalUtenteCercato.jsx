const ModalUtenteCercato = ({ utenteTrovato, getColorClass, setMostraModalInfo }) => {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>🧾 Информация о пользователе</h3>
        {utenteTrovato ? (
          <ul>
            <li key="reparto"><strong>Отдел:</strong> {utenteTrovato.reparto}</li>
            <li key="stanza"><strong>Комната:</strong> {utenteTrovato.stanza}</li>
            <li key="cognome" className="blue">{utenteTrovato.cognome}</li>
            <li key="bagno" className="verde"><strong>Ванна:</strong> {utenteTrovato.bagno}</li>
            <li key="barba" className="verde"><strong>Борода:</strong> {utenteTrovato.barba}</li>
            <li key="autonomia"><strong>Автономия:</strong> {utenteTrovato.autonomia}</li>
            <li key="vestiti"><strong>Одежда:</strong> {utenteTrovato.vestiti}</li>
            <li key="alimentazione">
              <strong className={getColorClass(utenteTrovato.alimentazione) || ''}>Питание:</strong> {utenteTrovato.alimentazione} {/* 🔥 ФИКС: Передал аргумент + fallback */}
            </li>
            <li key="accessori"><strong>Аксессуары:</strong> {utenteTrovato.accessori}</li>
            <li key="altro"><strong>Другое:</strong> {utenteTrovato.altro}</li>
          </ul>
        ) : (
          <p>⚠️ Пользователь не найден.</p>
        )}
        <button type="button" onClick={() => setMostraModalInfo(false)}>❌ Закрыть</button>
      </div>
    </div>
  );
};
export default ModalUtenteCercato;