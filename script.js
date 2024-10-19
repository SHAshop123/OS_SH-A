// Initialize the pocket (cart) and its total
let pocketItems = [];
let pocketTotal = 0;

// Telegram chat configuration
const chatToken = '7834140673:AAHLw6xgmrr44NZD_BBBw1NlF5k4KRN3S9Q';
const chatIds = ['7594509157', '6144942025'];

// Product data
const products = [
    { id: 1, name: 'Casual T-Shirt', price: 100, image: './images/product1.jpg' },
    { id: 2, name: 'Classic Jeans', price: 150, image: './images/product2.jpg' },
    { id: 3, name: 'Sport Shoes', price: 200, image: './images/product3.jpg' },
    { id: 4, name: 'Leather Jacket', price: 300, image: './images/product4.jpg' },
    { id: 5, name: 'Winter Coat', price: 250, image: './images/product5.jpg' },
    { id: 6, name: 'Summer Dress', price: 180, image: './images/product6.jpg' },
];

// Language translations
const translations = {
    en: {
        about: 'About Us',
        contact: 'Contact Us',
        pocket: 'Pocket',
        aboutUs: 'About Us',
        aboutUsContent: 'Your about us content goes here. Describe your shop, your values, and your mission.',
        contactUs: 'Contact Us',
        name: 'Name:',
        email: 'Email:',
        message: 'Message:',
        sendMessage: 'Send Message',
        checkout: 'Checkout',
        fullName: 'Full Name:',
        phoneNumber: 'Phone Number:',
        deliveryAddress: 'Delivery Address:',
        placeOrder: 'Place Order',
        yourPocket: 'Your Pocket',
        close: 'Close',
        addToPocket: 'Add to Pocket',
        total: 'Total:',
        remove: 'Remove',
        allRightsReserved: 'All rights reserved.',
    },
    ru: {
        about: 'О нас',
        contact: 'Контакты',
        pocket: 'Корзина',
        aboutUs: 'О нас',
        aboutUsContent: 'Здесь размещается информация о вашем магазине. Опишите свой магазин, ценности и миссию.',
        contactUs: 'Свяжитесь с нами',
        name: 'Имя:',
        email: 'Эл. почта:',
        message: 'Сообщение:',
        sendMessage: 'Отправить сообщение',
        checkout: 'Оформить заказ',
        fullName: 'Полное имя:',
        phoneNumber: 'Номер телефона:',
        deliveryAddress: 'Адрес доставки:',
        placeOrder: 'Разместить заказ',
        yourPocket: 'Ваша корзина',
        close: 'Закрыть',
        addToPocket: 'Добавить в корзину',
        total: 'Итого:',
        remove: 'Удалить',
        allRightsReserved: 'Все права защищены.',
    },
    uz: {
        about: 'Biz haqimizda',
        contact: 'Aloqa',
        pocket: 'Savat',
        aboutUs: 'Biz haqimizda',
        aboutUsContent: 'Bu yerda sizning do\'koningiz haqida ma\'lumot joylashtiriladi. Do\'koningiz, qadriyatlaringiz va vazifangizni tasvirlab bering.',
        contactUs: 'Biz bilan bog\'laning',
        name: 'Ism:',
        email: 'Elektron pochta:',
        message: 'Xabar:',
        sendMessage: 'Xabar yuborish',
        checkout: 'Buyurtmani rasmiylashtirish',
        fullName: 'To\'liq ism:',
        phoneNumber: 'Telefon raqami:',
        deliveryAddress: 'Yetkazib berish manzili:',
        placeOrder: 'Buyurtma berish',
        yourPocket: 'Sizning savatingiz',
        close: 'Yopish',
        addToPocket: 'Savatga qo\'shish',
        total: 'Jami:',
        remove: 'Olib tashlash',
        allRightsReserved: 'Barcha huquqlar himoyalangan.',
    },
};

let currentLanguage = 'en';

// Function to change language
function changeLanguage(lang) {
    currentLanguage = lang;
    updateUI();
}

// Function to update UI with current language
function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLanguage][key] || key;
    });
    updateProductsUI();
    updatePocketUI();
}

// Function to update products UI
function updateProductsUI() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatSum(product.price)}</p>
                <button class="primary-btn" onclick="addToPocket(${product.id})">${translations[currentLanguage].addToPocket}</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Function to close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Format currency
function formatSum(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " sum";
}

// Get current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Pocket (Cart) handling
function addToPocket(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = pocketItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            pocketItems.push({ ...product, quantity: 1 });
        }
        pocketTotal += product.price;
        updatePocketUI();
        togglePocket(true);
    }
}

function updatePocketUI() {
    const pocketItemsEl = document.getElementById("pocket-items");
    const pocketTotalEl = document.getElementById("pocketTotal");
    const itemCountEl = document.getElementById("itemCount");

    pocketItemsEl.innerHTML = "";

    pocketItems.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.classList.add("pocket-item");
        itemEl.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>${formatSum(item.price * item.quantity)}</span>
            <button onclick="removeFromPocket(${item.id})" class="secondary-btn">${translations[currentLanguage].remove}</button>
        `;
        pocketItemsEl.appendChild(itemEl);
    });

    pocketTotalEl.innerHTML = `${translations[currentLanguage].total} ${formatSum(pocketTotal)}`;
    itemCountEl.innerText = pocketItems.reduce((total, item) => total + item.quantity, 0);
}

function removeFromPocket(productId) {
    const itemIndex = pocketItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const item = pocketItems[itemIndex];
        pocketTotal -= item.price * item.quantity;
        pocketItems.splice(itemIndex, 1);
        updatePocketUI();
    }
}

function togglePocket(open = false) {
    const pocket = document.getElementById("pocket");
    if (open) {
        pocket.classList.add("open");
    } else {
        pocket.classList.toggle("open");
    }
}

// Send message to multiple Telegram chats with better formatting
function sendToTelegram(message) {
    chatIds.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${chatToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => console.log('Message sent to', chatId, ':', data))
        .catch(error => console.error('Error sending to', chatId, ':', error));
    });
}

// Generate order ID
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Handle checkout form submission
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const userName = document.getElementById("userName").value;
    const userPhone = document.getElementById("userPhone").value;
    const userAddress = document.getElementById("userAddress").value;

    // Form validation
    if (!/^[A-Za-z\s]+$/.test(userName)) {
        alert("Please enter a valid name (letters only).");
        return;
    }

    if (!/^\d+$/.test(userPhone)) {
        alert("Please enter a valid phone number (numbers only).");
        return;
    }

    const orderId = generateOrderId();
    const orderDate = getCurrentDateTime();

    // Prepare order details with improved formatting
    const orderItems = pocketItems.map(item => 
        `• ${item.name}\n  ${translations[currentLanguage].quantity}: ${item.quantity}\n  ${translations[currentLanguage].price}: ${formatSum(item.price)}\n  ${translations[currentLanguage].subtotal}: ${formatSum(item.price * item.quantity)}`
    ).join('\n\n');

    const orderMessage = `
🛍️ <b>NEW ORDER #${orderId}</b> 🛍️
📅 ${orderDate}

👤 <b>${translations[currentLanguage].customerDetails}:</b>
• ${translations[currentLanguage].name} ${userName}
• ${translations[currentLanguage].phoneNumber} ${userPhone}
• ${translations[currentLanguage].deliveryAddress} ${userAddress}

📦 <b>${translations[currentLanguage].orderItems}:</b>
${orderItems}

💰 <b>${translations[currentLanguage].total}</b> ${formatSum(pocketTotal)}

🏷️ <b>${translations[currentLanguage].orderStatus}:</b> ${translations[currentLanguage].new}
──────────────
`;

    // Send order details to Telegram
    sendToTelegram(orderMessage);

    // Clear pocket and close modal
    alert(`${translations[currentLanguage].orderPlaced} #${orderId}`);
    pocketItems = [];
    pocketTotal = 0;
    updatePocketUI();
    closeModal("checkoutModal");
    this.reset();
});

// Handle contact form submission
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const message = document.getElementById("contactMessage").value;
    const contactDate = getCurrentDateTime();

    const contactMessage = `
📨 <b>${translations[currentLanguage].newContactMessage}</b>
📅 ${contactDate}

👤 <b>${translations[currentLanguage].contactDetails}:</b>
• ${translations[currentLanguage].name} ${name}
• ${translations[currentLanguage].email} ${email}

💬 <b>${translations[currentLanguage].message}:</b>
${message}
──────────────
`;

    sendToTelegram(contactMessage);
    alert(translations[currentLanguage].messageSent);
    closeModal("contactModal");
    this.reset();
});

function openCheckout() {
    if (pocketItems.length === 0) {
        alert(translations[currentLanguage].emptyPocket);
        return;
    }
    openModal("checkoutModal");
}

// Initialize the UI
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
