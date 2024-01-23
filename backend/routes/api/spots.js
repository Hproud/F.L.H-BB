const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, Image, Booking, User } = require("../../db/models");
// const { validationResult } = require('express-validator');
const { Op } = require("sequelize");

const router = express.Router();

//?---------------------------------------------------------------------
const ValidateQueries = [
  check("page")
    .optional({ checkFalsy: true })
    .isFloat({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional({ checkFalsy: true })
    .isFloat({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("minLat")
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];
//?---------------------------------------------------------------------

const validateSpot = [
  check("address").trim().notEmpty().withMessage("Street address is required"),
  check("city")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check("state")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check("country")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .trim()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .trim()
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
    check("description")
    .isLength({min: 30})
    .withMessage('Description needs a minimum of 30 characters'),
  check("price")
    .trim()
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
    // check("previewImage")
    // .exists({checkFalsy: true })
    // .withMessage('At least one image is required'),
    // check("previewImage")
    // .custom((value) =>{
    //   if(value.includes('png') || value.includes('jpg') || value.includes('jpeg') || value.includes('webp') ) return true
    // })
    // .withMessage("Image Url must end in .png, .jpg, or .jpeg"),
  handleValidationErrors,
];

//?-------------------------------------------------------------------

const validateReview = [
  check("review")
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//?-----------------------------------------------------------------?//

validateDates = [
  check("startDate")
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







//?--------------------------------------------------------------------
const getAvg = async (id) => {
  const allReviews = await Review.findAll({
    where: {
      spotId: id,
    },
    attributes: ["stars"],
  });
  let avg;
  const count = allReviews.length;

  let sum = 0;

  allReviews.forEach((record) => {
    const rate = record.dataValues.stars;

    sum += rate;
  });

  if (count > 0) {
    avg = Math.ceil(sum / count);
  } else {
    avg = 0;
  }

  return avg;
};

//?-------------FIND ALL PROPERTIES USER OWNS------------------------?//

router.get("/current", requireAuth, async (req, res, next) => {
  const currUser = req.user.id;


  const properties = await Spot.findAll({
    where: {
      ownerId: currUser,
    },
  });

  if (!properties) {
    res.json("You do not have any properties listed");
  } else {
    const all = [];
    for (let i = 0; i < properties.length; i++) {
      const spot = properties[i];
      all.push({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.numReviews,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      });
    }
    res.json({ Spots: all });
  }
});

//?================ADD IMAGES TO SPOT================================?//

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const spotId = Number(req.params.spotId);
  const { url, preview } = req.body;
  const currUser = req.user.dataValues.id;
  const property = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  if (!property) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.message = "Spot couldn't be found";
    next(err);
  }

  if (property.ownerId === currUser) {
    const pic = await Image.create({
      url: url,
      preview: preview,
      imageableId: spotId,
      imageableType: "Spot",
    });
    const location = property.toJSON();

    if (pic.preview) {
      await property.update({
        previewImage: url,
      });
    }
    res.json({
      id: pic.id,
      url: pic.url,
      preview: pic.preview,
    });
  } else {
    const err = Error("Forbidden");
    (err.status = 403), (err.title = "Forbidden");
    err.message = "Forbidden";
    next(err);
  }

});

//?------------------GET INFO ABOUT SPECIFIC SPOT-------------------?//

router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;

  const location = await Spot.findOne({
    where: {
      id: Number(spotId),
    },
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "price",
      "avgRating",
      "previewImage",
      "description"
    ],
  });

  if (!location) {
    const err = Error("Spot couldn`t be found");
    err.status = 404;
    err.title = "Spot not found";
    err.message = "Spot couldn`t be found";
    return next(err);
  } else {


    const pics = await Image.findAll({
      where: {
        imageableId: Number(spotId),
        imageableType: "Spot",
      },
      as: "SpotImages",
      attributes: ["id", "url", "preview"],
    });


    pics.map((each) => each.toJSON());

    const owners = await User.findOne({
      where: {
        id: location.ownerId,
      },
      as: "Owner",
      attributes: ["id", "firstName", "lastName"],
    });

    const reviews = await Review.findAll({
      where: {
        spotId: Number(spotId),
      },
      attributes: ['review','stars','userId','spotId','createdAt','updatedAt']
    });

    location.numReviews = reviews.length;

    res.json({
      id: location.id,
      ownerId: location.ownerId,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lng: location.lng,
      name: location.name,
      description: location.description,
      price: location.price,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
      numReviews: location.numReviews,
      avgRating: location.avgRating,
      previewImage: location.previewImage,
      SpotImages: pics,
      Owner: {
        id: owners.id,
        firstName: owners.firstName,
        lastName: owners.lastName,
      },
    });
  }
});

//?---------------------GET ALL SPOTS--------------------------------?//
router.get("/", ValidateQueries, async (req, res) => {
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  let { page, size } = req.query;
  if (
    page ||
    size ||
    minLat ||
    maxLat ||
    minLng ||
    maxLng ||
    minPrice ||
    maxPrice
  ) {
    const pagination = {};
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    page = parseInt(page);
    size = parseInt(size);

    if (Number.isInteger(page) && page > 10) {
      page = 10;
    }

    if (Number.isInteger(size) && size > 20) {
      size = 20;
    }

    if (
      Number.isInteger(page) &&
      Number.isInteger(size) &&
      page > 1 &&
      page < 20 &&
      size > 0 &&
      size < 20
    ) {
      pagination.limit = size;
      pagination.offset = size * (page - 1);
    } else {
      pagination.limit = size;
      pagination.offset = size * (page - 1);
    }



    let where = {};


    if (minLat) {
      where.lat = { [Op.gte]: minLat };
    }

    if (maxLat) {
      where.lat = { [Op.lte]: maxLat };
    }

    if (minLng) {
      where.lng = { [Op.gte]: minLng };
    }

    if (maxLng) {
      where.lng = { [Op.lte]: maxLng };
    }

    if (minPrice) {
      where.price = { [Op.gte]: minPrice };
    }

    if (maxPrice) {
      where.price = { [Op.lte]: maxPrice };
    }

    let result = {};

    result.count = await Spot.count({ where });
    if (!result.count) {
      res.json("No results");
    }
    result.rows = await Spot.findAll({
      where,
      include: { model: Image, as: "SpotImages" },
      limit: pagination.limit,
      offset: pagination.offset,
    });
    const theCount = result.rows;
    if (theCount === 0) {
      res.json(result.count);
    }

    result.page = page || 1;
    result.size = theCount.length;


    const all = [];
    for (let i = 0; i < result.rows.length; i++) {
      const spot = result.rows[i];
      id = result.rows[i].id;
      const avg = await getAvg(id);
      result.rows[i].avgRating = avg;
      const image = await Image.findOne({
        where: {
          imageableId: id,
          imageableType: "Spot",
          preview: true,
        },
        attributes: ["url"],
      });

      all.push({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      });
    }
    res.json({

      Spots: all,
      page: result.page,
      size: result.size,
    });

  } else {
    const allSpots = await Spot.findAll();

    const all = [];
    for (let i = 0; i < allSpots.length; i++) {
      const spot = allSpots[i];
      id = allSpots[i].id;
      all.push({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      });
      const avg = await getAvg(id);
      const image1 = await Image.findOne({
        where: {
          imageableId: id,
          imageableType: "Spot",
          preview: true,
        },
        attributes: ["url"],
      });

      if (image1) {
        await allSpots[i].update({
          avgRating: avg,
          previewImage: image1.url,
        });
      } else {
        await allSpots[i].update({
          avgRating: avg
        });
      }

      allSpots[i].avgRating = avg
    }

    res.json({ Spots: all });
  }
});

//?----------------------------ADD SPOT------------------------------?//
//&--------------------     fixed this bug   ------------------------?//
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage } =
    req.body;

  const ownerId = req.user.id;
  if (!ownerId) {
  }
  const checked = await Spot.findOne({
    where: {
      address: address,
    },
  });

  if (!checked) {
    const newSpot = await Spot.create({
      ownerId: ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      previewImage
    });

return res.status(201).json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      previewImage: newSpot.previewImage,
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt,
    });
  } else {

    const err = Error("Location already exists");

    err.message = "Location already exists";
    err.title = "Location already exists";
    err.status = 400;
    next(err);
  }
});

//?-------------------------DELETE A SPOT----------------------------?//

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const id = Number(req.params.spotId);
  const theSpot = await Spot.findByPk(id);

  if (theSpot) {
    if (req.user.id === theSpot.ownerId) {
      await theSpot.destroy();
      res.json(theSpot);
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      err.message = "Forbidden";
      next(err);
    }
  } else {
    const err = new Error("Spot not found");
    (err.message = "Spot not found"), (err.status = 404);
    next(err);
  }
});

//?---------------EDIT A SPOT PUT ROUTES----------------------------//?

router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const id = req.params.spotId;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const location = await Spot.findOne({
    where: {
      id: id,
    },
  });

  if (!location) {
    const err = Error("Spot couldn`t be found");
    err.status = 404;
    err.message = "Spot couldn`t be found";
    next(err);
  }

  if (req.user.id !== location.ownerId) {
    const err = Error("Forbidden");
    err.status = 403;
    err.title = "Forbidden";
    err.message = "Forbidden";
    next(err);
  } else {
    const updated = await Spot.update(
      { address, city, state, country, lat, lng, name, description, price },
      {
        where: {
          id: location.id,
        },
      }
    );

    res.json({
      id: location.id,
      ownerId: location.ownerId,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lng: location.lng,
      name: location.name,
      description: location.description,
      price: location.price,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    });
  }
});

//?-----------------GET REVIEWS FOR SPOT BY SPOT ID---------------------

router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;

  const place = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  if (!place) {
    const err = new Error("Spot couldnt be found");
    (err.message = "Spot couldn`t be found"), (err.status = 404);
    next(err);
  } else {
    const locationReviews = await Review.findAll({
      where: {
        spotId: spotId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Image,
          as: "ReviewImages",
          attributes: ["id", "url"],
        },
      ],
    });

    return res.json({ Reviews: locationReviews });
  }
});

//?------------------CREATE NEW REVIEW BY SPOT ID----------------------

router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { spotId } = req.params;
    const location = await Spot.findOne({
      where: {
        id: Number(spotId),
      },
    });

    if (!location) {
      const err = new Error("Spot couldn`t be found");
      err.status = 404;
      err.message = "Spot could`t be found";
      next(err);
    } else {
      const reviewCheck = await Review.findAll({
        where: {
          spotId: Number(spotId),
          userId: req.user.id,
        },
      });
      if (reviewCheck.length) {
        const err = new Error("User already has a review for this spot");
        err.status = 500;
        err.message = "User already has a review for this spot";
        next(err);
      } else {

        const newReview = await Review.create({
          review: req.body.review,
          stars: req.body.stars,
          userId: req.user.id,
          spotId: Number(spotId),
        });
        // res.status = 200;
        res.status(201).json({
          id: newReview.id,
          userId: newReview.userId,
          spotId: newReview.spotId,
          review: newReview.review,
          stars: newReview.stars,
          createdAt: newReview.createdAt,
          updatedAt: newReview.updatedAt,
        });
      }
    }
  }
);

//?------------------GET ALL BOOKINGS FOR SPOT BY ID--------------------

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;


  const checking = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  if (!checking) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.message = "Spot couldn't be found";
    next(err);
  } else {


    if (req.user.id === checking.ownerId) {


      const theBooks = await Booking.findAll({
        where: {
          spotId: spotId,
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
        include: [
          { model: User, attributes: ["id", "firstName", "lastName"] },
          {
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
        ],
      });
      const final = [];
      theBooks.forEach((booking) => {
        const curr = booking.toJSON();

        const constructed = {
          User: curr.User,
          id: curr.id,
          spotId: curr.spotId,
          userId: curr.userId,
          startDate: curr.startDate,
          endDate: curr.endDate,
          createdAt: curr.createdAt,
          updatedAt: curr.updatedAt,
        };
        final.push(constructed);
      });


      res.json({ Bookings: final });
    } else {
      const theBooks = await Booking.findAll({
        where: {
          spotId: spotId,
        },

        attributes: ["spotId", "startDate", "endDate"],
      });


      res.json({ Bookings: theBooks });
    }
  }
});

//?--------------------------CREATE A BOOKING FROM THE SPOT ID--------------------------------
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateDates,
  async (req, res, next) => {
    const { spotId } = req.params;
    const id = Number(spotId);

    let { startDate, endDate } = req.body;


    const location = await Spot.findOne({
      where: {
        id: spotId,
      },
    });

    if (!location) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      err.message = "Spot couldn't be found";
      next(err);
    } else if (req.user.id !== location.ownerId) {

      const bookings = await Booking.findAll({
        where: { spotId: location.id },
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


          const begin = new Date(startDate);
          const end = new Date(endDate);


          if (
            (begin < stay.startDate && stay.endDate < end) ||
            (stay.startDate < begin && end < stay.endDate)
          ) {
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

        const userBookings = await Booking.findAll({
          where: {
            userId: location.ownerId,
          },
        });


        const user = [];
        userBookings.forEach((booking) => {
          const newBooking = booking.toJSON();
          user.push(newBooking);
        });

        if (user.length) {

          for (let i = 0; i < user.length; i++) {
            const stay = user[i];


            const begin = new Date(startDate);
            const end = new Date(endDate);

            if (
              (begin < stay.startDate && stay.endDate < end) ||
              (stay.startDate < begin && end < stay.endDate)
            ) {
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
      const newBooking = await Booking.create({
        startDate,
        endDate,
        spotId: id,
        userId: req.user.id,
      });
      const found = await Booking.findOne({
        where: {
          startDate: newBooking.startDate,
          endDate: newBooking.endDate,
          spotId: newBooking.spotId,
          userId: newBooking.userId,
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

      return res.json({
        id: found.id,
        spotId: found.spotId,
        userId: found.userId,
        startDate: found.startDate,
        endDate: found.endDate,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      err.message = "Forbidden";
      next(err);
    }
  }
);

module.exports = router;
