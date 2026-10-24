import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Star, MessageSquarePlus } from 'lucide-react';
import api from '../../services/api';

const ReviewList = ({ productId, reviews = [], onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      });
      setSuccessMsg('Thank you! Your verified review has been published.');
      setComment('');
      if (onReviewAdded) onReviewAdded(res.data.review);
    } catch (err) {
      setErrorMsg(err.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Submission Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-indigo-600" />
          Write a Customer Review
        </h4>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-xl">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Feedback & Experience
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the fit, finish, or sound quality? Share details to help other buyers..."
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="text-xs text-slate-500">
            Please{' '}
            <a href="/login" className="text-indigo-600 font-bold underline">
              sign in
            </a>{' '}
            to share your product review.
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div>
        <h4 className="text-base font-bold text-slate-900 mb-4">
          Customer Feedback ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No customer reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {rev.user?.name || 'Verified Customer'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
