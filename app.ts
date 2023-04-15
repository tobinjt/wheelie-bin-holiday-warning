/* Overall plan:
 * - Query the holiday calendar for events in the next thirty days.
 * - For each event found:
 *   - Check if an event exists three days earlier (Monday, Sunday, Saturday,
 *     Friday - we need the event on Friday).
 *   - Create the event if missing.
 */
const holidayCalendarId: string =
  'en.irish#holiday@group.v.calendar.google.com'
const daysToCheckAhead: number = 30
const millisecondsPerDay: number = 1000 * 60 * 60 * 24

function main (): void {
  console.log('holidayCalendarId: %s', holidayCalendarId)
  const startDate = new Date()
  const endDate = new Date()
  endDate.setTime(endDate.getTime() + (daysToCheckAhead * millisecondsPerDay))
  console.log('startDate: %s, endDate: %s',
    startDate.toUTCString(), endDate.toUTCString())

  const calendar = CalendarApp.getCalendarById(holidayCalendarId)
  const holidayEvents = calendar.getEvents(startDate, endDate)
  for (const event of holidayEvents) {
    console.log('found event: %s', event.getTitle())
  }
}

// None of the documented ways of disabling warnings actually work, so work
// around that by referencing main() in a way that won't call it.
if (holidayCalendarId.length === 0) {
  main()
}
