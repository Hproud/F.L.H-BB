import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spot";
import "./CreateSpotForm.css";
import { useNavigate } from "react-router-dom";
import { addspotPic } from "../../store/pictures";
// import { singleReview } from "../../store/reviews";

export default function CreateSpotForm() {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pic1, setpic1] = useState();
  const [pic2, setpic2] = useState();
  const [pic3, setpic3] = useState();
  const [pic4, setpic4] = useState();
  const [pic5, setpic5] = useState();

  // const [images,setImages] =useState([]);
  const [previewImage, setPreviewImage] = useState("");
  // const [isLoaded,setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // const spot = useSelector((state) => state.spot.spot);

  useEffect(() => {}, [dispatch]);

  // console.log(spot,"spot befor everything")
  const handleSubmit = (e) => {
    e.preventDefault();

    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      price,
      description,
      previewImage,
    };

    dispatch(spotActions.addSpot(newSpot))
      .then((spot) => {
        const picArr = [pic1, pic2, pic3, pic4, pic5];
        picArr.map((pic) => {
          if (pic) {
            dispatch(addspotPic({ url: pic, preview: false }, spot.id));
          }
        });
        dispatch(spotActions.singleSpot(spot.id));
        navigate(`/spots/${spot.id}`);
      })

      .catch(async (res) => {
        console.log(res, "this is the res we are looking at");
        const data = await res.json();
        console.log(data, "this is the data in the error handler");
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors(data);
        }
      });

    // navigate(`/spots/${spot.id }`);
  };

  return (
    <div className='fullForm'>
      <form className='createSpotForm' onSubmit={handleSubmit}>
        <h1 className='newspotheading'>Create a new Spot</h1>

        {errors.message && <p className='spot-form-error'>{errors.message}</p>}
        <div className='location'>
          <h2>Where`s your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label className='countrylabel'>
            Country
            {errors && <p className='spot-form-error' id='countryerror'>{errors.country}</p>}
          </label>
          <input
            className='country'
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Country'
            aria-required={true}
          />
        </div>
        <br />
        <div className='addressdiv'>
          <label className='addresslabel'>Street Address</label>
          {errors && <p className='spot-form-error' id='addresserror'>{errors.address}</p>}
          <input
            className='address'
            type='text'
            placeholder='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <br />
        <div className='citydiv'>
          <label className='citylabel'>City</label>
          {errors && <p className='spot-form-error'>{errors.city}</p>}
          <input
            className='city'
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-required={true}
          />
          ,
        </div>
        <br />
        <div className='statediv'>
          <label className='statelabel'>State</label>
          {errors && <p className='spot-form-error'>{errors.state}</p>}
          <input
            className='state'
            type='text'
            placeholder='state'
            value={state}
            onChange={(e) => setState(e.target.value)}
            aria-required={true}
          />
        </div>
        <br />
        <div className="latdiv">
          <label>Latitude</label>
          {errors && <p className='spot-form-error'>{errors.lat}</p>}
          <input
          className="lat"
            type='number'
            placeholder='latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            aria-required={true}
          />,
        </div>

        <br />
        <div className="lngdiv">
          <label>Longitude</label>
          {errors && <p className='spot-form-error'>{errors.lng}</p>}
          <input
          className="lng"
            type='number'
            placeholder='longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            aria-required={true}
          />
        </div>
        <br />
        <div className="descr">
          <hr className="line"></hr>

          <h2 className="desctitle">Describe your place to guests</h2>
          <label className="desclabel">
            Mention the best features of your space, any special amentities like
            fast wifi, or parking, and what you love about the neighborhood.
          </label>
          <br />
          <br />
          <input
          className="signupdescription"
            type='text'
            placeholder='Please write at least 30 characters'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-required={true}
          />
          {errors && <p className='spot-form-error'>{errors.description}</p>}
        </div>
        <br />
        <br />
        <div>
          <hr className="line2"></hr>
          <h2 className="spottitletitle">Create a title for your Spot</h2>
          <label className="spotlabel">
            Catch guests` attention with a spot title that highlights what makes
            your place special
            <br />
            <br />
          </label>
          <input
          className="spotname"
            type='text'
            placeholder='Name of your spot'
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required={true}
          />
          {errors && <p className='spot-form-error'>{errors.name}</p>}
        </div>
        <br />
        <br />
        <div>
        <hr className="line3"></hr>
          <h2 className="spotpricetitle">Set a base price for your spot</h2>
          <br />
          <div className="spotpricediv">
          <label className="spotpricelabel">
            Competitive pricing can help your listing stand out and rank higher
            in search results.
            <br />
            <br />$
          </label>
          <input
          className="spotPriceInput"
            type='number'
            placeholder='Price per night (USD)'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-required={true}
          />
          {errors && <p className='spot-form-error'>{errors.price}</p>}
          </div>
        </div>
        <br />
        <div></div>
          <hr className="line4"></hr>
        <div className="allpics">
          <h2 className="phototitle">Liven up your spot with photos</h2>
          <label className="photolabel">
            Submit a link to at least one photo to publish your spot.
          </label>
          {errors && <p className='spot-form-error'>{errors.previewImage}</p>}
          <input
          className="photo"
            type='text'
            placeholder='Preview Image URL'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            aria-required={true}
          />
          <br />
          <br />
          <input
          className="photo"
            type='text'
            placeholder='Image URL'
            value={pic1}
            onChange={(e) => setpic1(e.target.value)}
          />
          <br />
          <br />
          <input
          className="photo"
          type='text'
            placeholder='Image URL'
            value={pic2}
            onChange={(e) => setpic2(e.target.value)}
          />
          <br />
          <br />
          <input
          className="photo"
          type='text'
            placeholder='Image URL'
            value={pic3}
            onChange={(e) => setpic3(e.target.value)}
          />
          <br />
          <br />
          <input
            type='text'
            className="photo"
            placeholder='Image URL'
            value={pic4}
            onChange={(e) => setpic4(e.target.value)}
          />
          <br />
          <br />
          <input
          className="photo"
          type='text'
            placeholder='Image URL'
            value={pic5}
            onChange={(e) => setpic5(e.target.value)}
          />
        </div>
        <hr className="line3"></hr>
        <br />
        <br />
        <button className="createspotbutton" type='submit'>Create Spot</button>
      </form>
    </div>
  );
}
