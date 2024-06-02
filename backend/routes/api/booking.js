const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Booking, User, Review, Image } = require("../../db/models");

const router = express.Router();

//?---------------------------------------------------------------------

validateDates = [
  check("startDate").custom((value) => {
    const start = new Date(value);
    const today = new Date();
    if (start < today) {
      throw new Error("startDate cannot be in the past");
    } else {
      return true;
    }
  }),
  check("endDate").custom((value, { req }) => {
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

  const allBookings = [];

  myBookings.forEach((trip) => {
    trip.toJSON();

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

    if (!currBooking) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.message = "Spot couldn't be found";
      next(err);
    }
    currBooking = currBooking.toJSON();
    // console.log(currBooking);

    // console.log(req.user.id);
    if (req.user.id === currBooking.userId) {
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

      const all = [];
      bookings.forEach((current) => {
        const newCurrent = current.toJSON();
        // console.log(current.id,"this is the current")
        all.push(newCurrent);
      });

      if (all.length) {
        for (let i = 0; i < all.length; i++) {
          const stay = all[i];
          if (stay.id !== currBooking.id) {
            const begin = new Date(startDate);
            const end = new Date(endDate);

            if (
              (begin < stay.startDate && stay.endDate < end) ||
              (stay.startDate < begin && end < stay.endDate)
            ) {
              // console.log("error for spots");
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 403;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "endDate date conflicts with an existing booking",
              };
              return next(err);
            }

            if (stay.startDate <= begin && stay.endDate >= begin) {
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 403;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                startDate: "Start date conflicts with an existing booking",
              };
              return next(err);
            }

            if (stay.startDate <= end && stay.endDate >= end) {
              const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
              );
              err.status = 403;
              err.message =
                "Sorry, this spot is already booked for the specified dates";
              err.errors = {
                endDate: "endDate date conflicts with an existing booking",
              };
              return next(err);
            }
          }
        }
      }

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

  if (!reservation) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    err.message = "Booking couldn't be found";
    return next(err);
  }

  if (reservation.userId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  const start = new Date(reservation.startDate);
  const today = new Date();
  if (start < today) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.status = 403;
    err.message = "Bookings that have been started can't be deleted";
    return next(err);
  }

  await Booking.destroy({
    where: {
      id: Number(bookingId),
    },
  });
  res.json("Successfully deleted");
});

module.exports = router;
