import { combineReducers } from '@reduxjs/toolkit';

import kanbanReducer from './kanban/kanbanSlice';

const rootReducer = combineReducers({
  kanban: kanbanReducer,
});

export default rootReducer;

export type RootStateType = ReturnType<typeof rootReducer>;
