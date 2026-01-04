import { Sequelize, Model, BuildOptions, Association } from "sequelize"
import { Db } from "./index"

export interface RegistrationManagement extends Model {
  readonly id: number

  readonly peer_review_open: boolean
  readonly peer_review_round: 1 | 2

  readonly project_registation_open: boolean
  readonly project_registation_message: string
  readonly project_registation_info: string

  readonly topic_registation_open: boolean
  readonly topic_registation_message: string

  readonly summer_project: boolean
  readonly summer_dates: any
}

export type RegistrationManagementStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RegistrationManagement;
  associate: (models: Required<Db>) => void
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const Registration_management = sequelize.define('registration_management', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_registration_open: {
      type: Sequelize.BOOLEAN
    },
    peer_review_open: {
      type: Sequelize.BOOLEAN
    },
    peer_review_round: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 2
      }
    },
    project_registration_message: {
      type: Sequelize.STRING
    },
    project_registration_info: {
      type: Sequelize.STRING
    },
    topic_registration_open: {
      type: Sequelize.BOOLEAN
    },
    topic_registration_message: {
      type: Sequelize.STRING
    },
    summer_project: {
      type: Sequelize.BOOLEAN
    },
    summer_dates: {
      type: Sequelize.JSONB
    }
  },
  {
    underscored: true
  })

  return Registration_management
}
