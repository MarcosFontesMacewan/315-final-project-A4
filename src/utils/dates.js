// Dates are plain 'YYYY-MM-DD' strings.
// Math is done in UTC so time zones and daylight saving cannot move a day.
const MS_PER_DAY = 24*60*60*1000 // this is in milliseconds, since 1 day = 24h, 1h = 60min, 1min = 60 sec, 1 sec = 1000 millisec

//  Convert the string 'YYYY-MM-DD' into number
function toUtcMs(dateString) {
  const [y, m, d] = dateString.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

//  Turn the converted number back to the string 'YYYY-MM-DD'
function toDateString(ms) {
  return new Date(ms).toISOString().slice(0, 10)
}

//  Use to add days
export function addDays(dateString, days) {
  return toDateString(toUtcMs(dateString) + days * MS_PER_DAY)
}

//  Returns positive value if "toString" is later than "fromString"
export function daysBetween(fromString, toString) {
  return Math.round((toUtcMs(toString) - toUtcMs(fromString)) / MS_PER_DAY)
}

// Returns today's date in the user's own time zone
export function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// used by mock data so there is always an overdue loan
export function daysFromToday(n) {
  return addDays(todayString(), n)
}

function pad(n) {
    return n < 10 ? '0' + n : String(n);
}