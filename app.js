'use strict';

const STORAGE_KEY = 'travelpack_v3';
const LEGACY_STORAGE_KEY = 'travelpack_v2';

const DEFAULT_STATE = {
  destinations: [],
  adults: 2,
  children: 0,
  pets: 0,
  petTypes: [],
  options: [],
  duration: 7,
  checked: [],
  custom: [],
  currentFilter: 'all',
  essentialsOnly: false,
  query: '',
  currentStep: 1,
  collapsed: []
};

const state = {
  ...DEFAULT_STATE,
  checked: new Set(),
  custom: [],
  collapsed: new Set()
};

const ICONS = {
  plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 14.5L20.8 9.2L14.5 6.5L12.5 2.5L10.8 6.5L4.8 9.2L2 14.5ZM8 17.5L9.2 13.9L12.5 14.9L16.5 16.3L18.4 20L14 19.2L11.3 17.5H8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  beach: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17c2.5-3 5.4-4.5 8.7-4.5 3.1 0 5.6 1.2 8.3 3.5M6.4 5.5c1 1.5 2.6 2.5 4.6 2.9M3 13.8c2.2 1 4.4 1.7 6.6 2.1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.1 7.2c1.9 1.7 3.2 3.7 4 6.1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  mountain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18.2L9.5 6.6l3.2 5.3 3.5-6.4 5.8 12.7H3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  hiking: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5L9.5 10l2.4 3.4 3.5-6.7 3.6 11.8M9 5.2l1.4 2.4M14.6 7.2h3.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  camping: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5 12 6l8 12.5M7 18.5h10M8.2 9.5h7.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  city: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V7.5h6V5h5.5v2.5H20V19M6.5 10h2.8M6.5 13h2.8M13.5 10h2.8M13.5 13h2.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 12h16M12 4c2.8 2.5 4.2 5.5 4.2 8s-1.4 5.5-4.2 8c-2.8-2.5-4.2-5.5-4.2-8s1.4-5.5 4.2-8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ski: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5l4.8-7.7 4.8 2.6 5.4-6.5M8 18.5h10.2M9.3 12l-2.4-4.1M14.9 12.5l3.2-4.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  safari: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18.5 18 6m-8.3 6.2L18 5.8M8.8 18.2A4.8 4.8 0 0 1 15.2 11.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15.5" cy="8.5" r="2.7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  park: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5h14M7.5 18.5V9l4.5-3 4.5 3v9.5M9 12.5h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cruise: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16.8h18l-2.5 2.6H5.5L3 16.8Zm2.5-9.3h11.5l2 4.3H3.5l2-4.3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.8h8M9 12h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14.5 7 8.8h10l2 5.7M6 14.5h12M8.4 17.2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7.1 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V6.8A1.8 1.8 0 0 1 8.8 5h6.4A1.8 1.8 0 0 1 17 6.8V8M5 8.3h14v9.2A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5V8.3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  backpack: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.5V5.8A3.8 3.8 0 0 1 12.3 2h.4a3.8 3.8 0 0 1 3.8 3.8v.7M7 8.3h10l1 9.2a2 2 0 0 1-1.9 2.1H7.9a2 2 0 0 1-1.9-2.1l1-9.2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  castle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.8h16M6 18.8V9h2.8V6.2h2.7V9h2.8V6.2h2.8V9H18v9.8M8.5 12.2h1.9M13.6 12.2h1.9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  document: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4.5 4.5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Zm7 1.4v4.2h4.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 12.5h7M8.5 15.5h7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9V7.7A4 4 0 0 1 12 4a4 4 0 0 1 4 3.7V9M6 9h12l-1.1 9.4A2 2 0 0 1 14.9 20H9.1a2 2 0 0 1-2-1.6L6 9Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shirt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.5 9 6h6l3 2.5L18 18H6l0-9.5Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 6l1.5 3h3L15 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 13.8 7l4.3 1.8-4.3 1.8L12 15.3l-1.8-4.7-4.3-1.8 4.3-1.8L12 2.7Zm5.5 11.2 1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.1-3.2-3.2-1.2 3.2-1.2 1.1-3.2Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  device: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="3.5" width="11" height="17" rx="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 17.5h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 18.5h19L19 20H5l-2.5-1.5Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5v4.2m8-4.2v4.2M7 8.8h10v2.4a4.5 4.5 0 0 1-1.4 3.3l-1.1 1v2.3h-4.8v-2.3l-1.1-1A4.5 4.5 0 0 1 7 11.2V8.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  food: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 7.5V4.9a1.4 1.4 0 0 1 1.4-1.4h1.1A1.4 1.4 0 0 1 10.4 4.9V7.5M6.6 8.5h7.6a2 2 0 0 1 2 2V16a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2v-5.5a2 2 0 0 1 2-2ZM5 11.5h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.9 2.5 5.1 5.7.9-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.9L12 2.9Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  kid: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 17.3c.7-2.4 2.9-4 6-4s5.3 1.6 6 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16.5 5.5h3.5v3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  baby: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10.5a4 4 0 1 1 8 0v1.8a4 4 0 0 1-8 0v-1.8Zm2.5 4.5h3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 18.5c0-2.2 2.3-4 5-4s5 1.8 5 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  paw: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="1.6" fill="currentColor"/><circle cx="14.5" cy="7.3" r="1.5" fill="currentColor"/><circle cx="17.5" cy="12.5" r="1.5" fill="currentColor"/><circle cx="9.5" cy="13.7" r="1.6" fill="currentColor"/><path d="M6.3 17.3c1.3 1.9 3.7 3 5.7 3s4.4-1.1 5.7-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  snow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v17M4.3 8l15.4 8M19.7 8 4.3 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 2.8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function icon(name) {
  const svg = ICONS[name] || ICONS.star;
  return `<span class="icon-surface">${svg}</span>`;
}

function getKnownIds() {
  const ids = new Set();
  Object.values(DATA.common || {}).forEach(function (items) {
    (items || []).forEach(function (item) {
      if (item && item.id) ids.add(item.id);
    });
  });
  Object.values(DATA.destinations || {}).forEach(function (dest) {
    Object.values(dest || {}).forEach(function (items) {
      (items || []).forEach(function (item) {
        if (item && item.id) ids.add(item.id);
      });
    });
  });
  Object.values(DATA.options || {}).forEach(function (optionSet) {
    Object.values(optionSet || {}).forEach(function (items) {
      (items || []).forEach(function (item) {
        if (item && item.id) ids.add(item.id);
      });
    });
  });
  (DATA.kids || []).forEach(function (item) {
    if (item && item.id) ids.add(item.id);
  });
  Object.values(DATA.pets || {}).forEach(function (items) {
    if (Array.isArray(items)) {
      items.forEach(function (item) {
        if (item && item.id) ids.add(item.id);
      });
    }
  });
  return ids;
}

function getAllChecklistItems() {
  const list = [];
  CATEGORY_ORDER.forEach(function (key) {
    list.push(...itemsForCategory(key));
  });
  state.custom.forEach(function (entry) {
    list.push({ id: entry.id, name: entry.name, essential: false, custom: true, cat: entry.cat });
  });
  return list.filter(function (item, index, array) {
    return array.findIndex(function (current) {
      return current.id === item.id;
    }) === index;
  });
}

function itemsForCategory(key) {
  const items = [];
  const addItems = function (list) {
    (list || []).forEach(function (item) {
      if (item && item.id) {
        items.push(item);
      }
    });
  };

  addItems(DATA.common[key]);

  state.destinations.forEach(function (destinationId) {
    const destinationData = DATA.destinations[destinationId];
    addItems(destinationData && destinationData[key]);
  });

  state.options.forEach(function (optionId) {
    const optionData = DATA.options[optionId];
    addItems(optionData && optionData[key]);
  });

  if (key === 'kids' && state.children > 0) {
    addItems(DATA.kids);
  }

  if (key === 'pets' && state.pets > 0) {
    addItems(DATA.pets.common);
    state.petTypes.forEach(function (petType) {
      addItems(DATA.pets[petType]);
    });
  }

  return items.filter(function (item, index, array) {
    return array.findIndex(function (current) {
      return current.id === item.id;
    }) === index;
  });
}

function getChecklistCategories() {
  const categories = [];
  CATEGORY_ORDER.forEach(function (key) {
    const items = itemsForCategory(key);
    if (items.length) {
      categories.push({ key: key, name: CATEGORIES[key].name, items: items.slice() });
    }
  });

  state.custom.forEach(function (customItem) {
    const catKey = CATEGORY_ORDER.indexOf(customItem.cat) > -1 ? customItem.cat : 'general';
    const category = categories.find(function (entry) {
      return entry.key === catKey;
    });
    if (category) {
      category.items.push({ id: customItem.id, name: customItem.name, essential: false, custom: true, cat: catKey });
    } else {
      categories.push({ key: 'general', name: CATEGORIES.general.name, items: [{ id: customItem.id, name: customItem.name, essential: false, custom: true, cat: 'general' }] });
    }
  });

  categories.forEach(function (category) {
    category.items = category.items.filter(function (item, index, array) {
      return array.findIndex(function (current) {
        return current.id === item.id;
      }) === index;
    });
  });

  return categories;
}

function getDisplayNameById(list, id, fallback) {
  const match = (list || []).find(function (entry) {
    return entry.id === id;
  });
  return match ? match.name : fallback;
}

function getItemQuantity(itemId) {
  if (!QTY_HINTS[itemId]) return null;
  const rule = QTY_HINTS[itemId];
  return rule(state.duration);
}

function getProgressStatus(percent) {
  if (percent >= 100) return 'All packed. Have a great trip.';
  if (percent > 75) return 'Almost done';
  if (percent > 50) return 'More than halfway';
  if (percent > 25) return 'Good progress';
  if (percent > 0) return 'Just getting started';
  return 'Ready to start packing';
}

function getTripSummaryParts() {
  const parts = [];
  const destinationNames = state.destinations.map(function (destId) {
    const destination = DESTINATIONS.find(function (entry) {
      return entry.id === destId;
    });
    return destination ? destination.name : destId;
  });
  if (destinationNames.length) {
    parts.push(destinationNames.join(', '));
  }

  const travelerText = [];
  if (state.adults) travelerText.push(state.adults + ' adult' + (state.adults > 1 ? 's' : ''));
  if (state.children) travelerText.push(state.children + ' child' + (state.children > 1 ? 'ren' : ''));
  if (travelerText.length) {
    parts.push(travelerText.join(', '));
  }

  if (state.pets > 0) {
    const petNames = state.petTypes.map(function (petId) {
      const match = PET_TYPES.find(function (entry) {
        return entry.id === petId;
      });
      return match ? match.name : petId;
    });
    parts.push(state.pets + ' pet' + (state.pets > 1 ? 's' : '') + ' (' + petNames.join(', ') + ')');
  }

  parts.push(state.duration + ' day' + (state.duration > 1 ? 's' : ''));

  state.options.forEach(function (optionId) {
    const option = OPTIONS.find(function (entry) {
      return entry.id === optionId;
    });
    if (option) {
      parts.push(option.name);
    }
  });

  return parts;
}

function renderDestinationSummary() {
  const destinationSummary = document.getElementById('destination-summary');
  if (!destinationSummary) return;
  const count = state.destinations.length;
  destinationSummary.textContent = count + ' selected';
}

function renderDestinationCards() {
  const root = document.getElementById('destination-grid');
  if (!root) return;

  root.innerHTML = DESTINATIONS.map(function (destination) {
    const selected = state.destinations.includes(destination.id);
    return '<button class="destination-card ' + (selected ? 'selected' : '') + '" type="button" data-action="toggle-destination" data-destination-id="' + esc(destination.id) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<div class="card-head">' +
      '<span class="card-icon">' + icon(destination.icon) + '</span>' +
      '<span class="card-check">' + icon('check') + '</span>' +
      '</div>' +
      '<div class="card-body">' +
      '<h3>' + esc(destination.name) + '</h3>' +
      '<p>' + esc(destination.sub) + '</p>' +
      '</div>' +
      '</button>';
  }).join('');

  renderDestinationSummary();
  const continueButton = document.getElementById('destination-continue');
  if (continueButton) {
    continueButton.disabled = state.destinations.length === 0;
  }
}

function renderTravelersPanel() {
  const root = document.getElementById('travelers-panel');
  if (!root) return;

  const selectedOptions = OPTIONS.filter(function (option) {
    return state.options.includes(option.id);
  });

  const petSummary = state.pets > 0 ? 'What kind of pet? Pick all that apply.' : 'No pets added yet.';

  root.innerHTML = '' +
    '<div class="counter-grid">' +
    renderCounterCard('Adults', 'Age 13 and above', state.adults, 1, 20, 'adults') +
    renderCounterCard('Children', 'Under 13 years old', state.children, 0, 20, 'children') +
    renderCounterCard('Pets', 'Dogs, cats and others', state.pets, 0, 10, 'pets') +
    '</div>' +
    (state.pets > 0 ? '<div class="pet-card"><h3>What kind of pet? Pick all that apply.</h3><div class="pet-chip-grid">' + PET_TYPES.map(function (pet) {
      const selected = state.petTypes.includes(pet.id);
      return '<button class="pet-chip ' + (selected ? 'is-selected' : '') + '" type="button" data-action="toggle-pet" data-pet-id="' + esc(pet.id) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + esc(pet.name) + '</button>';
    }).join('') + '</div></div>' : '') +
    '<div class="trip-form-card time-card">' +
    '<div><h3>Trip duration</h3></div>' +
    '<div class="range-wrap">' +
    '<input id="duration-slider" aria-label="Trip duration in days" type="range" min="1" max="30" value="' + state.duration + '" />' +
    '<span class="duration-label">' + state.duration + ' day' + (state.duration > 1 ? 's' : '') + '</span>' +
    '</div>' +
    '<div class="tick-labels"><span>1 day</span><span>1 week</span><span>2 weeks</span><span>1 month</span></div>' +
    '</div>' +
    '<div class="trip-form-card">' +
    '<h3>Trip details</h3>' +
    '<div class="option-chip-grid">' + OPTIONS.map(function (option) {
      const selected = selectedOptions.some(function (entry) {
        return entry.id === option.id;
      });
      return '<button class="option-chip ' + (selected ? 'is-selected' : '') + '" type="button" data-action="toggle-option" data-option-id="' + esc(option.id) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + esc(option.name) + '</button>';
    }).join('') + '</div>' +
    '</div>' +
    '<div class="trip-actions">' +
    '<button class="secondary-button" type="button" data-action="go-step" data-step="1">Back</button>' +
    '<button class="primary-button" type="button" data-action="generate-checklist">Generate checklist</button>' +
    '</div>';
}

function renderCounterCard(label, meta, value, minValue, maxValue, name) {
  const isMin = value <= minValue;
  const isMax = value >= maxValue;
  return '<div class="counter-card">' +
    '<h3>' + esc(label) + '</h3>' +
    '<span class="counter-meta">' + esc(meta) + '</span>' +
    '<div class="counter-controls">' +
    '<button class="counter-button" type="button" data-action="adjust-counter" data-counter="' + esc(name) + '" data-direction="decrease" ' + (isMin ? 'disabled' : '') + '>−</button>' +
    '<span class="counter-value" aria-live="polite">' + value + '</span>' +
    '<button class="counter-button" type="button" data-action="adjust-counter" data-counter="' + esc(name) + '" data-direction="increase" ' + (isMax ? 'disabled' : '') + '>+</button>' +
    '</div>' +
    '</div>';
}

function renderTripRibbon() {
  const root = document.getElementById('trip-ribbon');
  if (!root) return;

  const parts = getTripSummaryParts();
  root.innerHTML = parts.map(function (part) {
    return '<span class="pill">' + esc(part) + '</span>';
  }).join('');

  if (!parts.length) {
    root.innerHTML = '<span class="pill">No trip selected yet</span>';
  }
}

function renderProgressCard() {
  const root = document.getElementById('progress-card');
  if (!root) return;

  const allItems = getAllChecklistItems();
  const packed = allItems.filter(function (item) {
    return state.checked.has(item.id);
  }).length;
  const total = allItems.length;
  const percent = total ? Math.round((packed / total) * 100) : 0;
  const essentialRemaining = allItems.filter(function (item) {
    return item.essential && !state.checked.has(item.id);
  }).length;

  root.innerHTML = '<div class="progress-head"><span class="progress-count">' + packed + ' of ' + total + '</span><span class="progress-count" aria-label="Progress percent">' + percent + '%</span></div>' +
    '<div class="progress-bar" role="progressbar" aria-label="Checklist progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '"><span class="progress-bar-fill" style="width: ' + percent + '%"></span></div>' +
    '<p class="progress-status">' + esc(getProgressStatus(percent)) + '</p>' +
    '<p class="essentials-left">' + (essentialRemaining > 0 ? essentialRemaining + ' essential items still to pack' : 'All essentials packed') + '</p>';
}

function filterMatch(item) {
  const query = state.query.trim().toLowerCase();
  if (query && item.name.toLowerCase().indexOf(query) === -1) {
    return false;
  }
  if (state.essentialsOnly && !item.essential) {
    return false;
  }
  if (state.currentFilter === 'packed' && !state.checked.has(item.id)) {
    return false;
  }
  if (state.currentFilter === 'unpacked' && state.checked.has(item.id)) {
    return false;
  }
  return true;
}

function renderChecklistCategories() {
  const root = document.getElementById('checklist-categories');
  const emptyState = document.getElementById('empty-state');
  if (!root || !emptyState) return;

  const categories = getChecklistCategories();
  const visibleCategories = categories.map(function (category) {
    const items = category.items.filter(filterMatch);
    return { ...category, items: items };
  }).filter(function (category) {
    return category.items.length > 0;
  });

  if (!visibleCategories.length) {
    root.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  root.innerHTML = visibleCategories.map(function (category) {
    const packedCount = category.items.filter(function (item) {
      return state.checked.has(item.id);
    }).length;
    const total = category.items.length;
    const percent = total ? Math.round((packedCount / total) * 100) : 0;
    const isCollapsed = state.collapsed.has(category.key);
    return '<section class="category-card"><button class="category-toggle" type="button" data-action="toggle-category" data-category-key="' + esc(category.key) + '" aria-expanded="' + (isCollapsed ? 'false' : 'true') + '">' +
      '<span class="category-label">' + icon(CATEGORIES[category.key].icon) + '<span>' + esc(category.name) + '</span></span>' +
      '<span class="category-status">' + (packedCount === total ? 'Done' : packedCount + '/' + total) + '</span>' +
      '</button>' +
      '<div class="category-body ' + (isCollapsed ? 'hidden' : '') + '">' +
      '<div class="category-mini-bar"><span style="width: ' + percent + '%"></span></div>' +
      category.items.map(renderChecklistItem).join('') +
      '<form class="custom-form" data-action="custom-item" data-category-key="' + esc(category.key) + '">' +
      '<input type="text" name="customName" maxlength="80" placeholder="Add your own item" aria-label="Add your own item to ' + esc(category.name) + '" />' +
      '<button type="submit">Add item</button>' +
      '</form>' +
      '</div>' +
      '</section>';
  }).join('');
}

function renderChecklistItem(item) {
  const checked = state.checked.has(item.id);
  const qty = getItemQuantity(item.id);
  const isCustom = Boolean(item.custom);
  const isEssential = item.essential;

  const tags = [];
  if (isEssential) {
    tags.push('<span class="item-tag essential">Essential</span>');
  }
  if (qty) {
    tags.push('<span class="item-tag qty">Pack ' + qty + '</span>');
  }

  const removeButton = isCustom ? '<button class="remove-button" type="button" data-action="remove-custom-item" data-item-id="' + esc(item.id) + '">Remove</button>' : '';

  return '<div class="item-row">' +
    '<input type="checkbox" data-action="toggle-item" data-item-id="' + esc(item.id) + '" ' + (checked ? 'checked' : '') + ' />' +
    '<span class="item-name ' + (checked ? 'packed' : '') + '">' + esc(item.name) + '</span>' +
    tags.join('') +
    removeButton +
    '</div>';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timerId);
  showToast.timerId = setTimeout(function () {
    toast.classList.remove('show');
  }, 1800);
}

function saveState() {
  try {
    const data = {
      destinations: state.destinations,
      adults: state.adults,
      children: state.children,
      pets: state.pets,
      petTypes: state.petTypes,
      options: state.options,
      duration: state.duration,
      checked: Array.from(state.checked),
      custom: state.custom,
      currentFilter: state.currentFilter,
      essentialsOnly: state.essentialsOnly,
      query: state.query,
      currentStep: state.currentStep,
      collapsed: Array.from(state.collapsed)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    showToast('Your trip could not be saved in this browser.');
  }
}

function readState() {
  const knownIds = getKnownIds();
  const readJson = function (key) {
    let raw;
    try {
      raw = localStorage.getItem(key);
    } catch (error) {
      showToast('Saved trip data is unavailable in this browser.');
      return null;
    }

    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      showToast('Saved trip data could not be read. Trying any available backup.');
      return null;
    }
  };

  const direct = readJson(STORAGE_KEY);
  const legacy = !direct ? readJson(LEGACY_STORAGE_KEY) : null;
  const payload = direct || legacy || {};

  state.destinations = Array.isArray(payload.destinations) ? payload.destinations.filter(function (id) {
    return DESTINATIONS.some(function (entry) {
      return entry.id === id;
    });
  }) : [];

  state.adults = clampInt(payload.adults, 1, 20, 2);
  state.children = clampInt(payload.children, 0, 20, 0);
  state.pets = clampInt(payload.pets, 0, 10, 0);
  state.petTypes = Array.isArray(payload.petTypes) ? payload.petTypes.filter(function (id) {
    return PET_TYPES.some(function (entry) {
      return entry.id === id;
    });
  }) : [];
  state.options = Array.isArray(payload.options) ? payload.options.filter(function (id) {
    return OPTIONS.some(function (entry) {
      return entry.id === id;
    });
  }) : [];
  state.duration = clampInt(payload.duration, 1, 30, 7);

  const checked = Array.isArray(payload.checked) ? payload.checked : [];
  state.checked = new Set(checked.filter(function (id) {
    return knownIds.has(id);
  }));

  state.custom = Array.isArray(payload.custom) ? payload.custom.filter(function (entry) {
    return entry && entry.id && entry.name && entry.cat;
  }) : [];

  state.currentFilter = ['all', 'unpacked', 'packed'].indexOf(payload.currentFilter) > -1 ? payload.currentFilter : 'all';
  state.essentialsOnly = Boolean(payload.essentialsOnly);
  state.query = typeof payload.query === 'string' ? payload.query : '';
  state.currentStep = clampInt(payload.currentStep, 1, 3, 1);
  state.collapsed = new Set(Array.isArray(payload.collapsed) ? payload.collapsed.filter(function (key) {
    return Boolean(key);
  }) : []);
}

function clampInt(value, minValue, maxValue, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minValue), maxValue);
}

function applyFilterButtons() {
  document.querySelectorAll('.filter-button').forEach(function (button) {
    const active = button.dataset.filter === state.currentFilter;
    button.classList.toggle('active', active);
  });
}

function renderAll() {
  renderDestinationCards();
  renderTravelersPanel();
  renderTripRibbon();
  renderProgressCard();
  renderChecklistCategories();
  applyFilterButtons();
  syncStepper();
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = state.query;
  }
  const essentialsToggle = document.getElementById('essentials-only');
  if (essentialsToggle) {
    essentialsToggle.checked = state.essentialsOnly;
  }
  saveState();
}

function syncStepper() {
  const stepButtons = document.querySelectorAll('[data-step-nav]');
  const panels = document.querySelectorAll('[data-step-panel]');

  stepButtons.forEach(function (button) {
    const step = Number(button.dataset.stepNav);
    const isCurrent = step === state.currentStep;
    button.classList.toggle('active', isCurrent);
    button.classList.toggle('done', step < state.currentStep);
    button.setAttribute('aria-current', isCurrent ? 'step' : 'false');
  });

  panels.forEach(function (panel) {
    panel.classList.toggle('active', Number(panel.dataset.stepPanel) === state.currentStep);
  });
}

function showStep(step) {
  state.currentStep = clampInt(step, 1, 3, 1);
  renderAll();
}

function toggleDestination(destinationId) {
  const existingIndex = state.destinations.indexOf(destinationId);
  if (existingIndex > -1) {
    state.destinations.splice(existingIndex, 1);
  } else {
    state.destinations.push(destinationId);
  }
  renderAll();
}

function adjustCounter(counterName, direction) {
  const mapping = {
    adults: { min: 1, max: 20 },
    children: { min: 0, max: 20 },
    pets: { min: 0, max: 10 }
  };
  if (!mapping[counterName]) return;
  const current = state[counterName];
  const next = direction === 'increase' ? current + 1 : current - 1;
  state[counterName] = clampInt(next, mapping[counterName].min, mapping[counterName].max, current);
  if (counterName === 'pets' && state.pets === 0) {
    state.petTypes = [];
  }
  renderAll();
}

function togglePet(petId) {
  const selectedIndex = state.petTypes.indexOf(petId);
  if (selectedIndex > -1) {
    state.petTypes.splice(selectedIndex, 1);
  } else {
    state.petTypes.push(petId);
  }
  renderAll();
}

function toggleOption(optionId) {
  const existingIndex = state.options.indexOf(optionId);
  if (existingIndex > -1) {
    state.options.splice(existingIndex, 1);
  } else {
    state.options.push(optionId);
  }
  renderAll();
}

function generateChecklist() {
  state.currentStep = 3;
  renderAll();
}

function addCustomItem(categoryKey, value) {
  const text = String(value || '').trim();
  if (!text) return;
  const id = 'custom_' + Date.now() + '_' + Math.random().toString(16).slice(2, 8);
  state.custom.push({ id: id, cat: categoryKey, name: text });
  renderAll();
  showToast('Custom item added');
}

function removeCustomItem(itemId) {
  state.custom = state.custom.filter(function (item) {
    return item.id !== itemId;
  });
  state.checked.delete(itemId);
  renderAll();
}

function toggleItem(itemId) {
  if (state.checked.has(itemId)) {
    state.checked.delete(itemId);
  } else {
    state.checked.add(itemId);
  }
  renderAll();
}

function clearPackedItems() {
  if (!window.confirm('Clear all packed items from this checklist?')) {
    return;
  }
  state.checked.clear();
  renderAll();
  showToast('Checklist cleared');
}

function packAllItems() {
  const items = getAllChecklistItems();
  items.forEach(function (item) {
    state.checked.add(item.id);
  });
  renderAll();
  showToast('Everything packed');
}

function copyChecklist() {
  try {
    const lines = [];
    lines.push('Travel Checklist');
    lines.push(getTripSummaryParts().join(' • '));
    getChecklistCategories().forEach(function (category) {
      lines.push('');
      lines.push(category.name.toUpperCase());
      category.items.forEach(function (item) {
        const checked = state.checked.has(item.id) ? '[x]' : '[ ]';
        const qty = getItemQuantity(item.id);
        const suffix = item.essential ? ' *' : '';
        const quantity = qty ? ' (Pack ' + qty + ')' : '';
        lines.push(checked + ' ' + item.name + quantity + suffix);
      });
    });
    const text = lines.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Checklist copied to clipboard');
      }).catch(function () {
        showToast('Copy is not available in this browser');
      });
    } else {
      showToast('Copy is not available in this browser');
    }
  } catch (error) {
    showToast('Copy is not available in this browser');
  }
}

function printChecklist() {
  state.collapsed.clear();
  renderChecklistCategories();
  window.print();
  showToast('Print dialog opened');
}

function resetTrip() {
  if (!window.confirm('Start a new trip and clear your checklist?')) {
    return;
  }
  Object.assign(state, {
    destinations: [],
    adults: 2,
    children: 0,
    pets: 0,
    petTypes: [],
    options: [],
    duration: 7,
    checked: new Set(),
    custom: [],
    currentFilter: 'all',
    essentialsOnly: false,
    query: '',
    currentStep: 1,
    collapsed: new Set()
  });
  renderAll();
}

function bindEvents() {
  document.addEventListener('click', function (event) {
    const stepNavigation = event.target.closest('[data-step-nav]');
    if (stepNavigation) {
      showStep(Number(stepNavigation.dataset.stepNav));
      return;
    }

    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'toggle-destination') {
      toggleDestination(target.dataset.destinationId);
    }
    if (action === 'adjust-counter') {
      adjustCounter(target.dataset.counter, target.dataset.direction);
    }
    if (action === 'toggle-pet') {
      togglePet(target.dataset.petId);
    }
    if (action === 'toggle-option') {
      toggleOption(target.dataset.optionId);
    }
    if (action === 'go-step') {
      showStep(Number(target.dataset.step));
    }
    if (action === 'generate-checklist') {
      generateChecklist();
    }
    if (action === 'toggle-category') {
      const key = target.dataset.categoryKey;
      if (state.collapsed.has(key)) {
        state.collapsed.delete(key);
      } else {
        state.collapsed.add(key);
      }
      renderChecklistCategories();
    }
    if (action === 'toggle-item') {
      toggleItem(target.dataset.itemId);
    }
    if (action === 'remove-custom-item') {
      removeCustomItem(target.dataset.itemId);
    }
    if (action === 'pack-all') {
      packAllItems();
    }
    if (action === 'clear-items') {
      clearPackedItems();
    }
    if (action === 'copy-list') {
      copyChecklist();
    }
    if (action === 'print-list') {
      printChecklist();
    }
    if (action === 'new-trip') {
      resetTrip();
    }
    if (action === 'filter') {
      state.currentFilter = target.dataset.filter;
      renderChecklistCategories();
      applyFilterButtons();
    }

  });

  document.addEventListener('submit', function (event) {
    const form = event.target.closest('[data-action="custom-item"]');
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('input[name="customName"]');
    if (!input) return;
    addCustomItem(form.dataset.categoryKey, input.value);
    form.reset();
  });

  document.addEventListener('input', function (event) {
    const slider = event.target.closest('#duration-slider');
    if (slider) {
      state.duration = clampInt(slider.value, 1, 30, 7);
      renderTravelersPanel();
      renderProgressCard();
      renderChecklistCategories();
      renderTripRibbon();
      saveState();
    }

    const searchInput = event.target.closest('#search-input');
    if (searchInput) {
      state.query = searchInput.value;
      renderChecklistCategories();
      saveState();
    }
  });

  document.addEventListener('change', function (event) {
    const essentialsToggle = event.target.closest('#essentials-only');
    if (essentialsToggle) {
      state.essentialsOnly = essentialsToggle.checked;
      renderChecklistCategories();
      saveState();
    }
  });

  document.addEventListener('click', function (event) {
    const filterButton = event.target.closest('.filter-button');
    if (!filterButton) return;
    state.currentFilter = filterButton.dataset.filter;
    applyFilterButtons();
    renderChecklistCategories();
    saveState();
  });

  document.getElementById('destination-continue')?.addEventListener('click', function () {
    showStep(2);
  });

  document.getElementById('pack-all')?.addEventListener('click', function () {
    packAllItems();
  });

  document.getElementById('clear-items')?.addEventListener('click', function () {
    clearPackedItems();
  });

  document.getElementById('copy-list')?.addEventListener('click', function () {
    copyChecklist();
  });

  document.getElementById('print-list')?.addEventListener('click', function () {
    printChecklist();
  });

  document.getElementById('new-trip')?.addEventListener('click', function () {
    resetTrip();
  });

}

function init() {
  readState();
  bindEvents();
  renderAll();
}

init();
