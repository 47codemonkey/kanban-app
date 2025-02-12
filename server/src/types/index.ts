export interface CreateCardBody {
  title: string;
  description: string;
  status: string;
  boardId: string;
}

export interface UpdateCardBody {
  title?: string;
  description?: string;
  status?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  message: string;
}
