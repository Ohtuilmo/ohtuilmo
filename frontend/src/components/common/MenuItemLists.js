const regularItems = (history) => {
  return [
    {
      text: 'Log In',
      handler: () => history.push('/login')
    }
  ]
}

const loggedInItems = (history) => {
  return [
    {
      text: 'Home',
      handler: () => history.push('/')
    },
    {
      text: 'Register',
      handler: () => history.push('/register')
    },
    {
      text: 'Peer Review',
      handler: () => history.push('/peerreview')
    }
  ]
}

const instructorItems = (history) => {
  return [
    {
      text: 'Home',
      handler: () => history.push('/')
    },
    {
      text: 'Intructor Page',
      handler: () => history.push('/instructorpage')
    },
    {
      text: 'Instructor Review',
      handler: () => history.push('/instructorreviewpage')
    },
    {
      text: 'Customer reviews',
      handler: () => history.push('/adminstration/customer-reviews')
    }
  ]
}

const adminItems = (history) => {
  return [
    {
      text: 'Create Topic',
      handler: () => history.push('/topics/create')
    },
    {
      text: 'Topics',
      handler: () => history.push('/topics')
    },
    {
      text: 'Reviews',
      handler: () => history.push('/administration/reviews')
    },
    {
      text: 'Configuration',
      handler: () => history.push('/administration/configuration')
    },
    {
      text: 'Registration Management',
      handler: () => history.push('/administration/registrationmanagement')
    },
    {
      text: 'Current regstrations',
      handler: () => history.push('/administration/registrations')
    },
    {
      text: 'Registration Details',
      handler: () => history.push('/administration/registrationdetails')
    },
    {
      text: 'Group Management',
      handler: () => history.push('/administration/groups')
    },
    {
      text: 'Participants',
      handler: () => history.push('/administration/participants')
    },
    {
      text: 'Registration Questions',
      handler: () => history.push('/administration/registration-questions')
    },
    {
      text: 'Customer Review Questions',
      handler: () => history.push('/administration/customer-review-questions')
    },
    {
      text: 'Peer Review Questions',
      handler: () => history.push('/administration/peer-review-questions')
    },
    {
      text: 'Email Templates',
      handler: () => history.push('/administration/email-templates')
    },
  ]
}


export { regularItems, loggedInItems, adminItems, instructorItems }


