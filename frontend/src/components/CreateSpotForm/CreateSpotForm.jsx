import { useState } from "react"
import { useDispatch } from "react-redux";


export default function CreateSpotForm() {
const [country,setCountry] = useState('');
const [address,setAddress] = useState('')
const [city,setCity] = useState('')
const [state,setState] = useState('')
const [lat,setLat] = useState('')
const [lng,setLng] = useState('')
const [description,setDescription] = useState('')
const [name,setName] = useState('')
const [price,setPrice] = useState('')
const [images,setImages] =useState([]);
const [previewImage,setPreviewImage] = useState('')
const [isLoaded,setIsLoading] = useState(true)
const dispatch = useDispatch()


  return (
    <div>
        <h1>Create a new Spot</h1>
        <form>
            <h2>Where`s your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <label>Country</label>
            <br />
            <input type='text'
            placeholder="Country"
            />
            <br />
            <label>Street Address</label>
            <br />
<input type='text'
placeholder="address"
/>,
<br />
 <label>State</label>
 <br/>
 <input type='text'
 placeholder="state"/>
 <br/>
 <label>Latitude</label>
 <br/>
 <input type='text'
 placeholder="latitude" />,
 <br/>
 <label>Longitude</label>
 <br/>
 <input type= 'text'
 placeholder="longitude" />
 <br/>
 <h2>Describe your place to guests</h2>
 <label>Mention the best features of your space, any special amentities like fast wifi, or parking, and what you love about the neighborhood.</label>
 <br/>
 <input
 type='text'
 placeholder="Please write at least 30 characters"
 />
 <br/>
 <br/>
<h2>Create a title for your Spot</h2>
<label>Catch guests` attention with a spot title that highlights what makes your place special</label>
<br/>
<input type='text'
placeholder="Name of your spot"
/>
<br/>
<br/>
<h2>Set a base price for your spot</h2>
<br/>
<label>Competitive pricing can help your listing stand out and rank higher in search results.
 <br/>
$
</label>
<input type='number'
placeholder="Price per night (USD)"
/>
<br/>
<h2>Liven up your spot with photos</h2>
<label>
    Submit a link to at least one photo to publish your spot.
</label>
<br/>
<input type='url'
placeholder="Preview Image URL"/>
<br />
<br />
<input type='url' placeholder="Image URL" />
<br />
<br />
<input type='url' placeholder="Image URL" />
<br />
<br />
<input type='url' placeholder="Image URL" />
<br />
<br />
<input type='url' placeholder="Image URL" />
<br />
<br />
<input type='url' placeholder="Image URL" />
<br />
<br />
        <button type='submit'>Create Spot</button>
        </form>
    </div>
  )
}
