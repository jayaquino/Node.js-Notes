const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters'
      ]
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must only contain characters'
      // ]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty should be one of the following: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than 1.0'],
      max: [5, 'Rating must be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //'this' will not work on update. Only when working with a new document. Mongoose caveat
          return value < this.price; // e.g. 100 < 200 no error. 250 < 200 triggers validation error
        },
        message:
          'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true // Removes white space in beginning and end
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordiantes: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      { type: mongoose.Schema.ObjectId, ref: 'User' }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 1 is ascending, -1 is descending
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
// foreignField is the name on another model
// localField is the name on this model
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

// Embedding user
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(
//     async (id) => await User.findById(id)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post(
//   'save',
//   function (doc, next) {
//     console.log(doc);
//     next();
//   },
// );

// QUERY MIDDLEWARE
tourSchema.pre(
  /^find/, // Regex to query everything that starts with find
  function (next) {
    this.find({
      secretTour: { $ne: true }
    });
    this.start = Date.now();
    next();
  }
);

tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Query took ${Date.now() - this.start} milliseconds`
  );
  next();
});

tourSchema.pre(/^find/, function (next) {
  // Populate gets all data of a reference. Can manually select. Populate behind the scenes creates another query, may affect performance.
  // const tour = await Tour.findById(req.params.id).populate(
  //   'guides'
  // );
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

// tourSchema.pre('find' or 'findOne', function (next) {
//   this.find({
//     secretTour: { $ne: true },
//   });
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     // Unshift adds beginning of array, shift adds end of the array
//     $match: {
//       secretTour: { $ne: true }
//     }
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
