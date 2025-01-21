import React from 'react'
import { useState } from 'react'

export default function ReservationForm() {
const today = new Date()
const yr= today.getFullYear()
const mnth = today.getMonth()+1
const day= today.getDate()
const tdy = (mnth+'/'+day+'/'+yr)
const [checkInDate,setCheckInDate] = useState(tdy)
const [checkOutDate,setCheckOutDate] = useState(Date)
const [adults,setAdults]=useState(1)
const [kids,setKids]=useState(0)


console.log(checkInDate,"check in")
console.log(checkOutDate,"check out")
// console.log(guests,'guests')
console.log(day,'day')
console.log(mnth,'month')
console.log(yr,'year')




return (
    <div>
<h1>Reserve This Location</h1>
<form>
    <label>Check-in Date</label>
    <br/>
    <input
    type='date'
    onChange={(e) => setCheckInDate(e.target.value)}
    value={checkInDate}
    />
<br/>
<br/>

    <label>Check-Out Date</label>
    <br/>
    <input
    type='date'
    onChange={(e) => setCheckOutDate(e.target.value)}
    value={checkOutDate}
//this is checking the checkout date
    />
<br/>
<br/>
    <label style={{fontSize:'18px', fontWeight:'bold',textDecoration:'underline'}}>Guests: </label>
    <br/>
    <label>Adults: </label>
    <input
type='number'
min={1}
style={{width:'35px'}}
onChange={(e)=> setAdults(e.target.value)}
value={adults}
 // this is setting the amount of adults
/>
<br/>
<label>Children: </label>
<input
type='number'
min={1}
style={{width:'35px'}}
onChange={(e)=> setKids(e.target.value)}
value={kids}
/>
<br/>
<br/>
<button>Reserve</button>
</form>
        </div>
  )
}
