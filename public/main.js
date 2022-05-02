/* eslint-disable no-undef */
const categoryForm = document.querySelector('#categoryForm');
const categoryInput = document.querySelector('#category');
const msg = document.querySelector('.msg');
const catList = document.querySelector('#catList');
// Read the CSRF token from the <meta> tag
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const showMessage = (res) => {
    if (res.success) {
        msg.innerHTML = `<div class="alert alert-success" role="alert">
                    ${res.message}
                </div>`;
    } else {
        msg.innerHTML = `<div class="alert alert-danger" role="alert">
                    ${res.message}
                </div>`;
    }
};

// eslint-disable-next-line consistent-return
const addCategory = async (data) => {
    try {
        const response = await fetch('/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                'CSRF-Token': token,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
};

const showCategories = (categories) => {
    const categoriesBadge = categories.map(
        ({ category }) => `<span class="badge bg-primary m-2 p-2">
                                ${category} <i style='cursor:pointer' data-name='${category}' class="fa-solid fa-trash ml-4"></i>
                            </span>`
    );
    if (catList) catList.innerHTML = categoriesBadge.join(' ');
};

const getCategories = async () => {
    try {
        const response = await fetch('/categories');
        const result = await response.json();

        if (result.success) {
            showCategories(result.categories);
        }
    } catch (error) {
        console.log(error);
    }
};
if (catList) {
    getCategories();
}

if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const catName = categoryInput.value;
            const result = await addCategory({ category: catName });

            if (result.success) {
                msg.innerHTML = `<div class="alert alert-success" role="alert">
                                    ${result.message}
                                </div>`;
                categoryInput.value = '';
                getCategories();
            } else {
                msg.innerHTML = `<div class="alert alert-danger" role="alert">
                                    ${result.message}
                                </div>`;
                categoryInput.value = '';
            }
        } catch (error) {
            showMessage({
                success: false,
                message: 'Internal Server Error',
            });
        }
    });
}

const deleteCategory = async (name) => {
    const response = await fetch(`/categories/${name}`, {
        method: 'DELETE',
        headers: {
            'CSRF-Token': token, // <-- is the csrf token as a header
        },
    });

    return response.json();
};

if (catList) {
    catList.addEventListener('click', async (e) => {
        if (e.target.dataset.name) {
            try {
                const result = await deleteCategory(e.target.dataset.name);
                if (result.success) {
                    msg.innerHTML = `<div class="alert alert-success" role="alert">
                                    ${result.message}
                                </div>`;
                    getCategories();
                } else {
                    msg.innerHTML = `<div class="alert alert-danger" role="alert">
                                    ${result.message}
                                </div>`;
                }
            } catch (error) {
                showMessage({
                    success: false,
                    message: 'Internal Server Error',
                });
            }
        }
    });
}

/** ************************************************************************************************
                                Like Comment Section
 ************************************************************************************************ */

const likeBtn = document.querySelector('#like');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const likeComment = document.querySelector('.like-comment');
const ideaId = likeComment?.dataset?.idea;

// eslint-disable-next-line consistent-return
const toggleLike = async (id) => {
    try {
        const response = await fetch(`/ideas/${id}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                'CSRF-Token': token,
            },
        });

        return response.json();
    } catch (error) {
        showMessage({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// load like count
const getLikeCount = async (id) => {
    try {
        const response = await fetch(`/ideas/${id}/likes`);
        const result = await response.json();
        likeCount.innerHTML = `(${result.count})`;
    } catch (error) {
        showMessage({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// load comment count
const getCommentCount = async (id) => {
    try {
        const response = await fetch(`/ideas/${id}/comments`);
        const result = await response.json();
        commentCount.innerHTML = `(${result.count})`;
    } catch (error) {
        showMessage({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
if (ideaId) {
    getLikeCount(ideaId);
    getCommentCount(ideaId);
}

// like button event handlers
if (likeBtn) {
    // eslint-disable-next-line consistent-return
    likeBtn.addEventListener('click', async () => {
        if (ideaId) {
            try {
                const result = await toggleLike(ideaId);
                showMessage(result);
                getLikeCount(ideaId);
            } catch (error) {
                showMessage({
                    success: false,
                    message: 'Internal Server Error',
                });
            }
        }
    });
}
