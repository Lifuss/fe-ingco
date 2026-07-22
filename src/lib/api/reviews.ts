import { apiIngco, serializeAxiosError } from '@/lib/appState/user/operation';
import { Review, ReviewStats, CreateReviewData } from '@/lib/types';

export interface ProductReviewsResponse {
  data: Review[];
  total: number;
  totalPages: number;
  stats: ReviewStats;
}

export interface AdminReviewsResponse {
  data: Review[];
  total: number;
  totalPages: number;
}

export const fetchProductReviews = async (
  productId: number,
  params?: { page?: number; limit?: number; rating?: number },
): Promise<ProductReviewsResponse> => {
  try {
    const res = await apiIngco.get<ProductReviewsResponse>(`/reviews/product/${productId}`, {
      params,
    });
    return res.data;
  } catch (error) {
    throw serializeAxiosError(error);
  }
};

export const checkCanUserReview = async (
  productId: number,
): Promise<{ canReview: boolean; reason?: string }> => {
  try {
    const res = await apiIngco.get<{ canReview: boolean; reason?: string }>(
      `/reviews/can-review/${productId}`,
    );
    return res.data;
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err?.status === 401) {
      return {
        canReview: false,
        reason: 'Будь ласка, увійдіть в акаунт, щоб залишити відгук',
      };
    }
    return {
      canReview: false,
      reason: err?.message || 'Помилка перевірки можливості залишити відгук',
    };
  }
};

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  try {
    const formData = new FormData();
    formData.append('productId', String(data.productId));
    formData.append('rating', String(data.rating));
    formData.append('comment', data.comment);

    if (data.pros) formData.append('pros', data.pros);
    if (data.cons) formData.append('cons', data.cons);

    if (data.images && data.images.length > 0) {
      data.images.slice(0, 3).forEach((file) => {
        formData.append('images', file);
      });
    }

    const res = await apiIngco.post<Review>('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw serializeAxiosError(error);
  }
};

export const fetchAdminReviews = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
}): Promise<AdminReviewsResponse> => {
  try {
    const res = await apiIngco.get<AdminReviewsResponse>('/reviews/admin', { params });
    return res.data;
  } catch (error) {
    throw serializeAxiosError(error);
  }
};

export const deleteReview = async (reviewId: number): Promise<{ success: boolean }> => {
  try {
    const res = await apiIngco.delete<{ success: boolean }>(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    throw serializeAxiosError(error);
  }
};

export const toggleApproveReview = async (reviewId: number): Promise<Review> => {
  try {
    const res = await apiIngco.patch<Review>(`/reviews/${reviewId}/approve`);
    return res.data;
  } catch (error) {
    throw serializeAxiosError(error);
  }
};
