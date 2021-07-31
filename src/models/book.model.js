const book = (sequelize, DataTypes) => {
  const Book = sequelize.define('book', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genres: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    page_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    brief_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    book_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_download_allow: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'book',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  Book.associate = models => {
    Book.belongsTo(models.user, { as: 'author', foreignKey: 'author_id', targetKey: 'id' });
    Book.hasMany(models.rating, { as: 'ratings', foreignKey: 'book_id', sourceKey: 'id', onDelete: 'RESTRICT', });
  };

  return Book;
};

module.exports = book;
