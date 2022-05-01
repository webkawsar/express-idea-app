// model
const Category = require('../models/Category');
const generateCategoryDoc = require('../helpers/generateCategoryDoc');

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
    const category = await Category.findById(id).populate({
        path: 'ideas',
        options: {
            sort: {
                createdAt: -1,
            },
        },
    });
    if (!category) return res.status(404).send({ success: false, message: 'Category Not Found' });

    const generateIdeas = [];
    category.ideas.forEach((idea) => {
        if (idea.status === 'public') {
            generateIdeas.push(generateIdeaDoc(idea));
        }
    });

    // Categories
    const allCategories = await Category.find();
    const categories = allCategories.map((cat) => generateCategoryDoc(cat));

    // Pagination
    const page = +req.query.page || 1;
    const itemPerPage = 2;
    const totalPublicIdeasCount = generateIdeas.length;
    const publicIdeas = generateIdeas.splice((page - 1) * itemPerPage, itemPerPage);

    res.render('ideas/index', {
        title: `All Ideas by ${category.category}`,
        ideas: publicIdeas,
        categoryRef: true,
        categoryName: category.category,
        categoryId: id,
        categories,
        currentPage: page,
        previousPage: page - 1,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        hasNextPage: page * itemPerPage < totalPublicIdeasCount,
        lastPage: Math.ceil(totalPublicIdeasCount / itemPerPage),
    });
};
