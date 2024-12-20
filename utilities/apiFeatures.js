class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {
      ...this.queryString
    }; // Setting a new object based on another object is a reference. This uses destructuring to create another

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields'
    ]; // Limits paging, sorting, limiting, and selecting specific fields

    // Delete excluded parameters
    excludedFields.forEach(
      (element) => delete queryObj[element]
    );

    // Advanced filtering using GTE, LTE, LT, and GT
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}` // g means it happens multiple times
    );

    // Filtering to get based on query params
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // SORTING
    console.log(this.queryString);
    if (this.queryString.sort) {
      // MULTI-VARIABLE SORTING
      const sortBy = this.queryString.sort
        .split(',')
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Good practice to default sorting by created at descending
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(',')
        .join(' ');
      this.query = this.query.select(fields);
      // query = query.select('name duration price') Express accepts this format
    } else {
      // MongoDB, '-' means exclude in select. This excludes the default mongodb variable
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // PAGINATION
    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    // skip how many values and limit how many outputs
    const page = this.queryString.page * 1 || 1; // || provides a default value
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
