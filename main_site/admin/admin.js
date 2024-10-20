document.addEventListener('DOMContentLoaded', () => {
    const productAdmin = new ProductAdmin();
    const introAnimation = new IntroAnimation();
    const settingsManager = new SettingsManager();
});

class ProductAdmin {
    constructor() {
        this.products = [];
        this.currentPage = 'dashboard';
        this.initializeEventListeners();
        this.loadProducts();
    }

    initializeEventListeners() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => this.changePage(item.getAttribute('data-page')));
        });

        document.getElementById('add-product-form').addEventListener('submit', (e) => this.handleAddProduct(e));
        document.getElementById('edit-product-form').addEventListener('submit', (e) => this.handleEditProduct(e));
    }

    changePage(page) {
        document.querySelector('.menu-item.active').classList.remove('active');
        document.querySelector(`.menu-item[data-page="${page}"]`).classList.add('active');

        document.querySelector('.page.active').classList.remove('active');
        const newPage = document.getElementById(`${page}-page`);
        newPage.classList.add('active');
        newPage.classList.add('fade-in');

        document.getElementById('page-title').textContent = this.capitalizeFirstLetter(page);

        this.currentPage = page;
        if (page === 'products') {
            this.renderProductsTable();
        } else if (page === 'dashboard') {
            this.updateDashboard();
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async loadProducts() {
        // In a real application, this would be an API call
        this.products = [
            { id: 1, name: 'Product 1', price: 19.99, status: 'active', description: 'Description 1', image: 'https://example.com/image1.jpg' },
            { id: 2, name: 'Product 2', price: 29.99, status: 'inactive', description: 'Description 2', image: 'https://example.com/image2.jpg' },
            { id: 3, name: 'Product 3', price: 39.99, status: 'active', description: 'Description 3', image: 'https://example.com/image3.jpg' },
        ];
        this.updateDashboard();
        this.renderProductsTable();
    }

    updateDashboard() {
        const totalProducts = document.getElementById('total-products-value');
        const activeProducts = document.getElementById('active-products-value');

        totalProducts.textContent = this.products.length;
        activeProducts.textContent = this.products.filter(p => p.status === 'active').length;

        anime({
            targets: [totalProducts, activeProducts],
            innerHTML: (el) => [0, el.innerHTML],
            round: 1,
            easing: 'easeInOutExpo',
            duration: 2000
        });
    }

    renderProductsTable() {
        const tableBody = document.querySelector('#products-table tbody');
        tableBody.innerHTML = '';

        this.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="productAdmin.editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="productAdmin.deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            row.classList.add('fade-in');
            tableBody.appendChild(row);
        });
    }

    handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProduct = {
            id: this.products.length + 1,
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            status: formData.get('status'),
            description: formData.get('description'),
            image: formData.get('image')
        };
        this.products.push(newProduct);
        this.updateDashboard();
        this.renderProductsTable();
        e.target.reset();
        this.showNotification('Product added successfully', 'success');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-description').value = product.description;
            document.getElementById('edit-product-image').value = product.image;
            document.getElementById('edit-product-status').value = product.status;
            this.openModal('edit-modal');
        }
    }

    handleEditProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id = parseInt(formData.get('id'));
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                id: id,
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                status: formData.get('status'),
                description: formData.get('description'),
                image: formData.get('image')
            };
            this.updateDashboard();
            this.renderProductsTable();
            this.closeModal('edit-modal');
            this.showNotification('Product updated successfully', 'success');
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.updateDashboard();
            this.renderProductsTable();
            this.showNotification('Product deleted successfully', 'success');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

class IntroAnimation {
    constructor() {
        this.intro = document.getElementById('intro-animation');
        this.title = this.intro.querySelector('h1');
        this.subtitle = this.intro.querySelector('p');
        this.playIntro();
    }

    playIntro() {
        anime.timeline({
            easing: 'easeOutExpo',
        })
        .add({
            targets: this.title,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000
        })
        .add({
            targets: this.subtitle,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000
        }, '-=500')
        .add({
            targets: this.intro,
            opacity: 0,
            duration: 1000,
            complete: () => {
                this.intro.style.display = 'none';
            }
        }, '+=1000');
    }
}

class SettingsManager {
    constructor() {
        this.settingsBar = document.querySelector('.settings-bar');
        this.settingsToggle = document.getElementById('settings-toggle');
        this.languageSelect = document.getElementById('language-select');
        this.themeSelect = document.getElementById('theme-select');
        this.fontSizeSelect = document.getElementById('font-size-select');
        this.animationSpeedSelect = document.getElementById('animation-speed-select');
        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeEventListeners() {
        this.settingsToggle.addEventListener('click', () => this.toggleSettingsBar());
        this.languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        this.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        this.fontSizeSelect.addEventListener('change', (e) => this.changeFontSize(e.target.value));
        this.animationSpeedSelect.addEventListener('change', (e) => this.changeAnimationSpeed(e.target.value));
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('shaos-settings')) || {};
        this.changeLanguage(settings.language || 'en');
        this.changeTheme(settings.theme || 'light');
        this.changeFontSize(settings.fontSize || 'medium');
        this.changeAnimationSpeed(settings.animationSpeed || 'normal');
    }

    saveSettings() {
        const settings = {
            language: this.languageSelect.value,
            theme: this.themeSelect.value,
            fontSize: this.fontSizeSelect.value,
            animationSpeed: this.animationSpeedSelect.value
        };
        localStorage.setItem('shaos-settings', JSON.stringify(settings));
    }

    toggleSettingsBar() {
        this.settingsBar.classList.toggle('active');
    }

    changeLanguage(language) {
        // Implement language change logic here
        console.log(`Language changed to: ${language}`);
        this.languageSelect.value = language;
        this.saveSettings();
    }

    changeTheme(theme) {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        this.themeSelect.value = theme;
        this.saveSettings();
    }

    changeFontSize(size) {
        document.body.className = document.body.className.replace(/\bfont-size-\S+/g, '');
        document.body.classList.add(`font-size-${size}`);
        this.fontSizeSelect.value = size;
        this.saveSettings();
    }

    changeAnimationSpeed(speed) {
        document.body.className = document.body.className.replace(/\banimation-speed-\S+/g, '');
        document.body.classList.add(`animation-speed-${speed}`);
        this.animationSpeedSelect.value = speed;
        this.saveSettings();
    }
}

// Global function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}