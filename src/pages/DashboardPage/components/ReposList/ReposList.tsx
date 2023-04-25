import React, { useEffect, useState } from 'react';
import { RepoItem } from '../RepoItem/RepoItem';
import { useGetRepositoriesQuery } from '../../../../api/queryRepos';
import { ReposListStyled, ReposListWrapper, SearchWrapper, StyledInput } from './ReposList.styled';
import Paginator from './components/Paginator/Paginator';
import {
  selectCurrentPage,
  selectNodes,
  selectPageLimit,
  selectSearchStatus,
  selectUsersNodes,
  setCurrentPage,
} from '../../../../store/reposSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchRepoQuery } from '../../../../api/querySearch';
import { debounce } from '../../../../utils/debounce';
import { RequestStatus } from '../../../../types/requestStatuses';

export const ReposList: React.FC = () => {
  const defaultSearchValue = localStorage.getItem('searchValue');

  const { isError, isLoading, isSuccess, data } = useGetRepositoriesQuery({});
  const [searchRepo, { isSuccess: isSearchSuccess, data: searchResult }] = useLazySearchRepoQuery();
  const [pages, setPages] = useState<number>(0);
  const [searchValue, setSearchValue] = useState(defaultSearchValue ? defaultSearchValue : '');
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const currentPage = useSelector(selectCurrentPage);
  const nodes = useSelector(selectNodes);
  const usersNodes = useSelector(selectUsersNodes);

  const searchStatus = useSelector(selectSearchStatus);
  const pageLimit = useSelector(selectPageLimit);

  const dispatch = useDispatch();

  useEffect(() => {
    if ((isSuccess && !searchValue) || (!searchValue && usersNodes.length)) {
      const startIndex = currentPage * pageLimit - pageLimit;
      const endIndex = currentPage * pageLimit;

      const newRepos = usersNodes.filter(
        (repo: any, index: number) => index >= startIndex && index < endIndex,
      );

      setPages(Math.ceil(usersNodes.length / pageLimit));
      setFilteredRepos(newRepos);
    }
  }, [usersNodes, currentPage, searchValue]);

  useEffect(() => {
    if (
      (searchStatus === RequestStatus.SUCCESS && searchResult && searchValue) ||
      defaultSearchValue
    ) {
      if (nodes.length === 0 && defaultSearchValue) {
        searchRepo({ searchValue: defaultSearchValue });
      }

      const startIndex = currentPage * pageLimit - pageLimit;
      const endIndex = currentPage * pageLimit;

      const newRepos = nodes.filter(
        (repo: any, index: number) => index >= startIndex && index < endIndex,
      );

      setPages(Math.ceil(nodes.length / pageLimit));
      setFilteredRepos(newRepos);
    }
  }, [searchResult, currentPage, searchValue]);

  const debouncedSearch = debounce(searchRepo, 200);

  const handleChange = async (e: any) => {
    setSearchValue(e.target.value);
    dispatch(setCurrentPage(1));
    localStorage.setItem('searchValue', e.target.value);

    if (e.target.value) {
      await debouncedSearch({ searchValue: e.target.value });
    }
  };

  const renderList = () => {
    if (searchStatus === RequestStatus.LOADING || isLoading) {
      return <div>Loading...</div>;
    }

    if ((searchStatus === RequestStatus.SUCCESS || isSuccess) && filteredRepos.length > 0) {
      return (
        <>
          <ReposListStyled>
            {filteredRepos.map((repo: any, index: number) => {
              return <RepoItem key={index} data={repo} />;
            })}
          </ReposListStyled>
          <Paginator totalPages={pages} pageLimit={pageLimit}></Paginator>
        </>
      );
    }

    if (searchStatus === RequestStatus.SUCCESS && filteredRepos.length === 0) {
      return <div>No such result</div>;
    }

    if (searchStatus === RequestStatus.ERROR || isError) {
      <div>Loading error</div>;
    }
  };

  return (
    <ReposListWrapper>
      <SearchWrapper>
        <StyledInput
          type="search"
          placeholder="Search in github..."
          value={searchValue}
          onChange={handleChange}
        />
      </SearchWrapper>
      <div style={{ width: '100%', padding: '5px' }}>
        <span>{searchValue && isSearchSuccess ? 'Search result:' : 'My repositories:'}</span>
      </div>
      {renderList()}
    </ReposListWrapper>
  );
};
