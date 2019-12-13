/*
 * Marketplace specific configuration.
 */

export const amenities = [
  {
    key: 'towels',
    label: 'Towels',
  },
  {
    key: 'bathroom',
    label: 'Bathroom',
  },
  {
    key: 'swimming_pool',
    label: 'Swimming pool',
  },
  {
    key: 'own_drinks',
    label: 'Own drinks allowed',
  },
  {
    key: 'jacuzzi',
    label: 'Jacuzzi',
  },
  {
    key: 'audiovisual_entertainment',
    label: 'Audiovisual entertainment',
  },
  {
    key: 'barbeque',
    label: 'Barbeque',
  },
  {
    key: 'own_food_allowed',
    label: 'Own food allowed',
  },
];

export const categories = [
  { key: 'smoke', label: 'Smoke' },
  { key: 'electric', label: 'Electric' },
  { key: 'wood', label: 'Wood' },
  { key: 'other', label: 'Other' },
];

export const subCategories = [
  {
    key: 'smoke',
    label: 'Smoke',
  },
  {
    key: 'electric',
    label: 'Electric',
  },
  {
    key: 'wood',
    label: 'Wood',
  },
  {
    key: 'gold',
    label: 'Gold',
  },
  {
    key: 'other',
    label: 'Other',
  },
]

// Price filter configuration
// Note: unlike most prices this is not handled in subunits
export const priceFilterConfig = {
  min: 0,
  max: 1000,
  step: 5,
};

// Activate booking dates filter on search page
export const dateRangeFilterConfig = {
  active: true,
};

//filter people
export const numOfPeopleFilterConfig = {
  min: 1,
  max: 50,
  step: 1,
}

// Activate keyword filter on search page

// NOTE: If you are ordering search results by distance the keyword search can't be used at the same time.
// You can turn off ordering by distance in config.js file
export const keywordFilterConfig = {
  active: true,
};

export const numberOfPeople = [
  { key: 'oneToThree', label: '1 to 3' },
  { key: 'fourToSix', label: '4 to 6' },
  { key: 'sevenToNight', label: '7 to 9' },
  { key: '10plus', label: '10 plus' },
];

export const animals = [
  {
    key: 'dog',
    label: 'Dog',
  },
  {
    key: 'cat',
    label: 'Cat',
  },
  {
    key: 'elephant',
    label: 'Elephant',
  },
  {
    key: 'fish',
    label: 'Fish',
  },
  {
    key: 'bird',
    label: 'Bird',
  },
];
