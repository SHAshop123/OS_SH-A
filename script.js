// Initialize the pocket (cart) and its total
let pocketItems = [];
let pocketTotal = 0;

// Telegram chat configuration
const chatToken = '7834140673:AAHLw6xgmrr44NZD_BBBw1NlF5k4KRN3S9Q';
const chatIds = ['7594509157', '6144942025'];

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
function addToPocket(productName, productPrice) {
    const existingProduct = pocketItems.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        pocketItems.push({ name: productName, price: productPrice, quantity: 1 });
    }

    pocketTotal += productPrice;
    updatePocketUI();
    togglePocket(); // Show the pocket when adding items
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
            <button onclick="removeFromPocket('${item.name}')" class="secondary-btn">Remove</button>
        `;
        pocketItemsEl.appendChild(itemEl);
    });

    pocketTotalEl.innerText = `Total: ${formatSum(pocketTotal)}`;
    itemCountEl.innerText = pocketItems.reduce((total, item) => total + item.quantity, 0);
}

function removeFromPocket(productName) {
    const productIndex = pocketItems.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        const item = pocketItems[productIndex];
        pocketTotal -= item.price * item.quantity;
        pocketItems.splice(productIndex, 1);
        updatePocketUI();
    }
}

function togglePocket() {
    const pocket = document.querySelector(".pocket");
    pocket.classList.toggle("open");
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
        `• ${item.name}\n  Quantity: ${item.quantity}\n  Price: ${formatSum(item.price)}\n  Subtotal: ${formatSum(item.price * item.quantity)}`
    ).join('\n\n');

    const orderMessage = `
🛍️ <b>NEW ORDER #${orderId}</b> 🛍️
📅 ${orderDate}

👤 <b>Customer Details:</b>
• Name: ${userName}
• Phone: ${userPhone}
• Address: ${userAddress}

📦 <b>Order Items:</b>
${orderItems}

💰 <b>Total Amount:</b> ${formatSum(pocketTotal)}

🏷️ <b>Order Status:</b> New
──────────────
`;

    // Send order details to Telegram
    sendToTelegram(orderMessage);

    // Clear pocket and close modal
    alert(`Order #${orderId} placed successfully!`);
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
📨 <b>NEW CONTACT MESSAGE</b>
📅 ${contactDate}

👤 <b>Contact Details:</b>
• Name: ${name}
• Email: ${email}

💬 <b>Message:</b>
${message}
──────────────
`;

    sendToTelegram(contactMessage);
    alert("Message sent successfully!");
    closeModal("contactModal");
    this.reset();
});

function openCheckout() {
    if (pocketItems.length === 0) {
        alert("Your pocket is empty!");
        return;
    }
    openModal("checkoutModal");
}

// Initialize product images
const products = document.querySelectorAll('.product-card img');
products.forEach((img, index) => {
    img.src = `./imagess/product${index + 1}.jpg`;
});

// Set logo image
document.querySelector('.logo img').src = './imagess/logo.jpg';