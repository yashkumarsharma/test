import {
  calculateLockDate,
  changeTimezone,
  dateToSecondsSinceEpoch,
  daysToSeconds,
  diffDays,
} from './dateTimeUtils'

export function getChapterLockDates ({ chapter, cohortData }) {
  let unlockDate = null
  let lockDate = null

  if (!chapter) {
    return {
      unlockDate,
      lockDate,
    }
  }

  const { cohortStartDate, cohortModifier, cohortSpecialDays } = cohortData

  if (
    chapter &&
    Object.prototype.hasOwnProperty.call(chapter, 'unlock_at_week') &&
    Object.prototype.hasOwnProperty.call(chapter, 'unlock_duration')
  ) {
    // Use the new relative dates if they are available. Otherwise, use the
    // old style fixed dates.
    let {
      unlock_at_week: unlockAtWeek,
      unlock_duration: unlockDuration,
    } = chapter
    if (cohortModifier) {
      unlockAtWeek = cohortModifier * unlockAtWeek
      if (unlockDuration > 0) unlockDuration = cohortModifier * unlockDuration
    }
    let unlockAfterDays = (unlockAtWeek - 1) * 7
    if (cohortSpecialDays && cohortSpecialDays.length) {
      cohortSpecialDays.forEach(({ startDate, endDate, specialDays }) => {
        if (specialDays && unlockAfterDays >= specialDays) {
          unlockAfterDays = unlockAfterDays + diffDays(startDate, endDate)
        }
      })
    }
    unlockDate = dateToSecondsSinceEpoch(
      calculateUnlockDate(unlockAfterDays, cohortStartDate * 1000),
    )
    // Unlock duration of -1 means it never re-locks and stays unlocked forever.
    if (unlockDuration === -1) {
      lockDate = null
    } else {
      lockDate = dateToSecondsSinceEpoch(
        calculateLockDate(
          unlockAfterDays,
          unlockDuration,
          cohortStartDate * 1000,
        ),
      )
    }
  }

  return {
    unlockDate,
    lockDate,
  }
}

function calculateUnlockDate (unlockAfterDays, cohortStartDate) {
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
