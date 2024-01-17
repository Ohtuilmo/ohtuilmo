module.exports = (sequelize, Sequelize) => {
  const customerReviews = sequelize.define('customer_review', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    answer_sheet: {
      type: Sequelize.JSONB
    },
    // Sequelize timestamps
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    underscored: true
  })
  return customerReviews
}
