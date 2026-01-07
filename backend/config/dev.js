const test_users = {
  student: {
    employeenumber: '',
    mail: '',
    hypersonstudentid: '112345701',
    uid: 'johnsmith',
    givenname: 'John',
    sn: 'Smith',
  },
  instructor: {
    employeenumber: '',
    mail: '',
    hypersonstudentid: '112345699',
    uid: 'olliohj',
    givenname: 'Olli',
    sn: 'Ohjaaja',
  },
  admin: {
    employeenumber: '',
    mail: '',
    hypersonstudentid: '011120775',
    uid: 'mluukkai',
    givenname: 'Matti',
    sn: 'Luukkainen',
  },
}

// Used in fake_shibbo middleware
//
// NOTE: This has to be an object because by default
// js imports are copies of the values but objects
// are passed by reference (like pointers in c/cpp)
let test_user = { test_user: test_users.student }

module.exports = {
  test_user,
  test_users
}
