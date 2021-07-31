const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('AUTHOR', 'READER', 'ADMIN'), //Currently user can be either author or reader, but we can also manage single user with multiple role, because author can also be reader
      defaultValue: 'AUTHOR',
    }
  }, {
    tableName: 'user',
    paranoid: true,
    timestamps: true,
    underscored: true,
  });

  User.associate = models => {
    User.hasMany(models.book, {
      as: 'books', foreignKey: 'author_id', sourceKey: 'id', onDelete: 'RESTRICT',
    });
    User.hasMany(models.bookmark, {
      as: 'bookmarks', foreignKey: 'user_id', sourceKey: 'id', onDelete: 'RESTRICT',
    });
  };

  return User;
};

module.exports = user;
