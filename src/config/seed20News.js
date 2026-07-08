const { sequelize, Article, Category, Author } = require('../models');
const slugify = require('slugify');

const newsData = [
  {
    title: "Global Markets Rally as Tech Stocks Hit Record Highs",
    excerpt: "Investors saw unprecedented gains today as major technology companies reported stellar quarterly earnings, driving global markets up.",
    featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "New Breakthrough in Renewable Energy announced by Scientists",
    excerpt: "A team of international researchers have discovered a highly efficient method for storing solar energy that could revolutionize the grid.",
    featured_image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Championship Finals: Underdogs Secure Historic Victory",
    excerpt: "In a stunning upset, the city's beloved underdogs defeated the reigning champions in a nail-biting finish that had fans on the edge of their seats.",
    featured_image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Mars Rover Discovers Ancient Riverbed Network",
    excerpt: "NASA's latest rover has beamed back images proving that Mars once hosted a vast, flowing network of rivers across its southern hemisphere.",
    featured_image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Local Elections See Record Voter Turnout Amidst Controversies",
    excerpt: "Citizens flocked to the polls in record numbers this morning following a week of intense debate over the city's new zoning policies.",
    featured_image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Next-Gen Electric Vehicle Boasts 1,000-Mile Range",
    excerpt: "Automotive startup ElectroDrive has unveiled a prototype vehicle utilizing solid-state batteries that claim to double the current industry standard range.",
    featured_image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Major Cybersecurity Breach Affects Millions of Users",
    excerpt: "A prominent cloud hosting provider has disclosed a severe vulnerability that resulted in unauthorized access to sensitive customer data.",
    featured_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Award-Winning Director Announces Surprise Retirement",
    excerpt: "After a decorated career spanning four decades, the acclaimed filmmaker says his upcoming epic will be his final project.",
    featured_image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Study Links Coffee Consumption to Longer Lifespan",
    excerpt: "A massive 10-year observational study suggests that drinking 2-3 cups of coffee daily is associated with a reduced risk of cardiovascular disease.",
    featured_image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "City Council Approves Funding for Massive Urban Park",
    excerpt: "The ambitious 'Green Heart' project has finally been greenlit, transforming 50 acres of abandoned industrial land into a public oasis.",
    featured_image: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Breakthrough AI Model Can Predict Weather with 99% Accuracy",
    excerpt: "Meteorologists are calling it a game-changer as a new artificial intelligence system demonstrates unparalleled precision in forecasting severe storms.",
    featured_image: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Historical Artifact Unearthed During Subway Construction",
    excerpt: "Workers expanding the downtown metro line stumbled upon a perfectly preserved artifact dating back to the Roman Empire.",
    featured_image: "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Global Supply Chain Issues Expected to Ease by Q3",
    excerpt: "Economists predict relief for consumers as international shipping bottlenecks begin to clear up significantly.",
    featured_image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Legendary Rock Band Announces Final Global Reunion Tour",
    excerpt: "Fans are ecstatic as the iconic band members have resolved their decades-long feud for one last series of stadium shows.",
    featured_image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Healthcare Bill Passes Following Marathon Senate Session",
    excerpt: "After 24 hours of non-stop debate, lawmakers reached a bipartisan consensus on the controversial healthcare reform package.",
    featured_image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Tech Giant Unveils Revolutionary Augmented Reality Glasses",
    excerpt: "The highly anticipated wearable device promises to seamlessly blend digital information with the physical world in high definition.",
    featured_image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "National Football League Announces Format Changes",
    excerpt: "In an effort to increase player safety and game speed, the league has introduced major rule modifications for the upcoming season.",
    featured_image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Stock Market Plunges Amid Interest Rate Hike Fears",
    excerpt: "The Dow dropped 500 points at the opening bell as investors reacted to rumors of an impending intervention by the Central Bank.",
    featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "World's Largest Vertical Farm Opens in Desert City",
    excerpt: "Utilizing advanced hydroponics and LED lighting, this towering facility aims to produce 10,000 tons of leafy greens annually.",
    featured_image: "https://images.unsplash.com/photo-1530836369250-ef71a35921bf?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Scientists Synthesize Room-Temperature Superconductor",
    excerpt: "If validated, this monumental breakthrough in physics could lead to zero-loss power grids and ultra-fast levitating trains.",
    featured_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
  }
];

const seed20News = async () => {
  try {
    console.log('Starting massive article seeder...');
    
    // Check if connected
    await sequelize.authenticate();
    
    // Get available categories and authors
    const categories = await Category.findAll();
    const authors = await Author.findAll();

    if (categories.length === 0 || authors.length === 0) {
      console.log('Error: Please run `npm run seed` first to ensure there are categories and authors.');
      process.exit(1);
    }

    const createdArticles = [];

    for (let i = 0; i < newsData.length; i++) {
      const data = newsData[i];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      
      // Calculate a randomized date within the past week
      const publishDate = new Date();
      publishDate.setHours(publishDate.getHours() - (Math.random() * 168)); // up to 168 hours ago

      const article = await Article.create({
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 1000),
        excerpt: data.excerpt,
        content: `
          <h2>${data.title}</h2>
          <p><strong>This is a dynamically generated article demonstrating the rich text capabilities of the Big Breaking News India platform.</strong></p>
          <p>${data.excerpt}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <h3>The Core Details</h3>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          <blockquote>"This is one of the most significant developments in recent history," reported an inside source.</blockquote>
          <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        `,
        category_id: randomCategory.id,
        author_id: randomAuthor.id,
        is_published: true,
        is_breaking: Math.random() > 0.8, // 20% chance of being breaking
        is_featured: Math.random() > 0.8, // 20% chance of being featured
        published_at: publishDate,
        featured_image: data.featured_image
      });

      createdArticles.push(article);
      console.log(`Created: ${data.title}`);
    }

    console.log(`\n✅ Successfully seeded ${createdArticles.length} detailed articles with images!`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed 20 articles:', error);
    process.exit(1);
  }
};

seed20News();
