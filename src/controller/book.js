const { models, sequelize } = require('../models');
const _ = require('lodash');
const Sequelize = require('sequelize');
const path = require('path');

const {
    book: BookModel,
    rating: RatingModel,
} = models;

const ALLOWED_VALUES = ['name', 'genres', 'page_count', 'brief_description', 'published_date', 'is_download_allow'];

exports.addBook = async (req, done) => {
    try {
        let data = _.pick(req.body, ALLOWED_VALUES);
        data.author_id = req.user.user_id;
        let bookInstance = await BookModel.create(data, { returning: true });
        return done(null, bookInstance);
    } catch (err) {
        return done(err);
    }
};

exports.getBookList = async (req, done) => {
    try {
        const { user, query } = req;

        let sqlDataQuery = `SELECT 
        b.*,
        u.name AS authorName
        FROM book b
        LEFT JOIN
            public.user u
        ON 
            u.id = b.author_id
        WHERE b.deleted_at IS NULL`;

        if (user && _.includes(['READER', 'VISITOR'], user.role)) {
            sqlDataQuery = ` ${sqlDataQuery} AND b.is_approved = true`
        }

        if (query.keyword) {
            sqlDataQuery = ` ${sqlDataQuery} AND (b.genres iLIKE '%${query.keyword}%' OR u.name iLIKE '%${query.keyword}%')`
        }

        // SKIP
        if (_.has(query, '$skip')) {
            sqlDataQuery = `${sqlDataQuery}
        OFFSET ${query.$skip}`;
        }
        // LIMIT
        if (_.has(query, '$limit')) {
            sqlDataQuery = `${sqlDataQuery}
        LIMIT ${query.$limit}`;
        }

        const bookList = await sequelize.query(sqlDataQuery, { type: sequelize.QueryTypes.SELECT });
        return done(null, bookList);
    } catch (err) {
        console.log('eerr==', err)
        return done(err);
    }
};

exports.getBook = async (id, done) => {
    try {
        let filter = {
            where: {
                id
            },
            include: [
                {
                    model: RatingModel,
                    as: 'ratings',
                    attributes: []
                }
            ],
            group: ['book.id'],
            attributes: ['id', 'name', 'author_id', 'genres', 'page_count', 'brief_description', 'published_date', 'book_url', 'is_approved', 'is_download_allow', [Sequelize.fn('AVG', Sequelize.col('ratings.rating')), 'avgRating']],
        }
        let bookInstance = await BookModel.findOne(filter);
        if (_.isEmpty(bookInstance)) {
            return done('Book does not exists');
        }
        return done(null, bookInstance);
    } catch (err) {
        return done(err);
    }
};

exports.updateBook = async (req, done) => {
    try {
        const { user, body, params } = req;
        let bookInstance = await BookModel.findByPk(params.id);
        if (_.isEmpty(bookInstance)) {
            return done('Book does not exists');
        }
        let updatedInstance;
        if (user.role === 'AUTHOR') {
            let data = _.pick(body, ALLOWED_VALUES);
            updatedInstance = await bookInstance.update(data, { returning: true });
        } else if (user.role === 'ADMIN' && body.is_approved) {
            let data = {
                is_approved: body.is_approved
            }
            updatedInstance = await bookInstance.update(data, { returning: true });
        } else {
            updatedInstance = bookInstance;
        }
        return done(null, updatedInstance);
    } catch (err) {
        return done(err);
    }
};

exports.uploadBook = async (req, done) => {
    try {
        const { file, params } = req;
        let bookInstance = await BookModel.findByPk(params.id);
        if (_.isEmpty(bookInstance)) {
            return done('Book does not exists');
        }
        console.log('caleddd==', file)
        let fileName = file.originalname.split('.');
        bookInstance.book_url = `uploads/${file.name}`;
        let updatedInstance = await bookInstance.save();
        return done(null, updatedInstance);
    } catch (err) {
        return done(err);
    }
};

exports.downloadBook = async (req, res, done) => {
    try {
        const { params } = req;
        let bookInstance = await BookModel.findByPk(params.id);
        if (_.isEmpty(bookInstance)) {
            return done('Book does not exists');
        }
        if (!bookInstance.is_download_allow) {
            return done('Book is not allowed to download by author');
        }
        return res.download(path.join(__dirname, `../public/${bookInstance.book_url}`));
    } catch (err) {
        return done(err);
    }
};
