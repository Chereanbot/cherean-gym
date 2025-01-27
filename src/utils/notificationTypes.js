export const NOTIFICATION_TYPES = {
  INFO: {
    label: 'Info',
    icon: 'FaInfo',
    color: 'blue'
  },
  SUCCESS: {
    label: 'Success',
    icon: 'FaCheck',
    color: 'green'
  },
  WARNING: {
    label: 'Warning',
    icon: 'FaExclamation',
    color: 'yellow'
  },
  ERROR: {
    label: 'Error',
    icon: 'FaTimes',
    color: 'red'
  }
}

export const NOTIFICATION_CATEGORIES = {
  ALL: {
    label: 'All',
    icon: 'FaBell'
  },
  SYSTEM: {
    label: 'System',
    icon: 'FaCog'
  },
  BLOG: {
    label: 'Blog',
    icon: 'FaNewspaper'
  },
  PROJECT: {
    label: 'Project',
    icon: 'FaFolder'
  },
  SERVICE: {
    label: 'Service',
    icon: 'FaCube'
  },
  AUTH: {
    label: 'Auth',
    icon: 'FaLock'
  }
}

export const getNotificationTypeDetails = (type) => {
  return NOTIFICATION_TYPES[type.toUpperCase()] || NOTIFICATION_TYPES.INFO
}

export const getNotificationCategoryDetails = (category) => {
  return NOTIFICATION_CATEGORIES[category.toUpperCase()] || NOTIFICATION_CATEGORIES.ALL
} 