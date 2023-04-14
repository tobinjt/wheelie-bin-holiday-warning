/* Overall plan:
 * - Query the holiday calendar for events in the next two weeks.
 * - For each event found:
 *   - Check if an event exists three days earlier (Monday, Sunday, Saturday,
 *     Friday - we need the event on Friday).
 *   - Create the event if missing.
 */
const holidayCalendarId: string =
  'en.irish#holiday@group.v.calendar.google.com'

console.log('holidayCalendarId: %s', holidayCalendarId)
