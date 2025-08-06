const Loader = ({isLoading, error}) => {
  {isLoading && (
    <p style={{ color: "orange" }}>
      ⏳ Caricamento dati dal server... (ora vedi dati locali)
    </p>
  )}

  {error && (
    <p style={{ color: "red" }}>
      ⚠️ Errore: {error}
    </p>
  )}
}
export default Loader;