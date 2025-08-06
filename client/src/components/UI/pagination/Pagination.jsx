const Pagination = ({ totalItems = 0, itemsPerPage = 1, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages
      pages.push(1);
      if (currentPage > 2 && currentPage < totalPages - 1) {
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      } else {
        pages.push(2);
        pages.push('...');
      }
      // Always show last page
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
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
        </li>

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

        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;