export interface Feedback {
  id: number;
  equipmentId: number;
  userId: string;
  feedbackDate: string;
  rating: number;
  comment: string;
}

export type FeedbackResponse = {
  data: Feedback[];
  totalPages: number;
  totalItems: number;
};

export type SortOrder = "asc" | "desc";

