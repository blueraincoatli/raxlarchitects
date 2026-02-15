export const projectsDisplayConfig = {
  mode: 'single',
  maxImagesPerProject: 3,
  enforceNoConsecutiveSameProject: true,
};

// Higher number means higher visual priority on Projects listing.
export const projectPriorityMap = {
  'one-park-gubei': 100,
  'royal-pavilion': 96,
  'upper-east': 92,
  'rongxinarc': 90,
  'prime-dynapolis': 88,
  'moment-to-cloud': 84,
  'lot-hk231': 82,
  'macalline-anji': 80,
  chairclub: 78,
  'content-office-shop': 76,
  'content-show': 74,
};

// Optional per-category priority overrides for Projects filtering pages.
export const categoryPriorityOverrides = {
  architecture: {
    'one-park-gubei': 220,
    'prime-dynapolis': 215,
    'macalline-anji': 205,
  },
};
