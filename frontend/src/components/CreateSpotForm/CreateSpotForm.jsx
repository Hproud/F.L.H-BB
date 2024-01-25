import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from "../../store/spot";
import './CreateSpotForm.css'
import { useNavigate } from "react-router-dom";
import { addspotPic } from "../../store/pictures";

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
  const [pic1,setpic1] = useState('');
  const [pic2,setpic2] = useState('');
  const [pic3,setpic3] = useState('');
  const [pic4,setpic4] = useState('');
  const [pic5,setpic5] = useState('');

  // const [images,setImages] =useState([]);
  const [previewImage, setPreviewImage] = useState("");
  // const [isLoaded,setIsLoading] = useState(true)
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
const spot = useSelector(state => state?.spot.spot)


useEffect(()=>{},[dispatch])


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
  dispatch(spotActions.addSpot(newSpot)).then(res => res.json()).then(res => dispatch( spotActions.singleSpot(res.id))).then((res) => {
    console.log(res, ' this is the last res')
  })
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
  // const spotId = spot.id+1;
// console.log(spot, 'this is spot after')



const picArr=[pic1,pic2,pic3,pic4,pic5]
picArr.map(pic => { dispatch(addspotPic({url:pic,preview:false},spot.id))})
// for (let i=0; i < picArr.length;i++){
//   const picture = picArr[i];
  // const payload = {
  //   url: picture,
  //   preview: false
  // }
//   dispatch(addspotPic({url:picture,preview:false}),spot.id)
// }

navigate(`/spots/${(spot.id)}`)

  };

  // console.log(errors, "this is the errors in the create spot form");

  // if(!isLoaded){
  return (
    <div>
      <h1>Create a new Spot</h1>
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
          placeholder='Country'
        />
        <br />
        <label>Street Address</label>
        {errors &&
        <p className="spot-form-error">{errors.address}</p>
        }
        <input
          type='text'
          placeholder='address'
          value={address}
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
        <label>Submit a link to at least one photo to publish your spot.</label>
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
        <input
        type='text'
        placeholder='Image URL'
        value={pic1}
        onChange={e=> setpic1(e.target.value)}
        />

        <br />
        <br />
        <input type='text' placeholder='Image URL'value={pic2}
        onChange={e=> setpic2(e.target.value)} />
        <br />
        <br />
        <input type='text' placeholder='Image URL'
        value={pic3}
        onChange={e=> setpic3(e.target.value)} />
        <br />
        <br />
        <input type='text' placeholder='Image URL'
        value={pic4}
        onChange={e=> setpic4(e.target.value)} />
        <br />
        <br />
        <input type='text' placeholder='Image URL'
        value={pic5}
        onChange={e=> setpic5(e.target.value)} />
        <br />
        <br />
        <button type='submit'>Create Spot</button>
      </form>
    </div>
  );

  // }else{
  //     return (<div>Loading...</div>)
  // }
}
