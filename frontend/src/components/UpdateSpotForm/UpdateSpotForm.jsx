import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spot";
import { useNavigate } from "react-router-dom";
import "../CreateSpotForm/CreateSpotForm.css";



export default function UpdateSpotForm() {
    const [country, setCountry] = useState();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    // const [images,setImages] =useState([]);
    const [previewImage, setPreviewImage] = useState("");
    // const [isLoaded,setIsLoaded] = useState(false)
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
  const spot = useSelector(state => state.spot.spot)



  const handleSubmit = (e) => {
    e.preventDefault();

    const listing = {
        spotId: spot.id,
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
     dispatch(spotActions.updatingSpot(listing)).then(dispatch(spotActions.singleSpot(spot.id)))
    // .then(res => res.json())
    .catch(async (res) => {
      const data = await res.json()
      console.log(data,"this is the data in the error handler")
        if(data.errors){
            setErrors(data.errors)
        }else
        if(data.message){
            setErrors(data)
        }

    })
// console.log(spot.id, 'this is spot after')
navigate(`/spots/${spot.id}`)
  };

console.log(spot,'spot before anything')

useEffect(() =>{
    setAddress(spot.address)
    setCountry(spot.country)
    setCity(spot.city)
    setState(spot.state)
    setDescription(spot.description)
    setLat(spot.lat)
    setLng(spot.lng)
setName(spot.name)
setPrice(spot.price)
setPreviewImage(spot.previewImage)





},[spot.address,spot.country,spot.city,spot.state,spot.description,spot.lat,spot.lng,spot.name,spot.price,spot.previewImage])
  return(
    <div className='fullForm'>
      <form className='createSpotForm' onSubmit={handleSubmit}>
        <h1 className='newspotheading'>Create a new Spot</h1>

        {errors.message && <p className='spot-form-error'>{errors.message}</p>}
        <div className='location'>
          <h2 className='startheader'>Where`s your place located?</h2>
          <p className='disco'>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label className='countrylabel'>
            Country
            {errors && (
              <p className='spot-form-error' id='countryerror'>
                {errors.country}
              </p>
            )}
          </label>
          <input
            className='country'
            type='textarea'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Country'
          />
        </div>
        <br />
        <div className='addressdiv'>
          <label className='addresslabel'>Street Address</label>
          {errors && (
            <p className='spot-form-error' id='addresserror'>
              {errors.address}
            </p>
          )}
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
          {errors && (
            <p id='cityerror' className='spot-form-error'>
              {errors.city}
            </p>
          )}
          <input
            className='city'
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />{" "}
          ,
        </div>
        <br />
        <div className='statediv'>
          <label className='statelabel'>State</label>
          {errors && (
            <p id='stateerror' className='spot-form-error'>
              {errors.state}
            </p>
          )}
          <input
            className='state'
            type='text'
            placeholder='state'
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <br />
        <div className='latdiv'>
          <label>Latitude</label>
          {errors && (
            <p id='laterror' className='spot-form-error'>
              {errors.lat}
            </p>
          )}
          <input
            className='lat'
            type='number'
            placeholder='latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          ,
        </div>

        <br />
        <div className='lngdiv'>
          <label className='lnglabel'>Longitude</label>
          {errors && (
            <p id='lngerror' className='spot-form-error'>
              {errors.lng}
            </p>
          )}
          <input
            className='lng'
            type='number'
            placeholder='longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
        <br />
        <div className='descr'>
          <hr className='line'></hr>

          <h2 className='desctitle'>Describe your place to guests</h2>
          <label className='desclabel'>
            Mention the best features of your space, any special amentities like
            fast wifi, or parking, and what you love about the neighborhood.
          </label>
          <br />
          <br />
          <textarea
            className='signupdescription'
            type='textArea'
            placeholder='Please write at least 30 characters'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors && (
            <p id='descerror' className='spot-form-error'>
              {errors.description}
            </p>
          )}
        </div>
        <br />
        <br />
        <div>
          <hr className='line2'></hr>
          <h2 className='spottitletitle'>Create a title for your Spot</h2>
          <label className='spotlabel'>
            Catch guests` attention with a spot title that highlights what makes
            your place special
            <br />
            <br />
          </label>
          <input
            className='spotname'
            type='text'
            placeholder='Name of your spot'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p id='nameerror' className='spot-form-error'>
              Name is required
            </p>
          )}
        </div>
        <br />
        <br />
        <div>
          <hr className='line3'></hr>
          <h2 className='spotpricetitle'>Set a base price for your spot</h2>
          <br />
          <div className='spotpricediv'>
            <label className='spotpricelabel'>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
              <br />
              <br />$
            </label>
            <input
              className='spotPriceInput'
              type='number'
              placeholder='Price per night (USD)'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors && (
              <p id='priceerror' className='spot-form-error'>
                {errors.price}
              </p>
            )}
          </div>
        </div>
        <br />
        <div></div>
        <hr className='line4'></hr>
        <div className='allpics'>
          <h2 className='phototitle'>Liven up your spot with photos</h2>
          <label className='photolabel'>
            Submit a link to at least one photo to publish your spot.
          </label>
          {errors && (
            <p id='previewerror' className='spot-form-error'>
              {errors.previewImage}
            </p>
          )}
          <input
            className='photo'
            type='text'
            placeholder='Preview Image URL'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            // required
          />
          <br />
          <br />
          <input
            className='photo'
            type='text'
            placeholder='Image URL'

          />
          <br />
          <br />
          <input
            className='photo'
            type='text'
            placeholder='Image URL'

          />
          <br />
          <br />
          <input
            className='photo'
            type='text'
            placeholder='Image URL'

          />
          <br />
          <br />
          <input
            type='text'
            className='photo'
            placeholder='Image URL'

          />
          <br />
          <br />
          <input
            className='photo'
            type='text'
            placeholder='Image URL'

          />
        </div>
        <hr className='line3'></hr>
        <br />
        <br />
        <button className='updatespotbutton' type='submit'>
          Update Spot
        </button>
      </form>
    </div>
  );
}
