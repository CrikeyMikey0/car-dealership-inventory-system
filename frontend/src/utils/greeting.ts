export const getGreeting = (name?: string): string => {
  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon';
  }

  return name ? `${greeting}, ${name}` : greeting;
};
