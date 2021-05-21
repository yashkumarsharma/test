export default {
  getCourseImage,
  coursesIds: getCourseIds(),
}

function getCourseImage (courseId) {
  const courseName = courseIdToName(courseId)
  return {
    test: require('./assets/images/calculus.png'),
    calculus: require('./assets/images/calculus.png'),
    psychology: require('./assets/images/psychology.png'),
    'y.calculus': require('./assets/images/calculus.png'),
    statistics: require('./assets/images/statistics.png'),
    philosophy: require('./assets/images/philosophy.jpg'),
    microeconomics: require('./assets/images/microeconomics.jpg'),
    astronomy: require('./assets/images/astronomy.png'),
  }[courseName]
}

function getCourseIds() {
  return {
    test: 'test-course',
    calculus: 'b227c462-332c-40e0-8735-ea3af6f11661',
    psychology: '1e2f466d-049a-41e7-af53-74afbfa9d87b',
    'y.calculus': 'ea88ffd3-5c59-49d5-89b4-b9f009dde9ac',
    statistics: 'ckdampe3b00003g5m6l85b1s5',
    philosophy: 'ckgqsu5lf00003h5lzot6as6x',
    microeconomics: 'ckiawlgvw00003h5o8c6u6rog',
    astronomy: 'ckdf2158p00003g5milp6mvj8',
  }
}

function courseIdToName(id) {
  return invert(getCourseIds())[id]
}

function invert(obj) {
  const inverted = {}
  Object.keys(obj).forEach(function (k) {
    const v = obj[k]
    inverted[v] = k
  })
  return inverted
}
