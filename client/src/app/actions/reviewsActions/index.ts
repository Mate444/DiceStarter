import axios from 'axios';
import {
  SET_REVIEWS,
} from '../../constants/constants';
import {ReviewRes, ReviewPost} from '../../../types';
// send Review status handling
// sends reviews to store
const setReviews = (reviewResponse: ReviewRes) => ({
  payload: reviewResponse,
  type: SET_REVIEWS,
});

// Async requests to the back-end

const postReview = (review: ReviewPost, id:string) => {
  return async (dispatch: any) => {
    try {
      await axios.post(`http://localhost:3001/product/${review.id}/review`, review);
      dispatch(getReviews(id));
    } catch (err) {
      console.error(err);
    }
  };
};

const getReviews = (id: string) => {
  return async (dispatch: any) => {
    try {
      const res = await axios.get(`http://localhost:3001/product/${id}/review`);
      console.log(res.data);
      const reviews = res.data.all.map((review: ReviewPost) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userId: review.userId,
      }));
      dispatch(setReviews(reviews));
    } catch (err) {
      console.error(err);
    }
  };
};

const deleteReviews = (id: number, productId: string) => {
  return async (dispatch: any) => {
    try {
      await axios.delete(`http://localhost:3001/product/review/${id}`);
      dispatch(getReviews(productId));
    } catch (err) {
      console.error(err);
    };
  };
};

const modifyReview = (id: number) => {
  return async (dispatch: any) => {
    try {
      console.log(id);
      const res = await axios.post(`http://localhost:3001/product/review/${id}`);
      console.table(res.data);
    } catch (err) {
      console.error(err);
    }
  };
};

export {
  postReview,
  getReviews,
  deleteReviews,
  modifyReview,
};
