'use strict';

const DESTINATIONS = [
  { id: 'beach', icon: 'beach', name: 'Beach', sub: 'Sun, sand and waves' },
  { id: 'mountain', icon: 'mountain', name: 'Mountain', sub: 'High-altitude escape' },
  { id: 'hiking', icon: 'hiking', name: 'Hiking', sub: 'Trails and wilderness' },
  { id: 'camping', icon: 'camping', name: 'Camping', sub: 'Outdoor and nature' },
  { id: 'city', icon: 'city', name: 'City Break', sub: 'Urban exploration' },
  { id: 'international', icon: 'globe', name: 'International', sub: 'Overseas adventure' },
  { id: 'ski', icon: 'ski', name: 'Ski and Snow', sub: 'Winter sports' },
  { id: 'safari', icon: 'safari', name: 'Safari', sub: 'Wildlife and savanna' },
  { id: 'nationalparks', icon: 'park', name: 'National Parks', sub: 'Scenic trails and vistas' },
  { id: 'cruise', icon: 'cruise', name: 'Cruise', sub: 'Ocean and river voyages' },
  { id: 'roadtrip', icon: 'car', name: 'Road Trip', sub: 'Long drives, many stops' },
  { id: 'business', icon: 'briefcase', name: 'Business Trip', sub: 'Meetings and travel days' },
  { id: 'backpacking', icon: 'backpack', name: 'Backpacking', sub: 'Hostels and light packing' },
  { id: 'themepark', icon: 'castle', name: 'Theme Park', sub: 'Rides, queues and crowds' }
];

const OPTIONS = [
  { id: 'flying', icon: 'plane', name: 'Flying', sub: 'Adds a flight and carry-on list' },
  { id: 'work', icon: 'laptop', name: 'Working remotely', sub: 'Adds a work setup list' },
  { id: 'infant', icon: 'baby', name: 'Infant under 2', sub: 'Adds baby gear and feeding' },
  { id: 'cold', icon: 'snow', name: 'Cold weather', sub: 'Adds warm layers to clothing' }
];

const PET_TYPES = [
  { id: 'dog', name: 'Dog' },
  { id: 'cat', name: 'Cat' },
  { id: 'other', name: 'Other' }
];

const CATEGORIES = {
  documents: { icon: 'document', name: 'Documents and ID' },
  predeparture: { icon: 'calendar', name: 'Before You Leave' },
  flight: { icon: 'bag', name: 'Flight and Carry-on' },
  clothing: { icon: 'shirt', name: 'Clothing and Apparel' },
  toiletries: { icon: 'sparkles', name: 'Toiletries and Hygiene' },
  medicine: { icon: 'cross', name: 'Medicine and First Aid' },
  electronics: { icon: 'device', name: 'Electronics and Gadgets' },
  work: { icon: 'laptop', name: 'Work Setup' },
  chargers: { icon: 'plug', name: 'Chargers and Power' },
  gear: { icon: 'bag', name: 'Gear and Equipment' },
  food: { icon: 'food', name: 'Food and Snacks' },
  general: { icon: 'star', name: 'Travel Essentials' },
  kids: { icon: 'kid', name: 'Kids\' Essentials' },
  infant: { icon: 'baby', name: 'Infant Essentials' },
  pets: { icon: 'paw', name: 'Pet Travel' }
};

const CATEGORY_ORDER = [
  'documents',
  'predeparture',
  'flight',
  'clothing',
  'toiletries',
  'medicine',
  'electronics',
  'work',
  'chargers',
  'gear',
  'food',
  'general',
  'kids',
  'infant',
  'pets'
];

const DATA = {
  common: {
    documents: [
      { id: 'doc01', name: 'Passport', essential: true },
      { id: 'doc02', name: 'Driving licence', essential: true },
      { id: 'doc03', name: 'Travel insurance details', essential: true },
      { id: 'doc04', name: 'Accommodation confirmation', essential: true },
      { id: 'doc05', name: 'Transport tickets', essential: true },
      { id: 'doc06', name: 'Emergency contacts', essential: true },
      { id: 'doc07', name: 'Credit cards', essential: true },
      { id: 'doc08', name: 'Bank cards', essential: false },
      { id: 'doc09', name: 'Copies of key documents', essential: true },
      { id: 'doc10', name: 'ID photo', essential: false },
      { id: 'doc11', name: 'Pet passport papers', essential: false },
      { id: 'doc12', name: 'Medical records', essential: false },
      { id: 'doc13', name: 'Vaccination records', essential: false },
      { id: 'doc14', name: 'Local map or guide', essential: false }
    ],
    predeparture: [
      { id: 'pre01', name: 'Confirm booking details', essential: true },
      { id: 'pre02', name: 'Set out home alarm', essential: true },
      { id: 'pre03', name: 'Stop mail and deliveries', essential: true },
      { id: 'pre04', name: 'Water plants', essential: false },
      { id: 'pre05', name: 'Check weather forecast', essential: true },
      { id: 'pre06', name: 'Charge all devices', essential: true },
      { id: 'pre07', name: 'Empty fridge and freezer', essential: false },
      { id: 'pre08', name: 'Set up travel notifications', essential: true },
      { id: 'pre09', name: 'Check gate or baggage rules', essential: true },
      { id: 'pre10', name: 'Download offline maps', essential: true },
      { id: 'pre11', name: 'Sort cash and cards', essential: true },
      { id: 'pre12', name: 'Pack travel pillow', essential: false },
      { id: 'pre13', name: 'Share itinerary with family', essential: false },
      { id: 'pre14', name: 'Check road conditions', essential: false },
      { id: 'pre15', name: 'Set travel mode on phone', essential: true }
    ],
    toiletries: [
      { id: 'toe01', name: 'Toothbrush', essential: true },
      { id: 'toe02', name: 'Toothpaste', essential: true },
      { id: 'toe03', name: 'Floss', essential: false },
      { id: 'toe04', name: 'Hand wash', essential: true },
      { id: 'toe05', name: 'Shampoo', essential: true },
      { id: 'toe06', name: 'Conditioner', essential: true },
      { id: 'toe07', name: 'Body wash', essential: true },
      { id: 'toe08', name: 'Sunscreen', essential: true },
      { id: 'toe09', name: 'Deodorant', essential: true },
      { id: 'toe10', name: 'Lip balm', essential: false },
      { id: 'toe11', name: 'Face wash', essential: true },
      { id: 'toe12', name: 'Moisturiser', essential: false },
      { id: 'toe13', name: 'Travel towel', essential: false }
    ],
    medicine: [
      { id: 'med01', name: 'Pain relief tablets', essential: true },
      { id: 'med02', name: 'Plasters', essential: true },
      { id: 'med03', name: 'Antiseptic wipes', essential: true },
      { id: 'med04', name: 'Prescription medicine', essential: true },
      { id: 'med05', name: 'Thermometer', essential: false },
      { id: 'med06', name: 'Allergy tablets', essential: false },
      { id: 'med07', name: 'Motion sickness tablets', essential: false },
      { id: 'med08', name: 'Travel first aid kit', essential: true },
      { id: 'med09', name: 'Tweezers', essential: false },
      { id: 'med10', name: 'Hand sanitiser', essential: true },
      { id: 'med11', name: 'Water bottle cleaning tablets', essential: false },
      { id: 'med12', name: 'Bandages', essential: true },
      { id: 'med13', name: 'Elastic wrap', essential: false },
      { id: 'med14', name: 'Eye drops', essential: false },
      { id: 'med15', name: 'Cold medicine', essential: false },
      { id: 'med16', name: 'Medication list', essential: true }
    ],
    electronics: [
      { id: 'ele01', name: 'Phone', essential: true },
      { id: 'ele02', name: 'Phone charger', essential: true },
      { id: 'ele03', name: 'Camera', essential: false },
      { id: 'ele04', name: 'Headphones', essential: true },
      { id: 'ele05', name: 'Power bank', essential: true },
      { id: 'ele06', name: 'Travel adapter', essential: true },
      { id: 'ele07', name: 'Watch', essential: false },
      { id: 'ele08', name: 'E-reader', essential: false }
    ],
    chargers: [
      { id: 'chg01', name: 'USB cable', essential: true },
      { id: 'chg02', name: 'Laptop charger', essential: true },
      { id: 'chg03', name: 'Camera cable', essential: false },
      { id: 'chg04', name: 'Power bank cable', essential: true },
      { id: 'chg05', name: 'Multi-plug adaptor', essential: true },
      { id: 'chg06', name: 'Cable organiser', essential: false },
      { id: 'chg07', name: 'Spare charging cable', essential: false }
    ],
    general: [
      { id: 'gen01', name: 'Reusable water bottle', essential: true },
      { id: 'gen02', name: 'Travel wallet', essential: true },
      { id: 'gen03', name: 'Sunglasses', essential: true },
      { id: 'gen04', name: 'Sunhat', essential: true },
      { id: 'gen05', name: 'Small daypack', essential: true },
      { id: 'gen06', name: 'Laundry bag', essential: true },
      { id: 'gen07', name: 'Packable tote bag', essential: false },
      { id: 'gen08', name: 'Books or e-reader', essential: false },
      { id: 'gen09', name: 'Reusable shopping bag', essential: false },
      { id: 'gen10', name: 'Travel towel', essential: false },
      { id: 'gen11', name: 'Portable lock', essential: false },
      { id: 'gen12', name: 'Travel snacks', essential: false },
      { id: 'gen13', name: 'Hand cream', essential: false },
      { id: 'gen14', name: 'Mints or gum', essential: false },
      { id: 'gen15', name: 'Reusable bottle', essential: true },
      { id: 'gen16', name: 'Laundry detergent sheets', essential: false },
      { id: 'gen17', name: 'Sewing kit', essential: false },
      { id: 'gen18', name: 'Basic toiletries pouch', essential: true }
    ]
  },
  destinations: {
    beach: {
      clothing: [
        { id: 'beach_clt_01', name: 'Swimwear', essential: true },
        { id: 'beach_clt_02', name: 'Sun hat', essential: true },
        { id: 'beach_clt_03', name: 'Underwear', essential: true },
        { id: 'beach_clt_04', name: 'Light cover-up', essential: false },
        { id: 'beach_clt_05', name: 'Cotton shirts', essential: true },
        { id: 'beach_clt_06', name: 'Shorts', essential: true },
        { id: 'beach_clt_07', name: 'Sandals', essential: true },
        { id: 'beach_clt_08', name: 'Light beach scarf', essential: false },
        { id: 'beach_clt_09', name: 'Sleepwear', essential: true },
        { id: 'beach_clt_10', name: 'Evening top', essential: false }
      ],
      gear: [
        { id: 'beach_gear_01', name: 'Beach towel', essential: true },
        { id: 'beach_gear_02', name: 'Beach bag', essential: true },
        { id: 'beach_gear_03', name: 'Waterproof phone pouch', essential: true },
        { id: 'beach_gear_04', name: 'Snorkel set', essential: false },
        { id: 'beach_gear_05', name: 'Flip flops', essential: true },
        { id: 'beach_gear_06', name: 'Dry bag', essential: false },
        { id: 'beach_gear_07', name: 'Sunglasses case', essential: false },
        { id: 'beach_gear_08', name: 'Beach umbrella', essential: false }
      ],
      toiletries: [
        { id: 'beach_toe_01', name: 'After-sun lotion', essential: true },
        { id: 'beach_toe_02', name: 'Sunscreen spray', essential: true }
      ],
      general: [
        { id: 'beach_gen_01', name: 'Beach read or magazine', essential: false }
      ]
    },
    mountain: {
      clothing: [
        { id: 'mountain_clt_01', name: 'Thermal base layer', essential: true },
        { id: 'mountain_clt_02', name: 'Insulated mid layer', essential: true },
        { id: 'mountain_clt_03', name: 'Waterproof shell', essential: true },
        { id: 'mountain_clt_04', name: 'Trekking trousers', essential: true },
        { id: 'mountain_clt_05', name: 'Warm socks', essential: true },
        { id: 'mountain_clt_06', name: 'Hiking boots', essential: true },
        { id: 'mountain_clt_07', name: 'Gloves', essential: true },
        { id: 'mountain_clt_08', name: 'Buff or neck gaiter', essential: false },
        { id: 'mountain_clt_09', name: 'Fleece top', essential: true },
        { id: 'mountain_clt_10', name: 'Camp socks', essential: false }
      ],
      gear: [
        { id: 'mountain_gear_01', name: 'Daypack', essential: true },
        { id: 'mountain_gear_02', name: 'Water flask', essential: true },
        { id: 'mountain_gear_03', name: 'Trail map', essential: true },
        { id: 'mountain_gear_04', name: 'Head torch', essential: true },
        { id: 'mountain_gear_05', name: 'Walking poles', essential: false },
        { id: 'mountain_gear_06', name: 'Microspikes', essential: false },
        { id: 'mountain_gear_07', name: 'Gaiters', essential: false }
      ]
    },
    hiking: {
      clothing: [
        { id: 'hike_clt_01', name: 'Breathable shirts', essential: true },
        { id: 'hike_clt_02', name: 'Quick-dry trousers', essential: true },
        { id: 'hike_clt_03', name: 'Trail socks', essential: true },
        { id: 'hike_clt_04', name: 'Light waterproof jacket', essential: true },
        { id: 'hike_clt_05', name: 'Sun hat', essential: true },
        { id: 'hike_clt_06', name: 'Hiking boots', essential: true },
        { id: 'hike_clt_07', name: 'Gaiters', essential: false },
        { id: 'hike_clt_08', name: 'Warm layer', essential: false }
      ],
      gear: [
        { id: 'hike_gear_01', name: 'Daypack', essential: true },
        { id: 'hike_gear_02', name: 'Trekking poles', essential: false },
        { id: 'hike_gear_03', name: 'Water bottle', essential: true },
        { id: 'hike_gear_04', name: 'Trail snacks', essential: true },
        { id: 'hike_gear_05', name: 'First aid kit', essential: true },
        { id: 'hike_gear_06', name: 'Map and compass', essential: true }
      ],
      food: [
        { id: 'hike_food_01', name: 'Energy bars', essential: true },
        { id: 'hike_food_02', name: 'Nuts and fruit', essential: false },
        { id: 'hike_food_03', name: 'Emergency rations', essential: false }
      ]
    },
    camping: {
      clothing: [
        { id: 'camp_clt_01', name: 'Warm sleeping set', essential: true },
        { id: 'camp_clt_02', name: 'Base layer', essential: true },
        { id: 'camp_clt_03', name: 'Camp trousers', essential: true },
        { id: 'camp_clt_04', name: 'Waterproof jacket', essential: true },
        { id: 'camp_clt_05', name: 'Warm hat', essential: true },
        { id: 'camp_clt_06', name: 'Camp socks', essential: true }
      ],
      gear: [
        { id: 'camp_gear_01', name: 'Tent', essential: true },
        { id: 'camp_gear_02', name: 'Sleeping bag', essential: true },
        { id: 'camp_gear_03', name: 'Sleeping mat', essential: true },
        { id: 'camp_gear_04', name: 'Head torch', essential: true },
        { id: 'camp_gear_05', name: 'Camp stove', essential: true },
        { id: 'camp_gear_06', name: 'Utensils', essential: true },
        { id: 'camp_gear_07', name: 'Water jug', essential: false },
        { id: 'camp_gear_08', name: 'Camp chairs', essential: false }
      ],
      food: [
        { id: 'camp_food_01', name: 'Breakfast bars', essential: true },
        { id: 'camp_food_02', name: 'Hot drinks', essential: true },
        { id: 'camp_food_03', name: 'Camp meals', essential: true },
        { id: 'camp_food_04', name: 'Trail snacks', essential: false }
      ]
    },
    city: {
      clothing: [
        { id: 'city_clt_01', name: 'Smart casual outfits', essential: true },
        { id: 'city_clt_02', name: 'Walk shoes', essential: true },
        { id: 'city_clt_03', name: 'Light layers', essential: true },
        { id: 'city_clt_04', name: 'Evening outfit', essential: false },
        { id: 'city_clt_05', name: 'Light jacket', essential: true },
        { id: 'city_clt_06', name: 'Underwear', essential: true }
      ],
      gear: [
        { id: 'city_gear_01', name: 'Crossbody bag', essential: true },
        { id: 'city_gear_02', name: 'Comfortable shoes', essential: true },
        { id: 'city_gear_03', name: 'Portable umbrella', essential: true },
        { id: 'city_gear_04', name: 'Map app offline', essential: false },
        { id: 'city_gear_05', name: 'Reusable bottle', essential: true }
      ],
      general: [
        { id: 'city_gen_01', name: 'Transit card', essential: true },
        { id: 'city_gen_02', name: 'Pocket guide', essential: false }
      ]
    },
    international: {
      clothing: [
        { id: 'int_clt_01', name: 'Breathable shirts', essential: true },
        { id: 'int_clt_02', name: 'Smart casual outfit', essential: true },
        { id: 'int_clt_03', name: 'Light trousers', essential: true },
        { id: 'int_clt_04', name: 'Underwear', essential: true },
        { id: 'int_clt_05', name: 'Shoes for walking', essential: true },
        { id: 'int_clt_06', name: 'Light jacket', essential: true },
        { id: 'int_clt_07', name: 'Sleepwear', essential: true }
      ],
      gear: [
        { id: 'int_gear_01', name: 'Power adapter', essential: true },
        { id: 'int_gear_02', name: 'Packing cubes', essential: false },
        { id: 'int_gear_03', name: 'Portable charger', essential: true },
        { id: 'int_gear_04', name: 'Travel lock', essential: false },
        { id: 'int_gear_05', name: 'Day bag', essential: true }
      ],
      general: [
        { id: 'int_gen_01', name: 'Local currency', essential: true },
        { id: 'int_gen_02', name: 'Phrasebook', essential: false }
      ]
    },
    ski: {
      clothing: [
        { id: 'ski_clt_01', name: 'Thermal base layer', essential: true },
        { id: 'ski_clt_02', name: 'Insulated ski jacket', essential: true },
        { id: 'ski_clt_03', name: 'Snow trousers', essential: true },
        { id: 'ski_clt_04', name: 'Gloves', essential: true },
        { id: 'ski_clt_05', name: 'Warm hat', essential: true },
        { id: 'ski_clt_06', name: 'Goggles', essential: true },
        { id: 'ski_clt_07', name: 'Socks', essential: true },
        { id: 'ski_clt_08', name: 'Neck tube', essential: false }
      ],
      gear: [
        { id: 'ski_gear_01', name: 'Skis or snowboard', essential: true },
        { id: 'ski_gear_02', name: 'Boots', essential: true },
        { id: 'ski_gear_03', name: 'Helmets', essential: true },
        { id: 'ski_gear_04', name: 'Ski poles', essential: true },
        { id: 'ski_gear_05', name: 'Dry bag', essential: false },
        { id: 'ski_gear_06', name: 'Hand warmers', essential: false }
      ],
      general: [
        { id: 'ski_gen_01', name: 'Lift pass', essential: true },
        { id: 'ski_gen_02', name: 'Spare gloves', essential: false }
      ]
    },
    safari: {
      clothing: [
        { id: 'safari_clt_01', name: 'Neutral shirts', essential: true },
        { id: 'safari_clt_02', name: 'Loose trousers', essential: true },
        { id: 'safari_clt_03', name: 'Socks', essential: true },
        { id: 'safari_clt_04', name: 'Wide-brim hat', essential: true },
        { id: 'safari_clt_05', name: 'Lightweight jacket', essential: false }
      ],
      gear: [
        { id: 'safari_gear_01', name: 'Binoculars', essential: true },
        { id: 'safari_gear_02', name: 'Camera with zoom lens', essential: true },
        { id: 'safari_gear_03', name: 'Travel towel', essential: false },
        { id: 'safari_gear_04', name: 'Water bottle', essential: true },
        { id: 'safari_gear_05', name: 'Daypack', essential: true }
      ],
      general: [
        { id: 'safari_gen_01', name: 'Safari permit', essential: true },
        { id: 'safari_gen_02', name: 'Travel guide', essential: false }
      ]
    },
    nationalparks: {
      clothing: [
        { id: 'park_clt_01', name: 'Trail shirts', essential: true },
        { id: 'park_clt_02', name: 'Light hiking trousers', essential: true },
        { id: 'park_clt_03', name: 'Hiking socks', essential: true },
        { id: 'park_clt_04', name: 'Light rain layer', essential: true },
        { id: 'park_clt_05', name: 'Trail shoes', essential: true }
      ],
      gear: [
        { id: 'park_gear_01', name: 'Daypack', essential: true },
        { id: 'park_gear_02', name: 'Water bottle', essential: true },
        { id: 'park_gear_03', name: 'Trail map', essential: true },
        { id: 'park_gear_04', name: 'Camera', essential: false },
        { id: 'park_gear_05', name: 'Binoculars', essential: false }
      ],
      food: [
        { id: 'park_food_01', name: 'Energy bars', essential: true },
        { id: 'park_food_02', name: 'Nuts', essential: false }
      ]
    },
    cruise: {
      clothing: [
        { id: 'cruise_clt_01', name: 'Swimwear', essential: true },
        { id: 'cruise_clt_02', name: 'Smart evening outfit', essential: true },
        { id: 'cruise_clt_03', name: 'Underwear', essential: true },
        { id: 'cruise_clt_04', name: 'Light layers', essential: true },
        { id: 'cruise_clt_05', name: 'Flip flops', essential: true },
        { id: 'cruise_clt_06', name: 'Walking shoes', essential: true },
        { id: 'cruise_clt_07', name: 'Day dresses or shorts', essential: false }
      ],
      gear: [
        { id: 'cruise_gear_01', name: 'Day bag', essential: true },
        { id: 'cruise_gear_02', name: 'Waterproof pouch', essential: true },
        { id: 'cruise_gear_03', name: 'Travel towel', essential: false },
        { id: 'cruise_gear_04', name: 'Sunscreen', essential: true }
      ],
      general: [
        { id: 'cruise_gen_01', name: 'Cruise tickets', essential: true },
        { id: 'cruise_gen_02', name: 'Passport and boarding docs', essential: true }
      ]
    },
    roadtrip: {
      clothing: [
        { id: 'road_clt_01', name: 'Comfortable travel clothes', essential: true },
        { id: 'road_clt_02', name: 'Underwear', essential: true },
        { id: 'road_clt_03', name: 'Light layers', essential: true },
        { id: 'road_clt_04', name: 'Walking shoes', essential: true },
        { id: 'road_clt_05', name: 'Socks', essential: true },
        { id: 'road_clt_06', name: 'Sleepwear', essential: true }
      ],
      gear: [
        { id: 'road_gear_01', name: 'Road trip snacks', essential: true },
        { id: 'road_gear_02', name: 'Phone holder', essential: true },
        { id: 'road_gear_03', name: 'First aid pack', essential: true },
        { id: 'road_gear_04', name: 'Tourist map', essential: false },
        { id: 'road_gear_05', name: 'Cooler bag', essential: true }
      ],
      food: [
        { id: 'road_food_01', name: 'Drinking water', essential: true },
        { id: 'road_food_02', name: 'Snacks for stops', essential: true },
        { id: 'road_food_03', name: 'Lunch items', essential: false }
      ]
    },
    business: {
      clothing: [
        { id: 'biz_clt_01', name: 'Business shirts', essential: true },
        { id: 'biz_clt_02', name: 'Smart trousers', essential: true },
        { id: 'biz_clt_03', name: 'Blazer', essential: true },
        { id: 'biz_clt_04', name: 'Underwear', essential: true },
        { id: 'biz_clt_05', name: 'Shirts for meetings', essential: true },
        { id: 'biz_clt_06', name: 'Travel shoes', essential: true }
      ],
      gear: [
        { id: 'biz_gear_01', name: 'Laptop', essential: true },
        { id: 'biz_gear_02', name: 'Presentation files', essential: true },
        { id: 'biz_gear_03', name: 'Travel charger', essential: true },
        { id: 'biz_gear_04', name: 'Notebook', essential: false },
        { id: 'biz_gear_05', name: 'Pen case', essential: false }
      ],
      general: [
        { id: 'biz_gen_01', name: 'Meeting notes', essential: true },
        { id: 'biz_gen_02', name: 'Company ID card', essential: true }
      ]
    },
    backpacking: {
      clothing: [
        { id: 'back_clt_01', name: 'Quick-dry tops', essential: true },
        { id: 'back_clt_02', name: 'Travel trousers', essential: true },
        { id: 'back_clt_03', name: 'Underwear', essential: true },
        { id: 'back_clt_04', name: 'Light waterproof layer', essential: true },
        { id: 'back_clt_05', name: 'Sleepwear', essential: true },
        { id: 'back_clt_06', name: 'Walking shoes', essential: true }
      ],
      gear: [
        { id: 'back_gear_01', name: 'Backpack', essential: true },
        { id: 'back_gear_02', name: 'Packing cubes', essential: true },
        { id: 'back_gear_03', name: 'Travel towel', essential: true },
        { id: 'back_gear_04', name: 'Reusable bottle', essential: true },
        { id: 'back_gear_05', name: 'Lock', essential: false }
      ]
    },
    themepark: {
      clothing: [
        { id: 'park_clt_21', name: 'Comfortable t-shirts', essential: true },
        { id: 'park_clt_22', name: 'Light shorts', essential: true },
        { id: 'park_clt_23', name: 'Socks', essential: true },
        { id: 'park_clt_24', name: 'Light rain jacket', essential: true },
        { id: 'park_clt_25', name: 'Closed-toe shoes', essential: true }
      ],
      gear: [
        { id: 'park_gear_21', name: 'Portable charger', essential: true },
        { id: 'park_gear_22', name: 'Reusable water bottle', essential: true },
        { id: 'park_gear_23', name: 'Mini fan', essential: false },
        { id: 'park_gear_24', name: 'Poncho', essential: true },
        { id: 'park_gear_25', name: 'Day bag', essential: true }
      ],
      food: [
        { id: 'park_food_21', name: 'Snack pack', essential: true },
        { id: 'park_food_22', name: 'Lunch items', essential: false }
      ]
    }
  },
  options: {
    flying: {
      flight: [
        { id: 'fly01', name: 'Passport and boarding pass', essential: true },
        { id: 'fly02', name: 'Headphones', essential: true },
        { id: 'fly03', name: 'Travel pillow', essential: true },
        { id: 'fly04', name: 'Eye mask', essential: false },
        { id: 'fly05', name: 'Neck cushion', essential: false },
        { id: 'fly06', name: 'Reusable water bottle', essential: true },
        { id: 'fly07', name: 'Snacks', essential: false },
        { id: 'fly08', name: 'Charging cable', essential: true },
        { id: 'fly09', name: 'Medication', essential: true },
        { id: 'fly10', name: 'Luggage tags', essential: true },
        { id: 'fly11', name: 'Seat selection notes', essential: false }
      ],
      general: [
        { id: 'fly12', name: 'Earplugs', essential: false }
      ]
    },
    work: {
      work: [
        { id: 'wr01', name: 'Laptop', essential: true },
        { id: 'wr02', name: 'Laptop charger', essential: true },
        { id: 'wr03', name: 'Phone charger', essential: true },
        { id: 'wr04', name: 'Mouse', essential: false },
        { id: 'wr05', name: 'USB hub', essential: false },
        { id: 'wr06', name: 'Video call kit', essential: true },
        { id: 'wr07', name: 'Headphones', essential: true },
        { id: 'wr08', name: 'Portable stand', essential: false },
        { id: 'wr09', name: 'Power bank', essential: true }
      ]
    },
    infant: {
      infant: [
        { id: 'inf01', name: 'Cotton baby clothes', essential: true },
        { id: 'inf02', name: 'Baby wipes', essential: true },
        { id: 'inf03', name: 'Nappies', essential: true },
        { id: 'inf04', name: 'Nappy bags', essential: true },
        { id: 'inf05', name: 'Baby blankets', essential: true },
        { id: 'inf06', name: 'Change mat', essential: true },
        { id: 'inf07', name: 'Bottle and formula', essential: true },
        { id: 'inf08', name: 'Sterilising bag', essential: true },
        { id: 'inf09', name: 'Snacks and bibs', essential: false },
        { id: 'inf10', name: 'Comfort toy', essential: false },
        { id: 'inf11', name: 'Burp cloths', essential: true },
        { id: 'inf12', name: 'Baby monitor', essential: false }
      ]
    },
    cold: {
      clothing: [
        { id: 'cold01', name: 'Insulated coat', essential: true },
        { id: 'cold02', name: 'Thermal underwear', essential: true },
        { id: 'cold03', name: 'Warm gloves', essential: true },
        { id: 'cold04', name: 'Thermal socks', essential: true },
        { id: 'cold05', name: 'Fleece layer', essential: true },
        { id: 'cold06', name: 'Warm scarf', essential: true },
        { id: 'cold07', name: 'Beanie', essential: true },
        { id: 'cold08', name: 'Waterproof boots', essential: true }
      ]
    }
  },
  kids: [
    { id: 'kid01', name: 'Kids sunscreen', essential: true },
    { id: 'kid02', name: 'Nappies and wipes', essential: true },
    { id: 'kid03', name: 'Favourite toy', essential: false },
    { id: 'kid04', name: 'Travel games', essential: false },
    { id: 'kid05', name: 'Water bottle', essential: true },
    { id: 'kid06', name: 'Snacks', essential: true },
    { id: 'kid07', name: 'Wet wipes', essential: true },
    { id: 'kid08', name: 'Kid-safe sunscreen', essential: true },
    { id: 'kid09', name: 'Spare clothes', essential: true },
    { id: 'kid10', name: 'Hairbrush', essential: false },
    { id: 'kid11', name: 'First aid kit', essential: true },
    { id: 'kid12', name: 'Booster seat', essential: false },
    { id: 'kid13', name: 'Portable activity set', essential: false },
    { id: 'kid14', name: 'Reusable cup', essential: true },
    { id: 'kid15', name: 'Travel blanket', essential: false },
    { id: 'kid16', name: 'Book or tablet', essential: false },
    { id: 'kid17', name: 'Emergency contact card', essential: true },
    { id: 'kid18', name: 'Healthy snacks', essential: true },
    { id: 'kid19', name: 'Sun hat', essential: true },
    { id: 'kid20', name: 'Change of clothes', essential: true }
  ],
  pets: {
    common: [
      { id: 'pet01', name: 'Vaccination records', essential: true },
      { id: 'pet02', name: 'Microchip details', essential: true },
      { id: 'pet03', name: 'Pet carrier or crate', essential: true },
      { id: 'pet04', name: 'Food and bowls', essential: true },
      { id: 'pet05', name: 'Medication', essential: true },
      { id: 'pet06', name: 'Pet-friendly stay confirmed', essential: true },
      { id: 'pet07', name: 'Waste bags', essential: true },
      { id: 'pet08', name: 'Travel blanket', essential: false },
      { id: 'pet09', name: 'Dog tags', essential: true },
      { id: 'pet10', name: 'Cleaning wipes', essential: true },
      { id: 'pet11', name: 'Favourite toy', essential: false }
    ],
    dog: [
      { id: 'pet_dog_01', name: 'Lead', essential: true },
      { id: 'pet_dog_02', name: 'Harness', essential: true },
      { id: 'pet_dog_03', name: 'Water bowl', essential: true },
      { id: 'pet_dog_04', name: 'Treats', essential: true },
      { id: 'pet_dog_05', name: 'Poop bags', essential: true },
      { id: 'pet_dog_06', name: 'Pet towel', essential: false },
      { id: 'pet_dog_07', name: 'Travel bed', essential: false }
    ],
    cat: [
      { id: 'pet_cat_01', name: 'Litter tray', essential: true },
      { id: 'pet_cat_02', name: 'Litter', essential: true },
      { id: 'pet_cat_03', name: 'Carrier cover', essential: true },
      { id: 'pet_cat_04', name: 'Harness', essential: false },
      { id: 'pet_cat_05', name: 'Food mat', essential: false },
      { id: 'pet_cat_06', name: 'Pet blanket', essential: false }
    ],
    other: [
      { id: 'pet_other_01', name: 'Small crate', essential: true },
      { id: 'pet_other_02', name: 'Portable carrier', essential: true },
      { id: 'pet_other_03', name: 'Towels', essential: false }
    ]
  }
};

const QTY_HINTS = {
  beach_clt_03: function (days) { return Math.min(days, 7) + 2; },
  city_clt_06: function (days) { return Math.min(days, 7) + 3; },
  int_clt_04: function (days) { return Math.min(days, 7) + 3; },
  cruise_clt_03: function (days) { return Math.min(days, 7) + 3; },
  road_clt_02: function (days) { return Math.min(days, 7) + 3; },
  biz_clt_04: function (days) { return Math.min(days, 5); },
  back_clt_03: function (days) { return Math.min(days, 5) + 1; },
  inf03: function (days) { return Math.min(days, 7) * 8; },
  kid09: function (days) { return Math.min(days, 7) + 3; },
  cold01: function (days) { return Math.min(days, 7) + 2; },
  cold02: function (days) { return Math.min(days, 7) + 2; },
  mountain_clt_05: function (days) { return Math.min(days, 7) + 2; },
  ski_clt_07: function (days) { return Math.min(days, 7) + 2; }
};
