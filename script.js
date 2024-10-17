const products = [
    { id: 1, name: "T-Shirt", price: 10, image: "images/products/product1.jpg" },
    { id: 2, name: "Jeans", price: 20, image: "images/products/product2.jpg" },
    { id: 3, name: "Jacket", price: 50, image: "images/products/product3.jpg" },
    { id: 4, name: "Hat", price: 15, image: "images/products/product4.jpg" },
    { id: 5, name: "Sweater", price: 30, image: "images/products/product5.jpg" },
    { id: 6, name: "Shorts", price: 25, image: "images/products/product6.jpg" },
    { id: 7, name: "Scarf", price: 12, image: "images/products/product7.jpg" },
    { id: 8, name: "Socks", price: 5, image: "images/products/product8.jpg" },
    { id: 9, name: "Coat", price: 70, image: "images/products/product9.jpg" },
    { id: 10, name: "Dress", price: 40, image: "images/products/product10.jpg" },
    { id: 11, name: "Shoes", price: 60, image: "images/products/product11.jpg" },
    { id: 12, name: "Bag", price: 35, image: "images/products/product12.jpg" },
];

let pocket = []; // Changed from cart to pocket

function renderProducts() {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-info">
                <h2 class="product-title">${product.name}</h2>
                <p class="product-price">$${product.price}</p>
                <button onclick="addToPocket(${product.id})" class="primary-btn">Add to Pocket</button>
            </div>
        </div>
    `).join('');
}

function addToPocket(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        pocket.push(product);
        updatePocketUI();
    }
}

function updatePocketUI() {
    const pocketCount = document.getElementById('pocketCount');
    const pocketItems = document.getElementById('pocketItems');
    const totalAmount = document.getElementById('totalAmount');

    pocketCount.textContent = pocket.length;
    pocketItems.innerHTML = pocket.map((item, index) => `
        <div class="pocket-item">
            <p>${item.name} - $${item.price}</p>
            <button onclick="removeFromPocket(${index})" class="remove-btn">Remove</button>
        </div>
    `).join('');

    const total = pocket.reduce((sum, item) => sum + item.price, 0);
    totalAmount.textContent = total.toFixed(2);
}

function removeFromPocket(index) {
    pocket.splice(index, 1);
    updatePocketUI();
}

function togglePocket() {
    document.getElementById('pocket').classList.toggle('open');
}

function showCheckoutModal() {
    document.getElementById('modal').style.display = 'block';
}

function hideCheckoutModal() {
    document.getElementById('modal').style.display = 'none';
}

function validatePhoneNumber(phone) {
    // Validates full phone number (minimum 10 digits)
    return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
}

function validateFullName(name) {
    // Validates full name (at least two words)
    return name.trim().split(' ').length >= 2;
}

function sendOrder(orderDetails) {
    const botToken = '7834140673:AAGHPwSyZvEe68ZA5EDgew-TghqoJVe4Z6o';
    const chatIds = ['7594509157', '6144942025'];

    let message = `New order from ${orderDetails.name}\nPhone: ${orderDetails.phone}\n\n`;
    orderDetails.items.forEach(item => {
        message += `Product: ${item.name}, Price: $${item.price}\n`;
    });
    message += `\nTotal: $${orderDetails.total}`;

    let promises = chatIds.map(chatId => {
        return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log(`Order successfully sent to chat ID ${chatId}`);
            } else {
                console.error(`Failed to send order to chat ID ${chatId}:`, data);
            }
        })
        .catch(error => {
            console.error(`Error sending order to chat ID ${chatId}:`, error);
        });
    });

    Promise.all(promises).then(() => {
        alert('Order processing complete! Please note that orders cannot be cancelled once placed.');
        pocket = [];
        updatePocketUI();
        hideCheckoutModal();
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pocketLink').addEventListener('click', togglePocket);
    document.getElementById('checkoutBtn').addEventListener('click', showCheckoutModal);
    document.getElementById('backToPocket').addEventListener('click', hideCheckoutModal);

    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if (!validateFullName(name)) {
            alert('Please enter your full name (first and last name)');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            alert('Please enter a valid phone number (minimum 10 digits)');
            return;
        }

        const total = parseFloat(document.getElementById('totalAmount').textContent);

        sendOrder({
            name: name,
            phone: phone,
            items: pocket,
            total: total
        });
    });

    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            hideCheckoutModal();
        }
    }

    renderProducts();
});
