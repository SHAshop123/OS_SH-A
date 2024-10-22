// Product data with categories
const products = [
    { id: 1, name: 'Casual T-Shirt', price: 100, image: './images/logo.jpg', category: 'Clothing' },
    { id: 2, name: 'Classic Jeans', price: 150, image: './images/logo.jpg', category: 'Clothing' },
    { id: 3, name: 'Sport Shoes', price: 200, image: './images/logo.jpg', category: 'Footwear' },
    { id: 4, name: 'Leather Jacket', price: 300, image: './images/logo.jpg', category: 'Clothing' },
    { id: 5, name: 'Winter Coat', price: 250, image: './images/logo.jpg', category: 'Clothing' },
    { id: 6, name: 'Summer Dress', price: 180, image: './images/logo.jpg', category: 'Clothing' },
    { id: 7, name: 'Running Shoes', price: 220, image: './images/logo.jpg', category: 'Footwear' },
    { id: 8, name: 'Casual Watch', price: 150, image: './images/logo.jpg', category: 'Accessories' },
    { id: 9, name: 'Leather Belt', price: 80, image: './images/logo.jpg', category: 'Accessories' },
    { id: 10, name: 'Sunglasses', price: 120, image: './images/logo.jpg', category: 'Accessories' },
    { id: 11, name: 'Backpack', price: 170, image: './images/logo.jpg', category: 'Bags' },
    { id: 12, name: 'Laptop Bag', price: 190, image: './images/logo.jpg', category: 'Bags' }
];

// Translations
const translations = {
    en: {
        addToPocket: 'Add to Cart',
        checkout: 'Checkout',
        total: 'Total',
        aboutUs: 'About Us',
        contactUs: 'Contact Us',
        allRightsReserved: 'All rights reserved',
        placeOrder: 'Place Order',
        sendMessage: 'Send Message'
    },
    ru: {
        addToPocket: 'Добавить в корзину',
        checkout: 'Оформить заказ',
        total: 'Итого',
        aboutUs: 'О нас',
        contactUs: 'Связаться с нами',
        allRightsReserved: 'Все права защищены',
        placeOrder: 'Разместить заказ',
        sendMessage: 'Отправить сообщение'
    },
    uz: {
        addToPocket: 'Savatga qo\'shish',
        checkout: 'Buyurtma berish',
        total: 'Jami',
        aboutUs: 'Biz haqimizda',
        contactUs: 'Bog\'lanish',
        allRightsReserved: 'Barcha huquqlar himoyalangan',
        placeOrder: 'Buyurtma berish',
        sendMessage: 'Xabar yuborish'
    }
};

// State management
let currentLanguage = 'en';
let activeCategory = 'all';
let maxPrice = 1000;
let pocketItems = [];

// Utility functions
function formatSum(amount) {
    return `${amount.toLocaleString()} sum`;
}

function updateItemCount() {
    const itemCount = document.getElementById('itemCount');
    itemCount.textContent = pocketItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Language handling
function changeLanguage(lang) {
    currentLanguage = lang;
    updateUI();
}

function updateUI() {
    document.querySelectorAll('[i18n]').forEach(element => {
        const key = element.getAttribute('i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    updateProductsUI();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        updateProductsUI(searchProducts(e.target.value));
    });
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) &&
        product.price <= maxPrice &&
        (activeCategory === 'all' || product.category === activeCategory)
    );
}

// Filter functionality
function initializeFilters() {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    const categoryFiltersContainer = document.getElementById('categoryFilters');
    
    categoryFiltersContainer.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${category === 'all' ? 'active' : ''}`;
        button.textContent = category;
        button.onclick = () => filterByCategory(category);
        categoryFiltersContainer.appendChild(button);
    });

    const priceRange = document.createElement('input');
    priceRange.type = 'range';
    priceRange.min = '0';
    priceRange.max = '1000';
    priceRange.value = maxPrice;
    priceRange.id = 'priceRange';
    
    priceRange.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        document.getElementById('priceValue').textContent = formatSum(maxPrice);
        updateProductsUI(searchProducts(document.getElementById('searchInput').value));
    });

    document.querySelector('.filter-section').appendChild(priceRange);
}

function filterByCategory(category) {
    activeCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === category);
    });
    updateProductsUI(searchProducts(document.getElementById('searchInput').value));
}

// Product display
function updateProductsUI(filteredProducts = products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${formatSum(product.price)}</p>
                <button class="primary-btn" onclick="addToPocket(${product.id})">
                    ${translations[currentLanguage].addToPocket}
                </button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Shopping cart functionality
function addToPocket(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = pocketItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        pocketItems.push({ ...product, quantity: 1 });
    }
    
    updatePocketUI();
    updateItemCount();
}

function removeFromPocket(productId) {
    pocketItems = pocketItems.filter(item => item.id !== productId);
    updatePocketUI();
    updateItemCount();
}

function updateQuantity(productId, delta) {
    const item = pocketItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updatePocketUI();
        updateItemCount();
    }
}

function updatePocketUI() {
    const pocketItemsContainer = document.getElementById('pocket-items');
    const pocketTotal = document.getElementById('pocketTotal');
    
    pocketItemsContainer.innerHTML = '';
    
    pocketItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'pocket-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${formatSum(item.price)} × ${item.quantity}</p>
            </div>
            <div class="item-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromPocket(${item.id})">×</button>
            </div>
        `;
        pocketItemsContainer.appendChild(itemElement);
    });
    
    const total = pocketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    pocketTotal.textContent = `${translations[currentLanguage].total}: ${formatSum(total)}`;
}

// Modal handling
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Pocket (Cart) toggle
function togglePocket() {
    document.getElementById('pocket').classList.toggle('open');
}

// Filter curtain toggle
function toggleFilters() {
    document.getElementById('filterCurtain').classList.toggle('open');
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeFilters();
    updateUI();
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});
