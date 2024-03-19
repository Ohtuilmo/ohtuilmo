const regularItems = (history) => {
  return [
    {
      text: 'Log In',
      handler: () => history.push('/login'),
    },
  ]
}

const loggedInItems = (history) => {
  return [
    {
      text: 'Home',
      handler: () => history.push('/'),
    },
    {
      text: 'Register',
      handler: () => history.push('/register'),
    },
    {
      text: 'Registration Details',
      handler: () => history.push('/registrationdetails'),
    },
    {
      text: 'Peer Review',
      handler: () => history.push('/peerreview'),
    },
    {
      text: 'Time Logs',
      handler: () => history.push('/timelogs'),
    },
    // TODO: uncomment this in the Sprint Management PR.
    {
      text: 'Sprint Dashboard',
      handler: () => history.push('/sprints'),
    },
  ]
}

const instructorItems = (history) => {
  return [
    {
      text: 'Home',
      handler: () => history.push('/'),
    },
    {
      text: 'Intructor Page',
      handler: () => history.push('/instructorpage'),
    },
    {
      text: 'Instructor Review',
      handler: () => history.push('/instructorreviewpage'),
    },
    {
      text: 'Customer reviews',
      handler: () => history.push('/adminstration/customer-reviews'),
    },
  ]
}

const adminItems = (history) => {
  return [
    {
      className: 'create-topic-menu-item',
      text: 'Create Topic',
      handler: () => history.push('/topics/create'),
    },
    {
      className: 'topics-menu-item',
      text: 'Topics',
      handler: () => history.push('/topics'),
    },
    {
      text: 'Reviews',
      handler: () => history.push('/administration/reviews'),
    },
    {
      className: 'configuration-menu-item',
      text: 'Configuration',
      handler: () => history.push('/administration/configuration'),
    },
    {
      className: 'registration-management-menu-item',
      text: 'Registration Management',
      handler: () => history.push('/administration/registrationmanagement'),
    },
    {
      className: 'customer-review-menu-item',
      text: 'Current registrations',
      handler: () => history.push('/administration/registrations'),
    },
    {
      className: 'group-management-menu-item',
      text: 'Group Management',
      handler: () => history.push('/administration/groups'),
    },
    {
      text: 'Participants',
      handler: () => history.push('/administration/participants'),
    },
    {
      text: 'Users',
      handler: () => history.push('/administration/users')
    },
    {
      text: 'Registration Questions',
      handler: () => history.push('/administration/registration-questions'),
    },
    {
      text: 'Customer Review Questions',
      handler: () => history.push('/administration/customer-review-questions'),
    },
    {
      text: 'Peer Review Questions',
      handler: () => history.push('/administration/peer-review-questions'),
    },
    {
      className: 'email-templates-menu-item',
      text: 'Email Templates',
      handler: () => history.push('/administration/email-templates'),
    },
    {
      className: 'tags-menu-item',
      text: 'Tag management',
      handler: () => history.push('/administration/tags'),
    },
  ]
}

export { regularItems, loggedInItems, adminItems, instructorItems }
