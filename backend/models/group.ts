import { Sequelize, Model, BuildOptions } from "sequelize"
import { User } from "./user"

export interface Group extends Model {
  readonly id: number
  readonly name: string

  readonly topicId: number
  readonly configurationId: number
  readonly instructorId: number

  readonly students: User[]
  readonly sprints: any[]

  readonly createdAt: string
  readonly updatedAt: string

}

export type GroupStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Group;
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const Group = <GroupStatic>sequelize.define('group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: Sequelize.STRING
  },
  {
    underscored: true
  })

  return Group
}
