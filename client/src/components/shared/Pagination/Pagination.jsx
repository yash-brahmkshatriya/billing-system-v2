import React, { useMemo } from 'react';
import { kNeighborsOfIndex } from '@/utils/generalUtils';
import {
  FastForwardFill,
  SkipBackwardFill,
  CaretRightFill,
  CaretLeftFill,
} from 'react-bootstrap-icons';
import './pagination.scss';
import classNames from 'classnames';

const PageButton = ({
  active = false,
  disabled = false,
  onClick,
  children,
  isPrevFromActive = false,
  isNextFromActive = false,
}) => (
  <button
    onClick={onClick}
    type='button'
    disabled={disabled}
    className={classNames('page-button', {
      active: active,
      'hide-left-border': isNextFromActive,
      'hide-right-border': isPrevFromActive,
    })}
  >
    {children}
  </button>
);

const JumpToFirstPage = ({ onClick, disabled }) => (
  <PageButton onClick={onClick} disabled={disabled}>
    <SkipBackwardFill className='page-text icon' />
  </PageButton>
);

const JumpToLastPage = ({ onClick, disabled }) => (
  <PageButton onClick={onClick} disabled={disabled}>
    <FastForwardFill className='page-text icon' />
  </PageButton>
);

const PrevPage = ({ onClick, disabled }) => (
  <PageButton onClick={onClick} disabled={disabled} isPrevFromActive={disabled}>
    <CaretLeftFill className='page-text icon' />
  </PageButton>
);

const NextPage = ({ onClick, disabled }) => (
  <PageButton onClick={onClick} disabled={disabled} isNextFromActive={disabled}>
    <CaretRightFill className='page-text icon' />
  </PageButton>
);

const Pagination = ({
  page,
  setPage,
  pageSize = 20,
  totalCount,
  totalPages,
}) => {
  const pagesToDisplay = useMemo(() => {
    return kNeighborsOfIndex([...Array(totalPages).keys()], page - 1, 5).map(
      (x) => ++x
    );
  }, [page, setPage]);

  const { startEntryNumber, endEntryNumber } = useMemo(() => {
    return {
      startEntryNumber: 1 + (page - 1) * pageSize,
      endEntryNumber: 1 + page * pageSize,
    };
  }, [page, pageSize]);

  return (
    <div className='d-flex align-items-center pagination'>
      <div className='entries-text me-3'>
        Showing {page} of {totalPages} pages{' '}
      </div>
      <div className='d-flex'>
        <JumpToFirstPage onClick={() => setPage(1)} disabled={page === 1} />
        <PrevPage
          onClick={() => setPage((prev) => (prev === 1 ? 1 : prev - 1))}
          disabled={page === 1}
        />
        {pagesToDisplay[0] > 1 ? (
          <PageButton onClick={() => null}>
            <span className='page-text'>...</span>
          </PageButton>
        ) : null}
        {pagesToDisplay.map((pageNo) => (
          <PageButton
            onClick={() => setPage(pageNo)}
            active={page === pageNo}
            key={`page-${pageNo}`}
            isNextFromActive={pageNo === page + 1}
            isPrevFromActive={pageNo === page - 1}
          >
            <span className='page-text'>{pageNo}</span>
          </PageButton>
        ))}
        {pagesToDisplay?.at(-1) < totalPages ? (
          <PageButton onClick={() => null}>
            <span className='page-text'>...</span>
          </PageButton>
        ) : null}
        <NextPage
          onClick={() =>
            setPage((prev) => (prev === totalPages ? totalPages : prev + 1))
          }
          disabled={page === totalPages}
        />
        <JumpToLastPage
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        />
      </div>
    </div>
  );
};

export default Pagination;
