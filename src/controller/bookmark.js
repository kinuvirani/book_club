const { models } = require('../models');
const _ = require('lodash');

const {
    bookmark: BookmarkModel,
} = models;

const ALLOWED_VALUES = ['book_id'];

exports.addBookmark = async (req, done) => {
    try {
        const { user: { user_id }, body } = req;
        let bookmarkInstance = await BookmarkModel.findOne({ where: { user_id } });
        if (bookmarkInstance && _.includes(bookmarkInstance.book_id, body.book_id)) {
            return done('You already bookmarked this page');
        } else if (bookmarkInstance && !_.includes(bookmarkInstance.book_id, body.book_id)) {
            bookmarkInstance.book_id = [...bookmarkInstance.book_id, body.book_id];
            bookmarkInstance = await bookmarkInstance.save();
        } else {
            let data = _.pick(body, ALLOWED_VALUES);
            data.user_id = user_id;
            data.book_id = [body.book_id];
            bookmarkInstance = await BookmarkModel.create(data, { returning: true });
        }
        return done(null, bookmarkInstance);
    } catch (err) {
        return done(err);
    }
};