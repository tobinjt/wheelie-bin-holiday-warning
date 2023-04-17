/* Overall plan:
 * - Query my calendar for events in the next 30 days and previous 4 days;
 *   record the titles so I can check if the reminder event exists.
 * - Query the holiday calendar for events in the next thirty days.
 * - For each holiday event found:
 *   - Check if a reminder event exists and if missing, create it three days
 *     earlier (Monday, Sunday, Saturday, Friday - we need the event on Friday).
 */

/* Running this for the first time produces scary warnings because it hasn't
 * been approved by Google.  The approval process is documented in
 * https://developers.google.com/apps-script/guides/client-verification
 * and frankly it's far too much work for me so I'm not doing it.
 */

const holidayCalendarId: string =
  'en.irish#holiday@group.v.calendar.google.com'
const daysToCheckAhead: number = 30
const reminderTitlePrefix: string = 'Do wheelie bins need to go out tonight?'

/*
 * addHoursToDate: adds hours (which can be negative) to date and returns a new
 * date.
 */
function addHoursToDate (date: Date, hours: number): Date {
  const millisecondsPerHour: number = 1000 * 60 * 60
  const result = new Date()
  result.setTime(date.getTime() + (hours * millisecondsPerHour))
  return result
}

/*
 * addDaysToDate: adds days (which can be negative) to date and returns a new
 * date.
 */
function addDaysToDate (date: Date, days: number): Date {
  return addHoursToDate(date, days * 24)
}

/*
 * main: implement the Overall plan.
 */
function main (): void {
  const holidayStartDate = new Date()
  const endDate = addDaysToDate(holidayStartDate, daysToCheckAhead)
  console.log('holiday calendar ID: "%s", startDate: "%s", endDate: "%s"',
    holidayCalendarId, holidayStartDate.toUTCString(), endDate.toUTCString())

  const myStartDate = addDaysToDate(holidayStartDate, -4)
  const myCalendar = CalendarApp.getDefaultCalendar()
  const myEvents = myCalendar.getEvents(myStartDate, endDate)
  const myTitles: string[] = myEvents.map(event => event.getTitle())
  console.log('myTitles: %s', myTitles)

  const holidayCalendar = CalendarApp.getCalendarById(holidayCalendarId)
  const holidayEvents = holidayCalendar.getEvents(holidayStartDate, endDate)
  for (const event of holidayEvents) {
    console.log('holiday event: "%s"', event.getTitle())
    if (event.getStartTime().getUTCDay() !== 0) {
      console.log('skipping holiday that is not on a Monday: "%s"',
        event.getTitle())
      continue
    }

    const newEventTitle = reminderTitlePrefix + ' ' + event.getTitle()
    if (myTitles.includes(newEventTitle)) {
      console.log('event "%s" already exists', newEventTitle)
      continue
    }

    console.log('need to create event "%s"', newEventTitle)
    const holidayDate = new Date(event.getAllDayStartDate().toString())
    let eventStart = addDaysToDate(holidayDate, -3)
    eventStart = addHoursToDate(eventStart, 17)
    const eventEnd = addHoursToDate(eventStart, 6)
    console.log('creating event: start: "%s", end: "%s", title: "%s"',
      eventStart, eventEnd, newEventTitle)
    const newEvent = CalendarApp.getDefaultCalendar().createEvent(
      newEventTitle, eventStart, eventEnd)
    console.log('created event: "%s"', newEvent.getTitle())
  }
}

// None of the documented ways of disabling warnings actually work, so work
// around that by referencing main() in a way that won't call it.
if (holidayCalendarId.length === 0) {
  main()
}
