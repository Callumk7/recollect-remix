import { CalendarDate } from "@internationalized/date";

export function createCalendarDate(date: Date): CalendarDate {
	return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}
