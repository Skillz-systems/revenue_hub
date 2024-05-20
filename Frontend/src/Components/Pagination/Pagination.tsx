import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  paginationStyles: {
    containerClassName: string,
    activeClassName: string,
    activeLinkClassName: string,
    previousClassName: string,
    previousLinkClassName: string,
    nextClassName: string,
    nextLinkClassName: string,
    pageClassName: string,
    pageLinkClassName: string,
    breakLabel: string | JSX.Element,
    breakClassName: string,
    breakLinkClassName: string,
  };
  forcePage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  pageRangeDisplayed,
  marginPagesDisplayed,
  onPageChange,
  paginationStyles,
  forcePage,
}) => {
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
};

export default Pagination;
