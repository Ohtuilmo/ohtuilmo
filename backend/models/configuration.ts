import { Sequelize, Model, ModelCtor, Association, BuildOptions } from "sequelize"
import { Db } from "./index"
import { Registration } from "./registration"

export interface Configuration extends Model {
  readonly id: number
  readonly name: string
  readonly type: string
  readonly content: any
  readonly active: boolean

  readonly registrations?: Registration[]

  associations: {
    registration: Association<Configuration, Registration>
  }
}

export type ConfigurationStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Configuration;
  associate: (models: Required<Db>) => void
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const Configuration = <ConfigurationStatic>sequelize.define(
    'configuration',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.JSONB,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
    },
    {
      underscored: true,
    }
  )

  Configuration.associate = (models) => {
    Configuration.hasMany(models.Registration) // used only for creating the foreign key in registrations, should be removed and implemented from registration side
    Configuration.belongsTo(models.ReviewQuestionSet, {
      as: 'review_question_set1',
    })
    Configuration.belongsTo(models.ReviewQuestionSet, {
      as: 'review_question_set2',
    })
    Configuration.belongsTo(models.RegistrationQuestionSet)
    Configuration.belongsTo<Configuration, any>(models.CustomerReviewQuestionSet)
  }

  return Configuration
}
