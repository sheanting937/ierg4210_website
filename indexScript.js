//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', async () => {
    const categoryList = document.getElementById('categoryList');
    try {
        const response = await fetch('http://localhost:3000/categories');
        const categories = await response.json();
        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `category.html?catid=${category.catid}`;
            a.textContent = category.name;
            li.appendChild(a);
            categoryList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});