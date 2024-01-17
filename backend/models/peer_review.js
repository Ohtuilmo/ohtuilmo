module.exports = (sequelize, Sequelize) => {
  const peerReviews = sequelize.define('peer_review', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    review_round: {
      type: Sequelize.INTEGER
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

  return peerReviews
}
