// Helper for mapping grid column numbers to Tailwind width classes
// Includes responsive variants (full width on small screens)
// https://tailwindcss.com/docs/width

export default function getGridWidthClass(gridCol) {
  const widthClasses = {
    1: 'w-full md:w-1/24',
    2: 'w-full md:w-2/24',
    3: 'w-full md:w-3/24',
    4: 'w-full md:w-4/24',
    5: 'w-full md:w-5/24',
    6: 'w-full md:w-6/24',
    7: 'w-full md:w-7/24',
    8: 'w-full md:w-8/24',
    9: 'w-full md:w-9/24',
    10: 'w-full md:w-10/24',
    11: 'w-full md:w-11/24',
    12: 'w-full md:w-12/24',
    13: 'w-full md:w-13/24',
    14: 'w-full md:w-14/24',
    15: 'w-full md:w-15/24',
    16: 'w-full md:w-16/24',
    17: 'w-full md:w-17/24',
    18: 'w-full md:w-18/24',
    19: 'w-full md:w-19/24',
    20: 'w-full md:w-20/24',
    21: 'w-full md:w-21/24',
    22: 'w-full md:w-22/24',
    23: 'w-full md:w-23/24',
    24: 'w-full md:w-24/24',
  };

  return widthClasses[gridCol] || 'w-full';
}
