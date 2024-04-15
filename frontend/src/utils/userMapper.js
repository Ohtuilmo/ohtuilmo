
import groupManagementService from '../services/groupManagement'
import userService from '../services/user'
import configurationService from '../services/configuration'

const mapSemesterField = (content) => {
  const patterns = [
    /kevät/i,
    /kesä/i,
    /syksy/i,
    /talvi/i,
    /spring/i,
    /summer/i,
    /autumn/i,
    /winter/i
  ]
  const yearPattern = /20\d\d/
  const replacements = [
    'Spring',
    'Summer',
    'Autumn',
    'Winter',
    'Spring',
    'Summer',
    'Autumn',
    'Winter'
  ]
  const parts = ['',0]
  for (let i = 0; i < patterns.length; i++) {
    if (content.match(patterns[i])) {
      parts[0] = replacements[i]
      break
    }
  }

  const matchedYear = content.match(yearPattern)
  parts[1] = matchedYear ? matchedYear[0] : ''

  return `${parts[1]} ${parts[0]}`
}

const mapInstructorField = (content, configurations) => {
  const activities = []
  content.forEach(element => {
    const semesterConfiguration = configurations.filter(conf => conf.id === element.configurationId)[0]
    const activity = {
      groupName: element.name,
      semester: mapSemesterField(semesterConfiguration.name),
      topic: element.topicId,
      instructor: element.instructorId,
      students: element.studentIds
    }
    activities.push(activity)
  })
  return activities
}

const mapParticipationField = (content, configurations) => {
  const participations = []
  content.forEach(element => {
    const semesterConfiguration = configurations.filter(conf => conf.id === element.configurationId)[0]
    const activity = {
      groupName: element.name,
      semester: mapSemesterField(semesterConfiguration.name),
      topic: element.topicId,
      instructor: element.instructorId,
      students: element.studentIds
    }
    participations.push(activity)
  })
  participations.sort((a, b) => a.semester.split(' ')[1] > b.semester.split(' ')[1])
  return participations
}

export const getMappedUsers = async () => {
  const users = await userService.get()
  const groups = await groupManagementService.get()
  const configurations = await configurationService.getAll()
  const mappedUsers = []
  users.forEach(user => {
    const participated = groups.filter(group => group.studentIds.includes(user.student_number))
    const instructor = groups.filter(group => group.instructorId === user.student_number)
    mappedUsers.push({
      admin: user.admin,
      email: user.email,
      first_names: user.first_names,
      instructor: mapInstructorField(instructor, configurations.configurations),
      last_name: user.last_name,
      student_number: user.student_number,
      username: user.username,
      participated: mapParticipationField(participated, configurations.configurations)
    })
  })
  mappedUsers.sort((a, b) => a.last_name.localeCompare(b.last_name))
  return mappedUsers
}