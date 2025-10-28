const SidebarCategories = ({repartoSelezionato, categories, categoryLabels, apriFinestraFiltro}) => {

    return(
        <div className="categories">
          {repartoSelezionato && (
            <>
              {categories.map((campo) => (
                <div key={campo}>
                  <a href="#" onClick={(e) => { e.preventDefault(); apriFinestraFiltro(campo); }} style={{ textTransform: "capitalize" }}>
                    {categoryLabels[campo] || campo}
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
        )
}
export default SidebarCategories;