require('dotenv').config();
const connectDB = require('./config/db');
const Manga = require('./models/Manga');
const Product = require('./models/Product');
const TranslationProject = require('./models/TranslationProject');

const ago = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const manga = [
  { "title": "Blade of the Last Dawn", "description": "A wandering swordsman guards a village from an ancient demon.", "genres": ["Action", "Fantasy"], "status": "ongoing", "rating": 9, "views": 128400, "latestChapter": 42, "featured": true, "editorsPick": true, "coverImage": "" },
  { "title": "Tokyo After Rain", "description": "Two strangers keep meeting on rainy nights in Tokyo.", "genres": ["Romance", "Drama"], "status": "completed", "rating": 8, "views": 96300, "latestChapter": 36, "featured": true, "editorsPick": false, "coverImage": "" },
  { "title": "Spirit Courier", "description": "A teen delivers letters between the living and the spirit world.", "genres": ["Fantasy", "Supernatural"], "status": "ongoing", "rating": 9, "views": 87500, "latestChapter": 28, "featured": false, "editorsPick": true, "coverImage": "" },
  { "title": "Last Inning", "description": "A struggling high school baseball team gets one final season.", "genres": ["Sports", "Drama"], "status": "completed", "rating": 8, "views": 61200, "latestChapter": 54, "featured": false, "editorsPick": false, "coverImage": "" },
  { "title": "Neon Circuit", "description": "Hackers in a cyberpunk city fight a corporation that controls memories.", "genres": ["Sci-Fi", "Action"], "status": "ongoing", "rating": 7, "views": 73800, "latestChapter": 19, "featured": true, "editorsPick": false, "coverImage": "" },
  { "title": "Ramen Detective", "description": "A ramen chef solves small-town mysteries one bowl at a time.", "genres": ["Mystery", "Comedy"], "status": "ongoing", "rating": 8, "views": 45100, "latestChapter": 23, "featured": false, "editorsPick": true, "coverImage": "" },
  { "title": "Moonlit Academy", "description": "A new student discovers her school trains young monster hunters.", "genres": ["Fantasy", "Action"], "status": "ongoing", "rating": 7, "views": 52900, "latestChapter": 31, "featured": false, "editorsPick": false, "coverImage": "" },
  { "title": "Quiet Orchard", "description": "A city girl inherits a failing apple orchard and a lot of secrets.", "genres": ["Slice of Life", "Drama"], "status": "completed", "rating": 9, "views": 39700, "latestChapter": 24, "featured": false, "editorsPick": true, "coverImage": "" },
  { "title": "Star Sailors", "description": "A ragtag crew sails a flying ship across the skies to find a lost island.", "genres": ["Adventure", "Sci-Fi"], "status": "ongoing", "rating": 8, "views": 68400, "latestChapter": 37, "featured": true, "editorsPick": false, "coverImage": "" },
  { "title": "Sunday Club", "description": "Five classmates start a club that does absolutely nothing useful.", "genres": ["Comedy", "Slice of Life"], "status": "completed", "rating": 7, "views": 28600, "latestChapter": 18, "featured": false, "editorsPick": false, "coverImage": "" }
];

const products =[
  { "name": "Fandom Graphic Tee", "description": "An oversized tee for your everyday fandom fit.", "price": 699, "category": "Clothing", "fandom": "Anime", "emoji": "👕", "image": "", "rating": 4.5, "featured": true },
  { "name": "Manga Panel Hoodie", "description": "A soft fleece hoodie printed with classic manga panels.", "price": 1799, "category": "Clothing", "fandom": "Manga", "emoji": "🧥", "image": "", "rating": 4.6, "featured": true },
  { "name": "Gamer Squad Cap", "description": "An adjustable cap with an embroidered controller logo.", "price": 499, "category": "Clothing", "fandom": "Gaming", "emoji": "🧢", "image": "", "rating": 4.1, "featured": false },
  { "name": "Hero Action Figure", "description": "A 15 cm poseable figure with a display stand.", "price": 2499, "category": "Collectibles", "fandom": "Anime", "emoji": "🦸", "image": "", "rating": 4.8, "featured": true },
  { "name": "Chibi Mini Figure Set", "description": "A set of 4 cute chibi figures in a collector box.", "price": 1299, "category": "Collectibles", "fandom": "Anime", "emoji": "🎎", "image": "", "rating": 4.4, "featured": false },
  { "name": "Manga Box Set Display", "description": "A wooden shelf stand for your favourite manga volumes.", "price": 1599, "category": "Collectibles", "fandom": "Manga", "emoji": "📚", "image": "", "rating": 4.3, "featured": false },
  { "name": "Retro Console Replica", "description": "A mini desk replica of a classic gaming console.", "price": 1999, "category": "Collectibles", "fandom": "Gaming", "emoji": "🎮", "image": "", "rating": 4.7, "featured": true },
  { "name": "Anime Enamel Pin Pack", "description": "A pack of 5 colourful enamel pins for bags and jackets.", "price": 349, "category": "Accessories", "fandom": "Anime", "emoji": "📌", "image": "", "rating": 4.2, "featured": false },
  { "name": "Manga Tote Bag", "description": "A sturdy canvas tote with a black and white manga print.", "price": 599, "category": "Accessories", "fandom": "Manga", "emoji": "👜", "image": "", "rating": 4.0, "featured": false },
  { "name": "Gaming Mouse Pad XL", "description": "A large anti-slip desk mat with pixel art.", "price": 899, "category": "Accessories", "fandom": "Gaming", "emoji": "🖱️", "image": "", "rating": 4.5, "featured": false },
  { "name": "Sakura Keychain", "description": "A metal keychain with a cherry blossom charm.", "price": 199, "category": "Accessories", "fandom": "Anime", "emoji": "🌸", "image": "", "rating": 3.9, "featured": false },
  { "name": "Poster Set of 6", "description": "Six glossy A3 posters from popular manga art styles.", "price": 799, "category": "Collectibles", "fandom": "Manga", "emoji": "🖼️", "image": "", "rating": 4.4, "featured": false }
];

const projects =[
  { "title": "Manga Chapter Localization", "description": "Help adapt dialogue and expressions for Indian readers while preserving the original tone.", "taskType": "Manga", "fromLanguage": "Japanese", "toLanguage": "English", "level": "Intermediate", "paid": true, "badge": "Popular" },
  { "title": "Translate a Short Manga Chapter", "description": "Translate a 20-page action chapter from Japanese to Hindi.", "taskType": "Manga", "fromLanguage": "Japanese", "toLanguage": "Hindi", "level": "Intermediate", "paid": true, "badge": "New" },
  { "title": "Punjabi Subtitles for a Short Story", "description": "Translate a short manga story into Punjabi for local readers.", "taskType": "Manga", "fromLanguage": "English", "toLanguage": "Punjabi", "level": "Beginner friendly", "paid": false, "badge": "" },
  { "title": "Review English Translation Quality", "description": "Read a translated chapter and mark awkward or incorrect lines.", "taskType": "Review", "fromLanguage": "Japanese", "toLanguage": "English", "level": "Intermediate", "paid": true, "badge": "Review" },
  { "title": "Review Hindi Dialogue Flow", "description": "Check that Hindi dialogue sounds natural and fits each character.", "taskType": "Review", "fromLanguage": "English", "toLanguage": "Hindi", "level": "Beginner friendly", "paid": false, "badge": "" },
  { "title": "Proofread a Romance Chapter", "description": "Fix spelling, grammar and punctuation in a finished English translation.", "taskType": "Proofreading", "fromLanguage": "Japanese", "toLanguage": "English", "level": "Beginner friendly", "paid": true, "badge": "New" },
  { "title": "Proofread Tamil Translation", "description": "Proofread a Tamil translation of a slice-of-life chapter.", "taskType": "Proofreading", "fromLanguage": "English", "toLanguage": "Tamil", "level": "Intermediate", "paid": true, "badge": "" },
  { "title": "Flexible Weekend Translation Tasks", "description": "Pick small translation tasks and finish them whenever you have time.", "taskType": "Manga", "fromLanguage": "Japanese", "toLanguage": "Hindi", "level": "Beginner friendly", "paid": false, "badge": "Flexible" }
];

(async () => {
  await connectDB();
  await Manga.deleteMany();
  await Product.deleteMany();
  await TranslationProject.deleteMany();
  await Manga.insertMany(manga);
  await Product.insertMany(products);
  await TranslationProject.insertMany(projects);
  console.log('Seeded: 6 manga, 6 products, 4 translation projects');
  process.exit(0);
})();