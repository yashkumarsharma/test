export {
  secondsSinceEpoch,
  dateToSecondsSinceEpoch,
  secondsToFormattedDateShort,
  weeksToSeconds,
  daysToSeconds,
  changeTimezone,
  diffDays,
  addDaysToDate,
  calculateLockDate,
}
// Returns the current date/time in seconds.
// Does not need tests because that would require mocking Date.now and is not
// worth the effort since this method is already well known. Instead see:
// https://stackoverflow.com/questions/3830244/get-current-date-time-in-seconds
function secondsSinceEpoch () {
  return Math.floor(Date.now() / 1000)
}

// Given a date, it returns that date/time in seconds.
// Does not need tests because that would require mocking Date.now and is not
// worth the effort since this method is already well known. Instead see:
// https://stackoverflow.com/questions/3830244/get-current-date-time-in-seconds
function dateToSecondsSinceEpoch (date) {
  return Math.floor(date.getTime() / 1000)
}

// Extracted from an existing component. Might not be the perfect abstraction
// yet and clearly doesn't support locales other then 'en-us'. Putting all the
// date formatting in this module will help us eventually determine the best
// abstraction so this is a good first step.
function secondsToFormattedDateShort (seconds, dayType = '2-digit') {
  const convDate = new Date(seconds * 1000)
  return convDate.toLocaleString('en-us', { month: 'short', day: dayType })
}

/**
 * @param {number} dateInSeconds
 * @param {number} days
 * @returns {number} date of the next specified day if
 * old month is equal to new month
 * @returns {string} date of next specified day (e.g 'Jan 10') if
 * old month is not equal to new month or short param is set to true
 */
function addDaysToDate (dateInSeconds, days, short = false) {
  const newDate = new Date(dateInSeconds * 1000)
  const currentDateMonth = newDate.getMonth()
  newDate.setDate(newDate.getDate() + days)

  const newDateMonth = newDate.getMonth()
  const isAnotherMonth = currentDateMonth !== newDateMonth

  if (isAnotherMonth || short) {
    return newDate.toLocaleString('en-us', { month: 'short', day: 'numeric' })
  }

  return newDate.getDate()
}

function weeksToSeconds (weeks) {
  // Days, hours, minutes, seconds
  return parseFloat(weeks) * 7 * 24 * 60 * 60
}

function daysToSeconds (days) {
  return parseFloat(days) * 24 * 60 * 60
}

// Changes the underlying date object to a new time zone while preserving the
// date and the time. For example, if a UTC date of 2019-Sep-24 1am is
// given and the IANATimeZone is 'America/Los_Angeles', it will return a date
// object that is 2019-Sep-24 1am for Los Angeles.
function changeTimezone (date, IANATimezone) {
  // Create a new date in the requested timezone.
  const invdate = new Date(
    date.toLocaleString('en-US', {
      timeZone: IANATimezone,
    }),
  )

  // Get the difference between the given date and the new timezone.
  const diff = date.getTime() - invdate.getTime()

  // Calculate a new date adjusted using the difference.
  return new Date(date.getTime() + diff)
}

// Returns the difference in days between two dates
function diffDays (startDate, endDate) {
  const date1 = new Date(startDate * 1000)
  const date2 = new Date(endDate * 1000)
  let diff = (date1.getTime() - date2.getTime()) / 1000
  diff /= 60 * 60 * 24
  return Math.abs(Math.round(diff))
}

function calculateLockDate (unlockAfterDays, unlockDuration, cohortStartDate) {
  const unlockDatePST = calculateUnlockDate(unlockAfterDays, cohortStartDate)

  // Lock duration of zero means never unlock, so we make the unlock and lock
  // dates the same.
  if (unlockDuration === 0) return unlockDatePST

  // Calculate the relative lock date
  const seconds = weeksToSeconds(unlockDuration)
  unlockDatePST.setTime(unlockDatePST.getTime() + seconds * 1000)

  // Convert date to UTC with time set to 12pm
  const lockDateUTC = new Date(
    unlockDatePST.getUTCFullYear(),
    unlockDatePST.getUTCMonth(),
    unlockDatePST.getUTCDate(),
    12,
    0,
  )

  // Subtract 1 minute so we land on 11:59am
  lockDateUTC.setTime(lockDateUTC.getTime() - 60 * 1000)

  // Convert UTC back to PST
  const lockDatePST = changeTimezone(lockDateUTC, 'America/Los_Angeles')

  return lockDatePST
}

function calculateUnlockDate (unlockAfterDays, cohortStartDate) {
  // Sets the time to 1:01am to account for daylight savings. Without doing
  // this when we calculate the number of weeks it might end up landing
  // at 11am. This ensures that if we lose an hour due to daylight
  // savings it will be the same date, but at 12:01pm.
  const date = new Date(cohortStartDate)
  date.setUTCHours(1, 1)

  // Convert date to PST time.
  const datePST = changeTimezone(date, 'America/Los_Angeles')

  // Calculate the relative unlock date
  const seconds = daysToSeconds(unlockAfterDays)
  datePST.setTime(datePST.getTime() + seconds * 1000)

  // Convert date to UTC with time set to 09:00am
  const unlockDateUTC = new Date(
    datePST.getUTCFullYear(),
    datePST.getUTCMonth(),
    datePST.getUTCDate(),
    9,
    0,
  )

  // Convert UTC back to PST
  const unlockDatePST = changeTimezone(unlockDateUTC, 'America/Los_Angeles')

  return unlockDatePST
}
