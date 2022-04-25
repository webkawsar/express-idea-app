// model
const Category = require('../models/Category');

const generateIdeaDoc = require('../helpers/generateIdeaDoc');

exports.new = (req, res) => {
    res.render('admin/category', {
        title: 'Add a Category',
        path: '/categories',
    });
};
exports.create = async (req, res) => {
    const category = new Category(req.body);
    await category.save();

    res.status(200).send({ success: true, message: 'Category created successfully' });
};
exports.getAll = async (req, res) => {
    const categories = await Category.find();
    res.status(200).send({ success: true, categories });
};

// eslint-disable-next-line consistent-return
exports.delete = async (req, res) => {
    const { catName } = req.params;

    const category = await Category.findOneAndDelete({ category: catName });
    if (!category) return res.status(404).send({ success: false, message: 'Category Not Found' });

    res.status(200).send({ success: true, message: 'Category deleted successfully' });
};

// eslint-disable-next-line consistent-return
exports.getIdeas = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate('ideas');

    if (!category) return res.status(404).send({ success: false, message: 'Category Not Found' });

    const generateIdeas = [];
    category.ideas.forEach((idea) => {
        if (idea.status === 'public') {
            generateIdeas.push(generateIdeaDoc(idea));
        }
    });

    res.render('ideas/index', {
        title: `All Ideas by ${category.category}`,
        ideas: generateIdeas,
        categoryRef: true,
        categoryName: category.category,
    });
};
