import { getMappedUsers } from '../../utils/userMapper'

const testUsers = [
  {
    first_names: 'Tester',
    last_name: 'Testman',
    username: 'testerman',
    student_number: '123456',
    email: 'tester.testman@helsinki.fi',
    admin: false,
    participated: [
      {
        semester: 'K23',
        groupName: 'testiryhmä23K',
        topic: 11,
        instructor: '22',
        students: ['123456', '123345'],
      },
    ],
    instructor: [
      {
        semester: 'S23',
        groupName: 'testiryhmä23S',
        topic: 12,
        instructor: '123456',
        students: ['223344', '334455'],
      },
      {
        semester: 'K24',
        groupName: 'testiryhmä24K',
        topic: 'testTopic13',
        instructor: '123456',
        students: ['235362', '134253'],
      },
    ],
  },
  {
    first_names: 'Hastur',
    last_name: 'Hastur',
    username: 'hashastur',
    student_number: '615243',
    email: 'hastur.hastur@helsinki.fi',
    admin: false,
    participated: [
      {
        semester: 'S10',
        groupName: 'YyberTiimÄsKymmenen',
        topic: 5,
        instructor: '918273645',
        students: ['615243', '701928'],
      },
    ],
    instructor: [],
  },
  {
    first_names: 'Matti',
    last_name: 'Luukkainen',
    username: 'matluukka',
    student_number: '918273645',
    email: 'ihanoikea.luukkainen@helsinki.fi',
    admin: true,
    participated: [],
    instructor: [
      {
        semester: 'S10',
        groupName: 'YyberTiimÄsKymmenen',
        topic: 5,
        instructor: '918273645',
        students: ['615243', '701928'],
      },
    ],
  },
]

export const setUsers = () => {
  return async (dispatch) => {
    const users = await getMappedUsers()
    dispatch({
      type: 'SET_USERS',
      payload: users,
    })
  }
}

export const resetUsers = () => {
  return {
    type: 'RESET_USERS',
  }
}

export const setTestUsers = () => {
  return {
    type: 'SET_TEST_USERS',
    payload: testUsers,
  }
}
