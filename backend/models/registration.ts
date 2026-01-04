import { Sequelize, Model, BuildOptions, Association } from "sequelize"
import { Db } from "./index"
import { User } from "./user"

export interface Registration extends Model {
  readonly id: number
  readonly preferred_topics: any
  readonly questions: any

  readonly configuration_id: number

  readonly student?: User
  associations: {
    registration: Association<Registration, User>
  }
}

export type RegistrationStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Registration;
  associate: (models: Required<Db>) => void
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const Registration = <RegistrationStatic>sequelize.define('registration', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    preferred_topics: {
      type: Sequelize.JSONB
    },
    questions: {
      type: Sequelize.JSONB
    },
    configuration_id: {
      type: Sequelize.INTEGER
    },
  },
  {
    underscored: true
  })

  Registration.associate = (models) => {
    Registration.belongsTo(models.User, {
      as: 'student'
    })
  }

  return Registration
}
