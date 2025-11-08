const Pagination = ({ totalItems = 0, itemsPerPage = 1, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }


      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pagesToShow = getPageNumbers();

  return (
    <nav className="paginationWrap">
      <ul className="pagination cursorPointer">


        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
        </li>

        {pagesToShow.map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? 'active' : ''}`}
          >
            {page === '...' ? (
              <button className="page-link">...</button>
            ) : (
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            )}
          </li>
        ))}

        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </li>


      </ul>
    </nav>
  );
};

export default Pagination;