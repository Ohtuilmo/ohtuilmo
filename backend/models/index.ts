import { Sequelize } from 'sequelize'
import { dbUrl } from "../config"

import UserModel from './user'
import GroupModel from './group'
import TopicModel from './topic'
import TopicDateModel from './topic_date'
import RegistrationModel from './registration'
import ConfigurationModel from './configuration'
import RegistrationQuestionSetModel from './registration_question_set'
import ReviewQuestionSetModel from './review_question_set'

import CustomerReviewQuestionSetModel from './customer_review_question_set'

// import Review from './review'
// import Review_answer from './review_answer'
import RegistrationManagementModel from './registration_management'
import PeerReviewModel from './peer_review'
import EmailTemplateModel from './email_template'
import InstructorReviewModel from './instructor_review'
import CustomerReviewModel from './customer_review'
import SentTopicEmailModel from './sent_topic_email'

import SprintModel from './sprint'
import TagModel from './tag'
import TimeLogModel from './time_log'
import TimeLogTagModel from './time_log_tag'

interface Db {
  User?: any
  Group?: any
  Topic?: any
  TopicDate?: any
  Registration?: any
  Configuration?: any
  RegistrationQuestionSet?: any
  ReviewQuestionSet?: any

  CustomerReviewQuestionSet?: any

  RegistrationManagement?: any
  PeerReview?: any
  EmailTemplate?: any
  InstructorReview?: any

  CustomerReview?: any
  SentTopicEmail?: any

  Sprint?: any
  Tag?: any
  TimeLog?: any
  TimeLogTag?: any

  sequelize?: Sequelize
}

export let db: Db = {}

// Populates the global db variable (above) with all models
export const createDbConnection = (): void => {
  const sequelize = new Sequelize(dbUrl, { logging: false })

  console.log('connecting to db ' + dbUrl)

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err: Error) => {
      console.error('Unable to connect to the database:', err)
    })

  const User = UserModel(sequelize, Sequelize)
  const Group = GroupModel(sequelize, Sequelize)
  const Topic = TopicModel(sequelize, Sequelize)
  const TopicDate = TopicDateModel(sequelize, Sequelize)
  const Registration = RegistrationModel(sequelize, Sequelize)
  const Configuration = ConfigurationModel(sequelize, Sequelize)
  const RegistrationQuestionSet = RegistrationQuestionSetModel(
    sequelize,
    Sequelize
  )
  const ReviewQuestionSet = ReviewQuestionSetModel(sequelize, Sequelize)
  const CustomerReviewQuestionSet = CustomerReviewQuestionSetModel(
    sequelize,
    Sequelize
  )
  const RegistrationManagement = RegistrationManagementModel(
    sequelize,
    Sequelize
  )
  const PeerReview = PeerReviewModel(sequelize, Sequelize)
  const EmailTemplate = EmailTemplateModel(sequelize, Sequelize)
  const CustomerReview = CustomerReviewModel(sequelize, Sequelize)
  const InstructorReview = InstructorReviewModel(sequelize, Sequelize)
  const SentTopicEmail = SentTopicEmailModel(sequelize, Sequelize)

  const Sprint = SprintModel(sequelize, Sequelize)
  const Tag = TagModel(sequelize, Sequelize)
  const TimeLog = TimeLogModel(sequelize, Sequelize)
  const TimeLogTag = TimeLogTagModel(sequelize, Sequelize)

  db = {
    User,
    Group,
    Topic,
    TopicDate,
    Registration,
    Configuration,
    RegistrationQuestionSet,
    ReviewQuestionSet,

    CustomerReviewQuestionSet,

    RegistrationManagement,
    PeerReview,
    EmailTemplate,
    InstructorReview,

    CustomerReview,
    SentTopicEmail,

    Sprint,
    Tag,
    TimeLog,
    TimeLogTag,

    sequelize 
  }
  db.Group.belongsTo(Topic, {
    as: 'topic',
  })
  db.Group.belongsTo(Configuration, {
    as: 'configuration',
  })
  db.Group.belongsToMany(User, {
    through: 'group_students',
    as: 'students',
  })
  db.User.belongsToMany(Group, {
    through: 'group_students',
    as: 'groups',
  })
  db.Group.belongsTo(User, {
    as: 'instructor',
    foreignKey: 'instructorId',
  })

  db.PeerReview.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
  })

  db.PeerReview.belongsTo(Configuration, {
    as: 'configuration',
    foreignKey: 'configuration_id',
  })

  db.CustomerReview.belongsTo(Group, {
    as: 'group',
    foreignKey: 'group_id',
  })
  db.CustomerReview.belongsTo(Topic, {
    as: 'topic',
    foreignKey: 'topic_id',
  })
  db.Topic.hasMany(CustomerReview, {
    as: 'customer_review',
    foreignKey: 'topic_id',
  })
  db.CustomerReview.belongsTo(Configuration, {
    as: 'configuration',
    foreignKey: 'configuration_id',
  })

  db.Configuration.hasOne(RegistrationManagement, {
    as: 'peer_review_configuration',
    foreignKey: 'peer_review_conf',
  })

  db.Configuration.hasOne(RegistrationManagement, {
    as: 'project_registration_configuration',
    foreignKey: 'project_registration_conf',
  })

  db.Configuration.hasOne(RegistrationManagement, {
    as: 'topic_registration_configuration',
    foreignKey: 'topic_registration_conf',
  })

  db.Topic.belongsTo(Configuration, {
    as: 'configuration',
    foreignKey: 'configuration_id',
  })

  db.InstructorReview.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
  })

  db.SentTopicEmail.belongsTo(Topic, {
    as: 'topic',
    foreignKey: 'topic_id',
  })
  db.Topic.hasMany(SentTopicEmail, {
    as: 'sent_emails',
    foreignKey: 'topic_id',
  })

  db.Group.hasMany(Sprint, {
    foreignKey: 'group_id',
    as: 'sprints',
  })

  db.Sprint.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group',
  })

  db.TimeLog.belongsTo(Sprint, {
    foreignKey: 'sprint_id',
    as: 'sprint',
  })

  db.Sprint.hasMany(TimeLog, {
    foreignKey: 'sprint_id',
    as: 'timeLogs',
  })

  db.TimeLog.belongsTo(User, {
    foreignKey: 'student_number',
    as: 'student',
  })

  db.Tag.belongsToMany(TimeLog, {
    through: 'time_log_tags',
    foreignKey: 'tag_id',
    as: 'timeLogs',
  })

  db.TimeLog.belongsToMany(Tag, {
    through: 'time_log_tags',
    foreignKey: 'time_log_id',
    as: 'tags',
  })

  db.Configuration.associate(db)
  db.Registration.associate(db)

  db.sequelize!.sync()
}

export default db
