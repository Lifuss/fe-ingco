'use client';

import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ProductReviews = ({
  productId,
  productName,
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) => {
  const generateReviewSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: totalReviews,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        name: review.title,
        reviewBody: review.content,
        datePublished: review.date,
      })),
    };
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateReviewSchema(), null, 2),
        }}
      />

      <div className="border-t pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Відгуки ({totalReviews})</h2>
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-lg font-medium">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{review.title}</h3>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="mb-2 text-sm text-gray-600">
                  {review.author} •{' '}
                  {new Date(review.date).toLocaleDateString('uk-UA')}
                </p>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>Поки що немає відгуків для цього товару</p>
            <p className="mt-2 text-sm">Будьте першим, хто залишить відгук!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
