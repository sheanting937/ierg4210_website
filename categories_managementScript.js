//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await displayCategories();
    } catch (error) {
        console.error('Error initializing category management:', error);
        alert('An error occurred while initializing category management.');
    }

    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const categoryId = document.getElementById('categoryId').value;
            const categoryName = document.getElementById('categoryName').value;

            if (!categoryName) {
                alert('Please enter a category name.');
                return;
            }

            let url = 'http://localhost:3000/categories';
            let method = 'POST';
            if (categoryId) {
                url = `http://localhost:3000/categories/${categoryId}`;
                method = 'PUT';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categoryName })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error processing category:', errorData.error);
                    alert(`Error processing category: ${errorData.error}`);
                    return;
                }
                const data = await response.json();
                alert(data.message);
                addCategoryForm.reset();
                document.getElementById('categoryId').value = '';
                document.getElementById('submitButton').textContent = 'Add Category';
                await displayCategories();
            } catch (error) {
                console.error('Unexpected error while processing category:', error);
                alert('An unexpected error occurred while processing the category.');
            }
        });
    }
});

async function displayCategories() {
    try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching categories:', errorData.error);
            alert(`Error fetching categories: ${errorData.error}`);
            return;
        }
        const categories = await response.json();
        const categoryListDiv = document.getElementById('categoryList');
        categoryListDiv.innerHTML = '<h2>Existing Categories</h2>';
        if (categories.length === 0) {
            categoryListDiv.innerHTML += '<p>No categories found.</p>';
        } else {
            const ul = document.createElement('ul');
            categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.name;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    populateEditForm(category);
                });
                li.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/categories/${category.catid}`, {
                            method: 'DELETE'
                        });
                        if (!deleteResponse.ok) {
                            const deleteErrorData = await deleteResponse.json();
                            console.error('Error deleting category:', deleteErrorData.error);
                            alert(`Error deleting category: ${deleteErrorData.error}`);
                            return;
                        }
                        const deleteData = await deleteResponse.json();
                        alert(deleteData.message);
                        await displayCategories();
                    } catch (error) {
                        console.error('Unexpected error while deleting category:', error);
                        alert('An unexpected error occurred while deleting the category.');
                    }
                });
                li.appendChild(deleteButton);

                ul.appendChild(li);
            });
            categoryListDiv.appendChild(ul);
        }
    } catch (error) {
        console.error('Unexpected error in displayCategories function:', error);
        alert('An unexpected error occurred while fetching categories.');
    }
}

function populateEditForm(category) {
    document.getElementById('categoryId').value = category.catid;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('submitButton').textContent = 'Update Category';
}