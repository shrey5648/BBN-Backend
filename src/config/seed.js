const { Category, Author, Article, User } = require('../models');

const seedData = async () => {
  try {
    console.log('Seeding initial data...');

    // Categories
    const categories = [
      { name: 'World', slug: 'world', color: '#2563eb' },
      { name: 'Politics', slug: 'politics', color: '#7c3aed' },
      { name: 'Health', slug: 'health', color: '#059669' },
      { name: 'Science', slug: 'science', color: '#0891b2' },
      { name: 'Lifestyle', slug: 'lifestyle', color: '#d97706' },
      { name: 'Sports', slug: 'sports', color: '#dc2626' },
      { name: 'Technology', slug: 'technology', color: '#4f46e5' },
      { name: 'Business', slug: 'business', color: '#065f46' },
    ];

    for (const cat of categories) {
      await Category.findOrCreate({ where: { slug: cat.slug }, defaults: cat });
    }

    // Default Admin
    await User.findOrCreate({
      where: { email: 'admin@bbn.in' },
      defaults: {
        name: 'Admin',
        password: 'password123', // Change in production!
        role: 'admin',
      }
    });

    // Default Author
    const [author] = await Author.findOrCreate({
      where: { slug: 'editorial-team' },
      defaults: {
        name: 'Editorial Team',
        bio: 'The editorial team of Big Breaking News India.',
        role: 'Editor',
      }
    });

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
