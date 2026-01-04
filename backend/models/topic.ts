import { Sequelize, Model, BuildOptions, Association } from "sequelize"
import { Db } from "./index"
import { User } from "./user"

export interface Topic extends Model {
  readonly id: number
  readonly active: boolean
  readonly content: TopicContent
  readonly acronym: string
  readonly secret_id: string

  readonly createdAt: string
  readonly updatedAt: string
}

export interface TopicContent {
  email?: string
  title?: string
  description?: string
  environment?: string
  customerName?: string
  additionalInfo?: string
  specialRequests?: string
}

export type TopicStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Topic;
  associate: (models: Required<Db>) => void
}

export default (sequelize: Sequelize, Sequelize: any) => {
  const Topic = <TopicStatic>sequelize.define('topic', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    content: {
      type: Sequelize.JSONB
    },
    acronym: {
      type: Sequelize.STRING
    },
    secret_id: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
  })

  return Topic
}
