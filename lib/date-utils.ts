export function calculateNextDueDate(
  startDate: Date,
  frequencyDays: number,
  timeOfDay: string,
  allowPastDates: boolean = false
): Date {
  const [hours, minutes] = timeOfDay.split(":").map(Number);
  const nextDue = new Date(startDate);
  nextDue.setHours(hours, minutes, 0, 0);

  // If allowPastDates is true, return the date as-is (for testing)
  if (allowPastDates) {
    return nextDue;
  }

  // If the start date with time is in the past, calculate the next occurrence
  const now = new Date();
  if (nextDue < now) {
    const daysPassed = Math.floor((now.getTime() - nextDue.getTime()) / (1000 * 60 * 60 * 24));
    const cyclesPassed = Math.ceil(daysPassed / frequencyDays);
    nextDue.setDate(nextDue.getDate() + cyclesPassed * frequencyDays);
  }

  return nextDue;
}

export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
