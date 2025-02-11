import { RootStateType } from '../rootReducer';

export const selectCards = (state: RootStateType) => state.kanban.cards;
export const selectForm = (state: RootStateType) => state.kanban.form;
