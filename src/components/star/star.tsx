interface StarProps {
  star: number;
  rating: number;
  hoverRating: number;
  setRating: (value: number) => void;
  setHoverRating: (value: number) => void;
}

export const Star: React.FC<StarProps> = ({ star, rating, hoverRating, setRating, setHoverRating }) => {
  return (
    <span
      className={`cursor-pointer text-2xl ${
        (hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-400"
      }`}
      onClick={() => setRating(star)}
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
    >
      ★
    </span>
  );
};
