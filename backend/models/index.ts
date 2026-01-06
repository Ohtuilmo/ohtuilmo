import { Sequelize } from 'sequelize'
import { dbUrl } from "../config"

import UserModel, { UserStatic } from './user'
import GroupModel, { GroupStatic } from './group'
import TopicModel, { TopicStatic } from './topic'
import TopicDateModel from './topic_date'
import RegistrationModel, { RegistrationStatic } from './registration'
import ConfigurationModel, { ConfigurationStatic } from './configuration'
import RegistrationQuestionSetModel from './registration_question_set'
import ReviewQuestionSetModel from './review_question_set'

import CustomerReviewQuestionSetModel from './customer_review_question_set'

// import Review from './review'
// import Review_answer from './review_answer'
import RegistrationManagementModel, { RegistrationManagementStatic } from './registration_management'
import PeerReviewModel from './peer_review'
import EmailTemplateModel from './email_template'
import InstructorReviewModel from './instructor_review'
import CustomerReviewModel from './customer_review'
import SentTopicEmailModel from './sent_topic_email'

import SprintModel from './sprint'
import TagModel from './tag'
import TimeLogModel from './time_log'
import TimeLogTagModel from './time_log_tag'


// Singleton class for db management:
// Only one database instance is created
// and that is shared across the project
export class Database {
  private static dbInstance: Database | null = null

  static connect(): Database {
    if (!Database.dbInstance)
      return new Database
    return Database.dbInstance
  }

  static disconnect(): void {

  }

  closeDbConnection(): void {
    if (Database.dbInstance)
      return Database.connect().sequelize.close()
    return
  }

  public readonly User: UserStatic
  public readonly Group: GroupStatic
  public readonly Topic: TopicStatic
  public readonly TopicDate: any
  public readonly Registration: RegistrationStatic
  public readonly Configuration: ConfigurationStatic
  public readonly RegistrationQuestionSet: any
  public readonly ReviewQuestionSet: any

  public readonly CustomerReviewQuestionSet: any

  public readonly RegistrationManagement: RegistrationManagementStatic
  public readonly PeerReview: any
  public readonly EmailTemplate: any
  public readonly InstructorReview: any

  public readonly CustomerReview: any
  public readonly SentTopicEmail: any

  public readonly Sprint: any
  public readonly Tag: any
  public readonly TimeLog: any
  public readonly TimeLogTag: any

  public readonly sequelize: Sequelize

  private constructor() {
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

    this.User = User
    this.Group = Group
    this.Topic = Topic
    this.TopicDate = TopicDate
    this.Registration = Registration
    this.Configuration = Configuration
    this.RegistrationQuestionSet = RegistrationQuestionSet
    this.ReviewQuestionSet = ReviewQuestionSet

    this.CustomerReviewQuestionSet = CustomerReviewQuestionSet

    this.RegistrationManagement = RegistrationManagement
    this.PeerReview = PeerReview
    this.EmailTemplate = EmailTemplate
    this.InstructorReview = InstructorReview

    this.CustomerReview = CustomerReview
    this.SentTopicEmail = SentTopicEmail

    this.Sprint = Sprint
    this.Tag = Tag
    this.TimeLog = TimeLog
    this.TimeLogTag = TimeLogTag

    this.sequelize = sequelize

    this.Group.belongsTo(Topic, {
      as: 'topic',
    })
    this.Group.belongsTo(Configuration, {
      as: 'configuration',
    })
    this.Group.belongsToMany(User, {
      through: 'group_students',
      as: 'students',
    })
    this.User.belongsToMany(Group, {
      through: 'group_students',
      as: 'groups',
    })
    this.Group.belongsTo(User, {
      as: 'instructor',
      foreignKey: 'instructorId',
    })

    this.PeerReview.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
    })

    this.PeerReview.belongsTo(Configuration, {
      as: 'configuration',
      foreignKey: 'configuration_id',
    })

    this.CustomerReview.belongsTo(Group, {
      as: 'group',
      foreignKey: 'group_id',
    })
    this.CustomerReview.belongsTo(Topic, {
      as: 'topic',
      foreignKey: 'topic_id',
    })
    this.Topic.hasMany(CustomerReview, {
      as: 'customer_review',
      foreignKey: 'topic_id',
    })
    this.CustomerReview.belongsTo(Configuration, {
      as: 'configuration',
      foreignKey: 'configuration_id',
    })

    this.Configuration.hasOne(RegistrationManagement, {
      as: 'peer_review_configuration',
      foreignKey: 'peer_review_conf',
    })

    this.Configuration.hasOne(RegistrationManagement, {
      as: 'project_registration_configuration',
      foreignKey: 'project_registration_conf',
    })

    this.Configuration.hasOne(RegistrationManagement, {
      as: 'topic_registration_configuration',
      foreignKey: 'topic_registration_conf',
    })

    this.Topic.belongsTo(Configuration, {
      as: 'configuration',
      foreignKey: 'configuration_id',
    })

    this.InstructorReview.belongsTo(User, {
      as: 'user',
      foreignKey: 'user_id',
    })

    this.SentTopicEmail.belongsTo(Topic, {
      as: 'topic',
      foreignKey: 'topic_id',
    })
    this.Topic.hasMany(SentTopicEmail, {
      as: 'sent_emails',
      foreignKey: 'topic_id',
    })

    this.Group!.hasMany(Sprint, {
      foreignKey: 'group_id',
      as: 'sprints',
    })

    this.Sprint.belongsTo(Group, {
      foreignKey: 'group_id',
      as: 'group',
    })

    this.TimeLog.belongsTo(Sprint, {
      foreignKey: 'sprint_id',
      as: 'sprint',
    })

    this.Sprint.hasMany(TimeLog, {
      foreignKey: 'sprint_id',
      as: 'timeLogs',
    })

    this.TimeLog.belongsTo(User, {
      foreignKey: 'student_number',
      as: 'student',
    })

    this.Tag.belongsToMany(TimeLog, {
      through: 'time_log_tags',
      foreignKey: 'tag_id',
      as: 'timeLogs',
    })

    this.TimeLog.belongsToMany(Tag, {
      through: 'time_log_tags',
      foreignKey: 'time_log_id',
      as: 'tags',
    })

    this.Configuration!.associate(this)
    this.Registration!.associate(this)

    this.sequelize!.sync()
  }
}

export const db = Database.connect()

export default db
