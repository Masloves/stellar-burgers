import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const feedsData = await getFeedsApi();
  return feedsData;
});
