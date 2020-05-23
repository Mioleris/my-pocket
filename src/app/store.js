import { configureStore } from '@reduxjs/toolkit';
import myPocketReducer from '../features/my-pocket/myPocketSlice.js';

export default configureStore({
  reducer: {
    myPocket: myPocketReducer,
  },
});
