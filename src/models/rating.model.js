const rating = (sequelize, DataTypes) => {
  const Rating = sequelize.define('rating', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'rating',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  Rating.associate = models => {
    Rating.belongsTo(models.book, { as: 'book', foreignKey: 'book_id', targetKey: 'id' });
    Rating.belongsTo(models.user, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
  };

  return Rating;
};

module.exports = rating;
