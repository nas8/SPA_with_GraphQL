import React, { useEffect, useState } from 'react';
import { RepoItem } from '../RepoItem/RepoItem';
import { useGetRepositoriesQuery } from '../../../../api/queryRepos';
import { ReposListStyled, ReposListWrapper, SearchWrapper, StyledInput } from './ReposList.styled';
import Paginator from './components/Paginator/Paginator';
import {
  selectCurrentPage,
  selectNodes,
  selectUsersNodes,
  setCurrentPage,
} from '../../../../store/reposSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchRepoQuery } from '../../../../api/querySearch';
import { debounce } from '../../../../utils/debounce';

const NUMBER_OF_REPOS = 10;

export const ReposList: React.FC = () => {
  const defaultSearchValue = localStorage.getItem('searchValue');

  const usersNodes = useSelector(selectUsersNodes);
  const { isLoading, isSuccess, data } = useGetRepositoriesQuery({});
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
    if ((isSearchSuccess && searchResult && searchValue) || defaultSearchValue) {
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

  const debouncedSearch = debounce(searchRepo, 350);

  const handleChange = (e: any) => {
    debouncedSearch({ searchValue: e.target.value });
    localStorage.setItem('searchValue', e.target.value);

    setSearchValue(e.target.value);
    dispatch(setCurrentPage(1));
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
      {(isSearchLoading || isLoading) && <div>Loading...</div>}
      {isSuccess && !isSearchLoading && (
        <>
          <ReposListStyled>
            {filteredRepos.map((repo: any, index: number) => {
              return <RepoItem key={index} data={repo} />;
            })}
          </ReposListStyled>
          <Paginator totalPages={pages}></Paginator>
        </>
      )}
    </ReposListWrapper>
  );
};
