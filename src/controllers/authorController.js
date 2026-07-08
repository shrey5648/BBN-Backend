const { Author, Article } = require('../models');

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      order: [['name', 'ASC']]
    });
    res.status(200).json({ success: true, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    const articles = await Article.findAll({
      where: { author_id: author.id, is_published: true },
      order: [['published_at', 'DESC']],
      limit: 10
    });

    res.status(200).json({ success: true, data: { author, articles } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const { name, bio, avatar, email, twitter, linkedin } = req.body;
    const author = await Author.create({ name, bio, avatar, email, twitter, linkedin });
    res.status(201).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { name, bio, avatar, email, twitter, linkedin } = req.body;
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Author not found' });

    if (name) author.name = name;
    if (bio !== undefined) author.bio = bio;
    if (avatar !== undefined) author.avatar = avatar;
    if (email !== undefined) author.email = email;
    if (twitter !== undefined) author.twitter = twitter;
    if (linkedin !== undefined) author.linkedin = linkedin;
    
    await author.save();
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
