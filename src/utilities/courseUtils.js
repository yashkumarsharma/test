import {
  ADMINISTRATIVE_DROP,
  DROP,
  HALL_PASS,
  MELT,
  REFUND,
  TRANSFERRED,
} from '../constants'
import {
  changeTimezone,
  dateToSecondsSinceEpoch,
  diffDays,
} from './dateTimeUtils'

export function getCohortDuration (course) {
  // returns latest cohort duration from status data
  const latestCohort = getLatestCohort(course)
  if (latestCohort && latestCohort.duration) {
    return latestCohort.duration
  }

  if (!course.cohort) return
  const { duration } = course.cohort

  return duration
}

function getLatestCohort (course) {
  const { statusData, cohort } = course

  if (!statusData || !statusData.length) return cohort

  const assignedCohort = statusData.find(cohorts => cohorts.id === cohort.id)
  if (assignedCohort) {
    const { studentStatus, statusNote } = assignedCohort
    const hasAccessToTheCourse = !(
      [HALL_PASS, REFUND, TRANSFERRED].includes(statusNote) ||
      [MELT, DROP, ADMINISTRATIVE_DROP].includes(studentStatus)
    )
    if (hasAccessToTheCourse) return assignedCohort
  }

  const sortedCohorts = statusData.sort((a, b) => {
    return new Date(b.dateStart) - new Date(a.dateStart)
  })

  return sortedCohorts[0]
}

export function getCohortModifier (chapters, cohortDuration) {
  if (!chapters || !cohortDuration) return
  const exams = chapters.filter(elem => elem.type === 'exam')
  if (!exams.length) return
  const finalExam = exams[exams.length - 1]
  const { unlock_at_week: courseLength } = finalExam
  const cohortModifier = cohortDuration / courseLength
  return cohortModifier
}

export function getCohortSpecialDays (course) {
  const latestCohort = getLatestCohort(course)

  if (latestCohort) {
    const { specialDaysDates, dateStart } = latestCohort

    if (!specialDaysDates || !dateStart) return

    const cohortStartDate = dateToSecondsSinceEpoch(new Date(dateStart))
    const cohortSpecialDays = []
    specialDaysDates.forEach(({ dayStart, dayEnd }) => {
      const startDate = dateToSecondsSinceEpoch(new Date(dayStart))
      const endDate = dateToSecondsSinceEpoch(new Date(dayEnd))
      if (startDate < cohortStartDate) return
      const specialDays = diffDays(cohortStartDate, startDate)
      cohortSpecialDays.push({ startDate, endDate, specialDays })
    })
    return cohortSpecialDays
  }

  if (!course.cohort) return

  const { specialDaysDates, dateStart } = course.cohort
  if (!specialDaysDates || !dateStart) return

  const cohortStartDate = dateToSecondsSinceEpoch(new Date(dateStart))
  const cohortSpecialDays = []
  specialDaysDates.forEach(({ dayStart, dayEnd }) => {
    const startDate = dateToSecondsSinceEpoch(new Date(dayStart))
    const endDate = dateToSecondsSinceEpoch(new Date(dayEnd))
    if (startDate < cohortStartDate) return
    const specialDays = diffDays(cohortStartDate, startDate)
    cohortSpecialDays.push({ startDate, endDate, specialDays })
  })
  return cohortSpecialDays
}

export function getCohortStartSecondsSinceEpoch (course) {
  // returns latest cohort start date from status data
  const latestCohort = getLatestCohort(course)
  if (latestCohort && latestCohort.dateStart) {
    // Use the string date part and set the time to 00:00 AM UTC
    const latestCohortDate = new Date(latestCohort.dateStart + 'T00:00:00')

    // Convert date to PST time.
    const latestCohortDatePST = changeTimezone(
      latestCohortDate,
      'America/Los_Angeles',
    )

    return Math.floor(latestCohortDatePST.getTime() / 1000)
  }

  if (!course.cohort || !course.cohort.dateStart) return null

  // Use the string date part and set the time to 00:00 AM UTC
  const date = new Date(course.cohort.dateStart + 'T00:00:00')

  // Convert date to PST time.
  const datePST = changeTimezone(date, 'America/Los_Angeles')

  return Math.floor(datePST.getTime() / 1000)
}
