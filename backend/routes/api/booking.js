const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Booking, User, Review, Image } = require("../../db/models");
// const { validationResult } = require('express-validator');

const router = express.Router();

//?---------------------------------------------------------------------

validateDates = [
  check("startDate")
    // .exists({checkFalsy:true})
    .custom((value) => {
      const start = new Date(value);
      const today = new Date();
      if (start < today) {
        throw new Error("startDate cannot be in the past");
      } else {
        return true;
      }
    }),
  check("endDate")
    // .exists({checkFalsy:true})
    .custom((value, { req }) => {
      const end = new Date(value);
      const start = new Date(req.body.startDate);
      if (end <= start) {
        throw new Error("endDate cannot be on or before startDate");
      } else {
        return true;
      }
    }),
  handleValidationErrors,
];
//?-----------------GET ALL CURRENT USERS BOOKINGS----------------------
//& this route works but is not currently including the booking Id numbers in it?
//^DEBUG************************************************************************
router.get("/current", requireAuth, async (req, res, next) => {
  const user = req.user.id;

  const myBookings = await Booking.findAll({
    where: {
      userId: user,
    },
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
    include: {
      model: Spot,
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "lat",
        "lng",
        "name",
        "price",
        "previewImage",
      ],
    },
  });
  // console.log(myBookings.spot.id,'aklsdjf;klajsdhfkjashdfkjhasdkljfhaksljdfhakjlshdfkjashdfkahsdkfjhaskljdfhlks')
  const allBookings = [];
  // const allBookings = []

  myBookings.forEach((trip) => {
    trip.toJSON();

    // console.log(trip.Spot.dataValues)
    const booking = {
      id: trip.id,
      spotId: trip.spotId,
      spot: trip.Spot.dataValues,
      userId: trip.userId,
      startDate: trip.startDate,
      endDate: trip.endDate,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
    allBookings.push(booking);
  });
  // console.log(book)
  res.json({
    allBookings,
  });
});

//? --------------------------EDIT A BOOKING---------------------------

router.put(
  "/:bookingId",
  requireAuth,
  validateDates,
  async (req, res, next) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    // //TODO this checks if the spot is valid
    let currBooking = await Booking.findOne({
      where: {
        id: Number(bookingId),
      },
attributes: [
          "id",
          "spotId",
          "userId",
          "startDate",
          "endDate",
          "createdAt",
          "updatedAt",
        ],
    });
    //& if there is no currBooking throw the not found err
    if (!currBooking) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.message = "Spot couldn't be found";
      next(err);
    }
currBooking = currBooking.toJSON();
console.log(currBooking);

    console.log(req.user.id);
    if (req.user.id === currBooking.userId) {
      //                                //TODO this is pulling all curr bookings for the currBooking
      const bookings = await Booking.findAll({
        where: { spotId: currBooking.spotId },
        attributes: [
          "id",
          "spotId",
          "userId",
          "startDate",
          "endDate",
          "createdAt",
          "updatedAt",
        ],
      });

      //           // console.log(bookings,"bookings----------");

      //           //TODO this turns bookings into a JSON obj and pushed it to all
      const all = [];
      bookings.forEach((current) => {
        const newCurrent = current.toJSON();
        // console.log(current.id,"this is the current")
        all.push(newCurrent);
      });
      //                     //!----------------------
      //                     //TODO if all has data loop through looking for bookings in particular? why tho? you do this with the bookings, each booking is all[i]
      //                      //!----------------------
      if (all.length) {
        for (let i = 0; i < all.length; i++) {
          const stay = all[i];
          if (stay.id !== currBooking.id) {
            // console.log(stay.id,'this is stay',currBooking.id,'this is curr bking','HIT')
            //                              //TODO-----sets the date attribute to the values pulled in query
            // console.log(startDate,"start date");
            // console.log(startDate,"endDate");
            const begin = new Date(startDate);
            const end = new Date(endDate);
            //             // console.log(begin,'<----------------begin');
            // console.log((begin < stay.startDate && stay.endDate < end) ||
            // (stay.startDate < begin && end < stay.endDate))
            //             // console.log(end,'<----------------end');
            //             // console.log(stay.startDate,"-------stay start")

            // if()
            if (
              (begin < stay.startDate && stay.endDate < end) ||
              (stay.startDate < begin && end < stay.endDate)
            ) {
              console.log('error for spots')
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 400;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "endDate date conflicts with an existing booking",
              };
              return next(err);
            } //^checks the in between bookings
            //             //TODO  this is checking if current booking start date lands in proposed new booking start date
            if (stay.startDate <= begin && stay.endDate >= begin) {
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 400;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                startDate: "Start date conflicts with an existing booking",
              };
              return next(err);
            }
            //& end of startDate check

            //                                     //TODO this checks the new booking end date against current booking end date.
            //                                     //~ make sure you are checking the proposed end date against the end date as well as the START date
            if (stay.startDate <= end && stay.endDate >= end) {
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 400;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                endDate: "endDate date conflicts with an existing booking",
              };
              return next(err);
            }
            //& end of endDate check
          }
          //& end of the for loop checking all bookings;
        }

      }
      // console.log(reservation.dataValues,' this is before the update')

      await Booking.update(
        {
          startDate: startDate,
          endDate: endDate,
        },
        {
          where: {
            id: +bookingId,
          },
        }
      );

      // console.log(reservation.dataValues,' this is after the update')
      const updated = await Booking.findOne({
        where: {
          id: +bookingId,
        },
      });

      return res.json({
        id: updated.id,
        spotId: updated.spotId,
        userId: updated.userId,
        startDate: updated.startDate,
        endDate: updated.endDate,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      err.message = "Forbidden";
      next(err);
    }
  }
);

//?------------------------DELETE A BOOKING-----------------------------

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;

  const reservation = await Booking.findOne({
    where: {
      id: Number(bookingId),
    }, attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
  });
  // reservation.map(data => data.toJSON)
  console.log(reservation);
  if (!reservation) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    err.message = "Booking couldn't be found";
    next(err);
  };


    if (reservation.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }

    // console.log('im here!!!!!')
  //   // console.log(new Date(reservation.startDate))
    const start = new Date(reservation.startDate);
    const today = new Date();
    if (start < today) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.status = 403;
      err.message = "Bookings that have been started can't be deleted";
      next(err);
    }
  // else {
      await Booking.destroy({
        where:{
          id: Number(bookingId)
        }
      });
      res.json("Successfully deleted");
    //
  // }
});

module.exports = router;
