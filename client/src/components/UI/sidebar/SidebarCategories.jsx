
const SidebarCategories = ({repartoSelezionato, categories, apriFinestraFiltro}) => {

	return(
        <div className="categories">
          {repartoSelezionato && (
            <>
              {categories.map((campo) => (
                <div key={campo}>
                  <a href="#" onClick={(e) => { e.preventDefault(); apriFinestraFiltro(campo); }} style={{ textTransform: "capitalize" }}>
                    {campo}
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
		)
}
export default SidebarCategories;