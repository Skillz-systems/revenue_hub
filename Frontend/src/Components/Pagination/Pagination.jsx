import ReactPaginate from "react-paginate";

export default function Pagination({
  pageCount,
  pageRangeDisplayed,
  marginPagesDisplayed,
  onPageChange,
  paginationStyles,
  forcePage,
}) {
  const {
    containerClassName,
    activeClassName,
    activeLinkClassName,
    previousClassName,
    previousLinkClassName,
    nextClassName,
    nextLinkClassName,
    pageClassName,
    pageLinkClassName,
    breakLabel,
    breakClassName,
    breakLinkClassName,
  } = paginationStyles;

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      onPageChange={onPageChange}
      containerClassName={containerClassName}
      activeClassName={activeClassName}
      activeLinkClassName={activeLinkClassName}
      previousClassName={previousClassName}
      previousLinkClassName={previousLinkClassName}
      nextClassName={nextClassName}
      nextLinkClassName={nextLinkClassName}
      pageClassName={pageClassName}
      pageLinkClassName={pageLinkClassName}
      breakLabel={breakLabel}
      breakClassName={breakClassName}
      breakLinkClassName={breakLinkClassName}
      renderOnZeroPageCount={null}
      forcePage={forcePage}
    />
  );
}
