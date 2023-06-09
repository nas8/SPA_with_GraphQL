import { createSlice } from '@reduxjs/toolkit';
import { githubApi } from '../api/queryRepos';
import { RootState } from './store';
import { githubApiSearch } from '../api/querySearch';
import { RequestStatus } from '../types/requestStatuses';

export interface Repo {
  name: string;
  owner: {
    login: string;
  };
  pushedAt: string;
  stargazerCount: number;
  url: string;
}

interface reposSliceState {
  usersNodes: Repo[];
  nodes: Repo[];
  totalCount: number;
  currentPage: number;
  currentRepoName: string;
  currentRepoOwner: string;
  searchStatus: string;
  pageLimit: number;
}

const initialState: reposSliceState = {
  usersNodes: [],
  nodes: [],
  totalCount: 0,
  currentPage: localStorage.getItem('currentPage')
    ? Number(localStorage.getItem('currentPage'))
    : 1,
  currentRepoName: '',
  currentRepoOwner: '',
  searchStatus: RequestStatus.IDLE,
  pageLimit: 10,
};

export const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      localStorage.setItem('currentPage', action.payload);
    },
    setCurrentRepoName: (state, action) => {
      state.currentRepoName = action.payload;
      localStorage.setItem('currentRepoName', action.payload);
    },
    setCurrentRepoOwner: (state, action) => {
      state.currentRepoOwner = action.payload;
      localStorage.setItem('currentRepoOwner', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(githubApi.endpoints.getRepositories.matchFulfilled, (state, { payload }) => {
      state.usersNodes = [...payload.nodes];
      state.totalCount = payload.totalCount;
    });
    builder.addMatcher(githubApiSearch.endpoints.searchRepo.matchPending, (state, { payload }) => {
      state.searchStatus = RequestStatus.LOADING;
    });
    builder.addMatcher(
      githubApiSearch.endpoints.searchRepo.matchFulfilled,
      (state, { payload }) => {
        state.nodes = [...payload];
        state.totalCount = payload.length;
        state.searchStatus = RequestStatus.SUCCESS;
      },
    );
    builder.addMatcher(githubApiSearch.endpoints.searchRepo.matchRejected, (state, { payload }) => {
      state.searchStatus = RequestStatus.ERROR;
    });
  },
});

export const { setCurrentPage, setCurrentRepoName, setCurrentRepoOwner } = reposSlice.actions;

export const selectCurrentPage = (state: RootState) => state.reposSlice.currentPage;
export const selectCurrentRepoName = (state: RootState) => state.reposSlice.currentRepoName;
export const selectUsersNodes = (state: RootState) => state.reposSlice.usersNodes;
export const selectNodes = (state: RootState) => state.reposSlice.nodes;
export const selectSearchStatus = (state: RootState) => state.reposSlice.searchStatus;
export const selectPageLimit = (state: RootState) => state.reposSlice.pageLimit;

export default reposSlice.reducer;
