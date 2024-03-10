import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import './PaginatedItems.css'; // Import your CSS file

function PaginatedItems({ setPage, itemsCount, itemsPerPage }) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(itemsCount / itemsPerPage);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    const newOffset = (event.selected * itemsPerPage) % itemsCount;
    setItemOffset(newOffset);
  };

  return (
    <>
      <ReactPaginate
        // className='flex mt-8 gap-6 items-center rounded-xl text-white justify-center p-3 bg-shady'
        className='flex  sm:w-[90%] w-full flex-wrap  mx-auto p-2 font-semibold md:gap-2 justify-center'
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </>
  );
}

export default PaginatedItems;
