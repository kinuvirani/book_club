const bookmark = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('bookmark', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
  }, {
    tableName: 'bookmark',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  Bookmark.associate = models => {
    Bookmark.belongsTo(models.user, { as: 'user', foreignKey: 'user_id', targetKey: 'id' });
  };

  return Bookmark;
};

module.exports = bookmark;
