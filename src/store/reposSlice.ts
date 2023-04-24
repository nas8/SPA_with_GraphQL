import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { githubApi } from '../api/queryRepos';
import { RootState } from './store';
import { githubApiRepo } from '../api/queryRepo';
import { githubApiSearch } from '../api/querySearch';

interface Node {
  name: string;
  stargazerCount: number;
  pushedAt: string;
  url: string;
}

interface reposSliceState {
  usersNodes: Node[];
  nodes: Node[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    startCursor: string;
  };
  totalCount: number;
  currentPage: number;
  currentRepoName: string;
  currentRepoOwner: string;
}

const initialState: reposSliceState = {
  usersNodes: [],
  nodes: [],
  pageInfo: {
    endCursor: '',
    hasNextPage: false,
    startCursor: '',
  },
  totalCount: 0,
  currentPage: localStorage.getItem('currentPage')
    ? Number(localStorage.getItem('currentPage'))
    : 1,
  currentRepoName: '',
  currentRepoOwner: '',
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
    builder.addMatcher(
      githubApiSearch.endpoints.searchRepo.matchFulfilled,
      (state, { payload }) => {
        state.nodes = [...payload];
        state.totalCount = payload.length;
      },
    );
  },
});

export const { setCurrentPage, setCurrentRepoName, setCurrentRepoOwner } = reposSlice.actions;

export const selectCurrentPage = (state: RootState) => state.reposSlice.currentPage;
export const selectCurrentRepoName = (state: RootState) => state.reposSlice.currentRepoName;
export const selectUsersNodes = (state: RootState) => state.reposSlice.usersNodes;
export const selectNodes = (state: RootState) => state.reposSlice.nodes;

export default reposSlice.reducer;
