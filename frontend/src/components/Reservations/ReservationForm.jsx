import React from 'react'
import { useState } from 'react'

export default function ReservationForm() {
const [checkInDate,setCheckInDate] = useState()
const [checkOutDate,setCheckOutDate] = useState()
const [guests,setGuests]=useState(1)


console.log(checkInDate)
console.log(checkOutDate)



return (
    <div>
<h1>Reserve This Location</h1>
<form>
    <label>Check-in Date</label>
    <br/>
    <input
    type='date'
    onChange={(e) => setCheckInDate(e.target.value)}
    />
<br/>
<br/>

    <label>Check-Out Date</label>
    <br/>
    <input
    type='date'
    onChange={(e) => setCheckOutDate(e.target.value)}

    />
<br/>
<br/>
    <label>Guests </label>
<input
type='number'
min={1}
style={{width:'35px'}}

/>
<br/>
<br/>
<button>Reserve</button>
</form>
        </div>
  )
}
