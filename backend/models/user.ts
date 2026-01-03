import type { Sequelize, Model, BuildOptions } from "sequelize"

export interface User extends Model {
  readonly student_number: number
  readonly username: string
  readonly first_names: string
  readonly last_name: string
  readonly email: string
  readonly admin: boolean
}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User;
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const User = <UserStatic>sequelize.define('user', {
    student_number: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    first_names: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  {
    underscored: true
  })

  return User
}
