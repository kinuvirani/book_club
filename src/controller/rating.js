const { models } = require('../models');
const _ = require('lodash');

const {
    rating: RatingModel,
} = models;

const ALLOWED_VALUES = ['book_id', 'rating'];

exports.addRating = async (req, done) => {
    try {
        const { user: { user_id }, body } = req;
        let ratingInstance = await RatingModel.findOne({ where: { user_id, book_id: body.book_id } });
        if (!_.isEmpty(ratingInstance)) {
            ratingInstance.rating = body.rating ? body.rating : ratingInstance.rating;
            ratingInstance = await ratingInstance.save();
        } else {
            let data = _.pick(body, ALLOWED_VALUES);
            data.user_id = user_id;
            ratingInstance = await RatingModel.create(data, { returning: true });
        }
        return done(null, ratingInstance);
    } catch (err) {
        return done(err);
    }
};