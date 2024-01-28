import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import { useEffect, useState } from "react";
import { findReviews, singleReview } from "../../store/reviews";
import ReviewUpdateModal from "../ReviewModal/ReviewUpdateModal";
import ReviewDeleteModal from "../ReviewModal/ReviewDeleteModal";

export default function Review({spot}) {
  const reviews = useSelector((state) => state.reviews.reviews);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(true);
  const [posted,setPosted] = useState(false)
  const [owner,setOwner]= useState(false)
// console.log(spot.id,"this is the spot in review")
//   console.log(user.id, "this is what i am getting for user");
  useEffect(() => {
    dispatch(findReviews(spot.id)).then(() => setIsLoading(false));
    if(user &&( spot.Owner.id === user.id)){
      setOwner(true)
    }else{
      return
    }

  }, [dispatch, spot]);

  // console.log(reviews, "this is the reviews");
  // console.log(posted,'posted')
useEffect(()=>{
if(reviews.length > 0){
  reviews.map(review => {
   if(user && (review.userId === user.id)){
     // console.log(review.userId,'this is the userId for review')
     setPosted(true)
   }

 })

}



},[reviews])


if(reviews.length){
  reviews.forEach(review =>{
   const dates=review.createdAt.split('-')
   const year = dates[0];
   let month= dates[1];

switch (dates[1]){
  case '01':  month = 'January';break;
  case '02':  month = 'February';break;
  case '03':  month = 'March';break;
  case '04':  month = 'April';break;
  case '05':  month = 'May';break;
  case '06':  month = 'June';break;
  case '07':  month = 'July';break;
  case '08':  month = 'August';break;
  case '09':  month = 'September';break;
  case '10':  month = 'October';break;
  case '11':  month = 'November';break;
  case '12':  month = 'December';break;

}

review.reviewdate= month+' '+year

  })
}



  if (!isloading) {
    return (
      <div>

        <div id={'clickable'}>
{user && !owner && !posted &&

<OpenModalButton
  buttonText='Post Your Review'
  modalComponent={<ReviewModal />}
  onButtonClick={() => {
    <ReviewModal />;
  }}
/>


}



          {reviews.length > 0 &&
            reviews.map((review) => (
              <div key={review.id} >
                <h3 style={{fontSize:'20pt',margin:'5px'}}>{review.User.firstName}</h3>
                <p style={{color:'grey',fontSize:'14pt',margin:'2px'}}>{review.reviewdate}</p>
                <p className="reviewofspot">{review.review}</p>
                  {user && review.userId === user.id  && (
                    <OpenModalButton
                    id={'clickable'}
                    buttonText='Update'
                    modalComponent={<ReviewUpdateModal />}
                    onButtonClick={() => {
                      dispatch(singleReview(review)).then(() => (
                        <ReviewUpdateModal spot={spot}  />
                        ));
                      }}
                      />
                      )}

                        <div   style={{position:'relative',left:'70px',bottom:'20px'}}>
                  {user && review.userId === user.id &&  (
                    <OpenModalButton
                    id={'clickable'}
                    buttonText='Delete'
                    modalComponent={<ReviewDeleteModal />}
                    onButtonClick={() => {
                      dispatch(singleReview(review));
                        <ReviewDeleteModal />

                      }}
                      />
                      )}
                      </div>
                      <div>
                </div>
              </div>
            ))}
          {!reviews.length && (
            <div>
              <h3>Be the first to post a review!</h3>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
}
