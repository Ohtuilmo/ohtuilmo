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
      className: 'create-topic-menu-item',
      text: 'Create Topic',
      handler: () => history.push('/topics/create')
    },
    {
      className: 'topics-menu-item',
      text: 'Topics',
      handler: () => history.push('/topics')
    },
    {
      className: 'configuration-menu-item',
      text: 'Configuration',
      handler: () => history.push('/administration/configuration')
    },
    {
      className: 'registration-management-menu-item',
      text: 'Registration Management',
      handler: () => history.push('/administration/registrationmanagement')
    },
    {
      className: 'group-management-menu-item',
      text: 'Group Management',
      handler: () => history.push('/administration/groups')
    },
    {
      className: 'email-templates-menu-item',
      text: 'Email Templates',
      handler: () => history.push('/administration/email-templates')
    },
    /*
    {
      className: 'registration-management-menu-item',
      text: 'Current regstrations',
      handler: () => history.push('/administration/registrations')
    },
    */
  ]
}


export { regularItems, loggedInItems, adminItems, instructorItems }


