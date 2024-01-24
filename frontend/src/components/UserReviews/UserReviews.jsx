import { useSelector } from "react-redux"

export default function UserReviews() {
  const reviews = useSelector(state => state?.reviews.reviews)
  return (
    <div>UserReviews</div>
  )
}
