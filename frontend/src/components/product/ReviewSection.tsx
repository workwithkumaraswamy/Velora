import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [distribution, setDistribution] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Write review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { isAuthenticated } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      const data = res.data.data;
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
      setDistribution(data.distribution || {});
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post(`/reviews/product/${productId}`, {
        rating: ratingInput,
        title: titleInput,
        comment: commentInput,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setTitleInput('');
        setCommentInput('');
        fetchReviews();
      }, 1200);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Unable to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-10 border-t border-velora-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-velora-border gap-6">
        <div>
          <h3 className="font-serif text-2xl text-velora-black tracking-wide font-normal">
            Customer Appraisals
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Genuine verified purchaser experiences and craftsmanship evaluations.
          </p>
        </div>

        {isAuthenticated ? (
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
          >
            Write An Appraisal
          </Button>
        ) : (
          <a
            href="/login"
            className="text-xs uppercase tracking-wider text-velora-champagne-dark font-medium underline underline-offset-4"
          >
            Sign in to leave a verified review →
          </a>
        )}
      </div>

      {/* Ratings Overview Grid */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-velora-border">
        {/* Score Card */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-baseline justify-center md:justify-start space-x-2">
            <span className="font-serif text-5xl text-velora-black">{averageRating.toFixed(1)}</span>
            <span className="text-neutral-400 text-sm">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-500">Based on {totalReviews} patron reviews</p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center space-x-3 text-xs text-neutral-600">
                <span className="w-12 text-right flex items-center justify-end space-x-0.5">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-velora-beige overflow-hidden">
                  <div
                    className="h-full bg-velora-champagne"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-neutral-400 text-[11px] font-mono">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="py-8 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-4">
            Be the first patron to review this exquisite creation.
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="pb-6 border-b border-velora-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.title && (
                    <h5 className="font-semibold text-xs text-velora-black">{rev.title}</h5>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed font-light">
                {rev.comment}
              </p>

              <div className="flex items-center space-x-2 text-[10px] text-neutral-500 pt-1">
                <span className="font-medium text-velora-black">
                  {rev.user?.firstName} {rev.user?.lastName}
                </span>
                {rev.isVerifiedPurchase && (
                  <span className="flex items-center space-x-0.5 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Purchase</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Verified Appraisal">
        {submitSuccess ? (
          <div className="text-center py-6 text-emerald-700 space-y-2">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600" />
            <h4 className="font-serif text-lg">Thank You</h4>
            <p className="text-xs">Your appraisal has been verified and published to the product gallery.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRatingInput(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= ratingInput
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Unmatched drape and supreme cashmere softness"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Detailed Feedback
              </label>
              <textarea
                rows={4}
                placeholder="Describe fabric texture, fit, tailoring quality, packaging and delivery..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                required
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
            >
              Submit Appraisal
            </Button>
          </form>
        )}
      </Modal>
    </section>
  );
};
