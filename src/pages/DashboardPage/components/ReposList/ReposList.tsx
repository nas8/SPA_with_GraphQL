import React, { useEffect, useState } from 'react';
import { RepoItem } from '../RepoItem/RepoItem';
import { useGetRepositoriesQuery } from '../../../../api/queryRepos';
import { ReposListStyled, ReposListWrapper, SearchWrapper, StyledInput } from './ReposList.styled';
import Paginator from './components/Paginator/Paginator';
import {
  selectCurrentPage,
  selectNodes,
  selectSearchStatus,
  selectUsersNodes,
  setCurrentPage,
} from '../../../../store/reposSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchRepoQuery } from '../../../../api/querySearch';
import { debounce } from '../../../../utils/debounce';
import { RequestStatus } from '../../../../types/requestStatuses';

const NUMBER_OF_REPOS = 10;

export const ReposList: React.FC = () => {
  const defaultSearchValue = localStorage.getItem('searchValue');

  const usersNodes = useSelector(selectUsersNodes);
  const { isError, isLoading, isSuccess, data } = useGetRepositoriesQuery({});
  const [
    searchRepo,
    { isSuccess: isSearchSuccess, data: searchResult, isLoading: isSearchLoading },
  ] = useLazySearchRepoQuery();
  const [pages, setPages] = useState<number>(0);
  const [searchValue, setSearchValue] = useState(defaultSearchValue ? defaultSearchValue : '');
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const currentPage = useSelector(selectCurrentPage);
  const nodes = useSelector(selectNodes);
  const repos = data?.nodes;
  const totalRepos = data?.totalCount;

  const searchStatus = useSelector(selectSearchStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if ((isSuccess && !searchValue) || (!searchValue && usersNodes.length)) {
      const startIndex = currentPage * NUMBER_OF_REPOS - NUMBER_OF_REPOS;
      const endIndex = currentPage * NUMBER_OF_REPOS;

      const newRepos = usersNodes.filter(
        (repo: any, index: number) => index >= startIndex && index < endIndex,
      );

      setPages(Math.ceil(totalRepos / 10));
      setFilteredRepos(newRepos);
    }
  }, [repos, currentPage, searchValue]);

  useEffect(() => {
    if (
      (searchStatus === RequestStatus.SUCCESS && searchResult && searchValue) ||
      defaultSearchValue
    ) {
      if (nodes.length === 0 && defaultSearchValue) {
        searchRepo({ searchValue: defaultSearchValue });
      }

      const startIndex = currentPage * NUMBER_OF_REPOS - NUMBER_OF_REPOS;
      const endIndex = currentPage * NUMBER_OF_REPOS;

      const newRepos = nodes.filter(
        (repo: any, index: number) => index >= startIndex && index < endIndex,
      );

      setPages(Math.ceil(nodes.length / 10));
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
          <Paginator totalPages={pages}></Paginator>
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
