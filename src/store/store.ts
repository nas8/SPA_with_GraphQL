import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import reposSlice from './reposSlice';
import { githubApi } from '../api/queryRepos';
import { githubApiRepo } from '../api/queryRepo';
import { githubApiSearch } from '../api/querySearch';

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
    [githubApiRepo.reducerPath]: githubApiRepo.reducer,
    [githubApiSearch.reducerPath]: githubApiSearch.reducer,
    reposSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      githubApi.middleware,
      githubApiRepo.middleware,
      githubApiSearch.middleware,
      thunkMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
