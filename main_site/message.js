// Constants for Telegram configuration
const TELEGRAM_BOT_TOKEN = '7834140673:AAEf4K0Sy0ymGo7DSJ4JK4dRbKjR_awdIO0';
const TELEGRAM_CHAT_IDS = ['6144942025', '7594509157'];
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('UZS', 'sum');
}

// Format the order items for the message
function formatOrderItems(items) {
    return items.map(item => 
        `${item.name} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');
}

// Calculate order total
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Validate phone number format
function validatePhoneNumber(phone) {
    // Accept formats: +998xxxxxxxxx or 998xxxxxxxxx
    const phoneRegex = /^(\+)?998[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// Format phone number consistently
function formatPhoneNumber(phone) {
    // Remove any non-digit characters and ensure it starts with 998
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('998') ? cleaned : `998${cleaned}`;
}

// Send order to Telegram
async function sendOrderToTelegram(orderData, items) {
    const total = calculateTotal(items);
    
    // Create message text
    const message = `🛍 New Order!\n
📦 Order Details:
${formatOrderItems(items)}

💰 Total: ${formatCurrency(total)}

👤 Customer Information:
Name: ${orderData.fullName}
📞 Phone: ${orderData.phoneNumber}
📍 Address: ${orderData.address}

⏰ Order Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Tashkent' })}`;

    // Send message to all configured chat IDs
    try {
        const sendPromises = TELEGRAM_CHAT_IDS.map(chatId => 
            fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            })
        );

        await Promise.all(sendPromises);
        return { success: true };
    } catch (error) {
        console.error('Failed to send order to Telegram:', error);
        return { success: false, error: 'Failed to send order notification' };
    }
}

// Process the order
async function processOrder(orderData) {
    try {
        // Basic validation
        if (!orderData.fullName || !orderData.phoneNumber || !orderData.address) {
            throw new Error('Please fill in all required fields');
        }

        // Validate phone number
        if (!validatePhoneNumber(orderData.phoneNumber)) {
            throw new Error('Please enter a valid Uzbekistan phone number');
        }

        // Format phone number
        orderData.phoneNumber = formatPhoneNumber(orderData.phoneNumber);

        // Get current cart items
        const cartItems = pocketItems; // Assuming pocketItems is globally accessible

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Your cart is empty');
        }

        // Send order to Telegram
        const result = await sendOrderToTelegram(orderData, cartItems);

        if (result.success) {
            // Clear the cart
            pocketItems = [];
            updatePocketUI();
            updateItemCount();
            
            // Close modals
            closeModal('checkoutModal');
            document.getElementById('pocket').classList.remove('open');

            // Show success message
            alert('Order placed successfully! We will contact you soon.');
        } else {
            throw new Error('Failed to process order. Please try again.');
        }

    } catch (error) {
        alert(error.message);
        return false;
    }
}

// Event listener for the order form
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.querySelector('#checkoutModal form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderData = {
                fullName: e.target.elements.fullName.value,
                phoneNumber: e.target.elements.phoneNumber.value,
                address: e.target.elements.address.value
            };

            await processOrder(orderData);
        });
    }
});

// Export functions for use in other modules
export {
    processOrder,
    validatePhoneNumber,
    formatPhoneNumber,
    formatCurrency
};
