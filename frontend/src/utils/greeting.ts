/**
 * @file utils/greeting.ts
 * @description Time-sensitive greeting utility.
 *
 * Generates a contextual greeting string based on the current hour of the day.
 * Used on the dashboard to welcome the logged-in user with an appropriate
 * time-of-day message.
 */

/**
 * Returns a time-appropriate greeting, optionally personalised with a name.
 *
 * Time ranges:
 *  - 05:00–11:59 → "Good Morning"
 *  - 12:00–16:59 → "Good Afternoon"
 *  - 17:00–04:59 → "Good Evening"
 *
 * @param name - Optional name to append to the greeting.
 * @returns A greeting string such as `"Good Morning, Karan"` or `"Good Evening"`.
 *
 * @example
 * getGreeting('Karan'); // "Good Morning, Karan" (if called before noon)
 * getGreeting();        // "Good Evening"
 */
export const getGreeting = (name?: string): string => {
  const currentHour = new Date().getHours();
  let greeting = 'Good Evening'; // Default for evening / late night

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon';
  }

  return name ? `${greeting}, ${name}` : greeting;
};
