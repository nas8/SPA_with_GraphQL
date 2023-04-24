import { Button, StyledPaginator } from './Paginator.styled';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPage, setCurrentPage } from '../../../../../../store/reposSlice';

interface PaginatorProps {
  totalPages: number;
  initCurrentPage?: number;
}

export const Paginator: React.FC<PaginatorProps> = ({ totalPages }) => {
  const pageNumbers = Array.from(
    { length: totalPages > 10 ? 10 : totalPages },
    (_, index) => index + 1,
  );

  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);

  const handleClick = (e: any) => {
    const page = parseInt(e.target.innerHTML);

    if (page) {
      dispatch(setCurrentPage(page));
    }
  };

  return (
    <StyledPaginator>
      {pageNumbers.map((pageNumber) => (
        <Button key={pageNumber} onClick={handleClick} isActive={pageNumber === currentPage}>
          {pageNumber}
        </Button>
      ))}
    </StyledPaginator>
  );
};

export default Paginator;
