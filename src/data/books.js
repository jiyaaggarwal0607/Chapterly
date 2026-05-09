export const categories = [
  'Fiction',
  'Science',
  'Technology',
  'History',
  'Business',
  'Self-Development'
];

export const initialBooks = [
  {
    id: 'bk-001',
    title: 'The Midnight Library',
    author: 'Nora Vale',
    category: 'Fiction',
    price: 18.99,
    stock: 18,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A luminous novel about second chances, quiet choices, and the lives waiting between shelves.',
    description:
      'Between life and regret sits a library where every book opens into a different version of a life. This elegant story follows one woman as she learns that fulfillment is rarely found in perfection, but in attention, courage, and repair.',
    authorBio: 'Nora Vale writes literary fiction about memory, tenderness, and the strangeness of everyday decisions.'
  },
  {
    id: 'bk-002',
    title: 'Cosmos in Motion',
    author: 'Dr. Elias Grant',
    category: 'Science',
    price: 24.5,
    stock: 11,
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A readable tour through galaxies, dark matter, and the physics shaping the observable universe.',
    description:
      'From the first light after the Big Bang to the gravitational choreography of galaxy clusters, Cosmos in Motion turns modern astrophysics into a vivid, approachable journey for curious readers.',
    authorBio: 'Dr. Elias Grant is an astrophysicist and science communicator focused on public astronomy education.'
  },
  {
    id: 'bk-003',
    title: 'Designing React Systems',
    author: 'Maya Chen',
    category: 'Technology',
    price: 39.99,
    stock: 25,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A practical guide to scalable React architecture, performance, routing, and state boundaries.',
    description:
      'This field manual explores composable UI architecture, resilient client state, route-level data flows, and measurable performance practices for teams shipping modern React applications.',
    authorBio: 'Maya Chen is a frontend platform engineer who builds design systems and high-scale React applications.'
  },
  {
    id: 'bk-004',
    title: 'Empires of Ink',
    author: 'Samuel Hart',
    category: 'History',
    price: 21.75,
    stock: 8,
    rating: 4.5,
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A sweeping history of manuscripts, trade routes, libraries, and the people who protected knowledge.',
    description:
      'Empires of Ink follows the movement of written culture across continents, revealing how scribes, merchants, translators, and librarians shaped the political memory of civilizations.',
    authorBio: 'Samuel Hart is a historian specializing in book history, archives, and cultural preservation.'
  },
  {
    id: 'bk-005',
    title: 'The Compounding Company',
    author: 'Priya Raman',
    category: 'Business',
    price: 28,
    stock: 15,
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Lessons on durable growth, capital allocation, and building companies that age well.',
    description:
      'A thoughtful business playbook about disciplined strategy, focused teams, durable customer value, and the operating habits that allow companies to compound advantage over time.',
    authorBio: 'Priya Raman advises founders and operators on strategy, pricing, and long-term business design.'
  },
  {
    id: 'bk-006',
    title: 'Deep Work Rituals',
    author: 'Jon Bell',
    category: 'Self-Development',
    price: 17.25,
    stock: 32,
    rating: 4.4,
    cover: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A grounded handbook for building focus, better routines, and creative endurance.',
    description:
      'Deep Work Rituals gives readers practical systems for attention, planning, digital boundaries, and sustainable progress without turning personal growth into another source of noise.',
    authorBio: 'Jon Bell is a productivity researcher and coach who studies creative routines and behavior change.'
  },
  {
    id: 'bk-007',
    title: 'The Algorithmic Garden',
    author: 'Leah Stone',
    category: 'Technology',
    price: 34.95,
    stock: 5,
    rating: 4.3,
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'An accessible introduction to algorithms through patterns, tradeoffs, and visual thinking.',
    description:
      'By comparing algorithms to gardens that must be pruned, watered, and adapted, this book makes data structures and computational tradeoffs feel tangible and memorable.',
    authorBio: 'Leah Stone teaches computer science with a focus on visual explanation and humane technical education.'
  },
  {
    id: 'bk-008',
    title: 'Letters from Alexandria',
    author: 'Amira Soliman',
    category: 'Fiction',
    price: 16.5,
    stock: 0,
    rating: 4.2,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'A coastal family saga told through letters, recipes, and secrets crossing three generations.',
    description:
      'Set between Alexandria and London, this warm, textured novel traces a family through migration, inheritance, love, and the fragile objects that carry memory across distance.',
    authorBio: 'Amira Soliman writes fiction about families, cities, and the emotional geography of migration.'
  }
];

export const mockOrders = [
  {
    id: 'ORD-1042',
    customer: 'Mariam Hassan',
    total: 73.48,
    status: 'Paid',
    date: '2026-05-01',
    items: 3
  },
  {
    id: 'ORD-1041',
    customer: 'Omar Farouk',
    total: 39.99,
    status: 'Processing',
    date: '2026-04-29',
    items: 1
  },
  {
    id: 'ORD-1040',
    customer: 'Lina Morgan',
    total: 106.7,
    status: 'Shipped',
    date: '2026-04-27',
    items: 4
  }
];
