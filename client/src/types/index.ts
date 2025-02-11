export interface Card {
  _id?: string;
  title: string;
  description: string;
  status: string;
  order?: number;
  boardId: string;
}

export interface FormData {
  title: string;
  description: string;
}

export interface CardsState {
  [key: string]: Card[];
}

export interface FormState {
  selectedColumn: string | null;
  editingCard: Card | null;
  formData: FormData;
}
