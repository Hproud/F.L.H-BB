import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spot";
import { useNavigate } from "react-router-dom";

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
     dispatch(spotActions.updatingSpot(listing))
    .then(res => res.json())
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
navigate(`/spots/current`)
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
  return (
    <div>
    <h1>Update your spot</h1>
    <form className="createSpotForm" onSubmit={handleSubmit}>
      {errors.message &&
      <p className='spot-form-error'>{errors.message}</p>
      }
      <h2>Where`s your place located?</h2>
      <p>
        Guests will only get your exact address once they booked a
        reservation.
      </p>
      <label>
        Country
        {errors &&
        <p className='spot-form-error'>{errors.country}</p>
        }
      </label>
      <input
        type='text'
        value={country}
        onChange={(e) => setCountry(e.target.value)}

      />
      <br />
      <label>Street Address</label>
      {errors &&
      <p className="spot-form-error">{errors.address}</p>
      }
      <input
        type='text'
        placeholder='address'
        value={spot.address}
        onChange={(e) => setAddress(e.target.value)}
      />
      ,
      <br />
      <label>City</label>
      {errors &&
      <p className='spot-form-error'>{errors.city}</p>
      }
      <input
        type='text'
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />
      <label>State</label>
      {errors &&
      <p  className='spot-form-error'>{errors.state}</p>
      }
      <input
        type='text'
        placeholder='state'
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <br />
      <label>Latitude</label>
      {errors &&
      <p className='spot-form-error'>{errors.lat}</p>
      }
      <input
        type='number'
        placeholder='latitude'
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      ,
      <br />
      <label>Longitude</label>
      {errors &&
      <p className='spot-form-error'>{errors.lng}</p>
      }
      <input
        type='number'
        placeholder='longitude'
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <br />
      <h2>Describe your place to guests</h2>
      <label>
        Mention the best features of your space, any special amentities like
        fast wifi, or parking, and what you love about the neighborhood.
      </label>
      <br />
      <br />
      <input
        type='text'
        placeholder='Please write at least 30 characters'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
        {errors &&
        <p className='spot-form-error'>{errors.description}</p>
        }
      <br />
      <br />
      <h2>Create a title for your Spot</h2>
      <label>
        Catch guests` attention with a spot title that highlights what makes
        your place special
      <br />
      <br />
      </label>
      <input
        type='text'
        placeholder='Name of your spot'
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        {errors &&
        <p className='spot-form-error'>{errors.name}</p>
        }
      <br />
      <br />
      <h2>Set a base price for your spot</h2>
      <br />
      <label>
        Competitive pricing can help your listing stand out and rank higher in
        search results.

      <br />
        <br />$
      </label>
      <input
        type='number'
        placeholder='Price per night (USD)'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />
        {errors &&
        <p className='spot-form-error'>{errors.price}</p>
        }
      <br />
      <h2>Liven up your spot with photos</h2>
      <label>Submit a link to at least one photo to publish your </label>
      {errors &&
      <p className='spot-form-error'>{errors.previewImage}</p>
      }
      <input
        type='text'
        placeholder='Preview Image URL'
        value={previewImage}
        onChange={(e) => setPreviewImage(e.target.value)}
      />
      <br />
      <br />
      <input type='url' placeholder='Image URL' />
      <br />
      <br />
      <input type='url' placeholder='Image URL' />
      <br />
      <br />
      <input type='url' placeholder='Image URL' />
      <br />
      <br />
      <input type='url' placeholder='Image URL' />
      <br />
      <br />
      <input type='url' placeholder='Image URL' />
      <br />
      <br />
      <button type='submit'>Update Spot</button>
    </form>
  </div>
  )
}
