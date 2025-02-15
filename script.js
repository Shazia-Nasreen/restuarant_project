// Import the data from db.js
import db from './db.js';

const menuContainer = document.getElementById('menu');
const orderList = document.getElementById('orderList');
const submitBtn = document.getElementById('submitBtn');  // Submit order button
const searchBar = document.getElementById('searchBar'); // Search bar element
const filterButtons = document.querySelectorAll('.filter-btn'); // All filter category buttons
const featuredItemsContainer = document.getElementById('featuredItems'); // Featured Items container
const feedbackContainer = document.getElementById('feedbackContainer');  // Feedback container

let order = [];

// Function to display the menu items
function displayMenu(filteredItems) {
    menuContainer.innerHTML = ''; // Clear the menu container

    filteredItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('menu-item');
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.dsc}</p>
            <p><strong>$${item.price}</strong></p>
            <button class="add-to-order-btn" data-id="${item.id}">Add to Order</button>
        `;
        menuContainer.appendChild(div);
    });

    // Add event listeners to "Add to Order" buttons dynamically
    const addToOrderBtns = document.querySelectorAll('.add-to-order-btn');
    addToOrderBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            addToOrder(itemId);
        });
    });
}

// Function to filter items by category
function filterItems(category) {
    let filteredItems = [];

    if (category === 'all') {
        filteredItems = Object.values(db).flat();  // Combine all items from db
    } else {
        filteredItems = db[category] || [];
    }

    displayMenu(filteredItems);
}

// Function to add an item to the order
function addToOrder(itemId) {
    const item = Object.values(db).flat().find(item => item.id === itemId);
    if (item) {
        order.push(item);
        displayOrder();
    }
}

// Function to calculate and display the order with total cost
function displayOrder() {
    orderList.innerHTML = '';  // Clear the order list
    let totalCost = 0;
    
    // Display each item in the order
    order.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        orderList.appendChild(li);
        totalCost += item.price;
    });

    // Display the total cost
    const totalCostElement = document.createElement('li');
    totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    orderList.appendChild(totalCostElement);
}

// Function to handle the order submission
function submitOrder() {
    if (order.length === 0) {
        alert("Your order is empty.");
    } else {
        let totalCost = order.reduce((sum, item) => sum + item.price, 0);
        
        const tableNumber = Math.floor(Math.random() * 100) + 1;
        alert(`Your order has been submitted! Your table number is ${tableNumber}. Total Cost: $${totalCost.toFixed(2)}. Please sit at the table, and your food will be served soon.`);
        
        order = [];  // Clear the order after submission
        displayOrder();  // Update the order display
        showFeedbackIcons();  // Show the feedback options after order submission
    }
}

// Handle search functionality
searchBar.addEventListener('input', () => {
    const searchQuery = searchBar.value.toLowerCase();
    const allItems = Object.values(db).flat();
    const filteredItems = allItems.filter(item => item.name.toLowerCase().includes(searchQuery));
    displayMenu(filteredItems);
});

// Add event listeners to filter buttons dynamically
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        filterItems(category);
    });
});

// Add event listener for Submit Order button
if (submitBtn) {
    submitBtn.addEventListener('click', submitOrder);
}

// Function to display featured items of the day (3 random items)
function displayFeaturedItems() {
    const today = new Date().toLocaleDateString();  
    const featuredItems = getFeaturedItems(today); 
    featuredItemsContainer.innerHTML = '';  

    featuredItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('featured-item');
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.dsc}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
            <button class="add-to-order-btn" data-id="${item.id}">Add to Order</button>
        `;
        featuredItemsContainer.appendChild(div);
    });

    const addToOrderBtns = document.querySelectorAll('.add-to-order-btn');
    addToOrderBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            addToOrder(itemId);
        });
    });
}

// Function to get today's featured items (random selection)
function getFeaturedItems(today) {
    const storedItems = localStorage.getItem(today);
    if (storedItems) {
        return JSON.parse(storedItems);
    } else {
        const randomItems = getRandomItems(3); 
        localStorage.setItem(today, JSON.stringify(randomItems)); 
        return randomItems;
    }
}

// Function to get random items (e.g. 3 random items)
function getRandomItems(numItems) {
    const allItems = Object.values(db).flat();
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numItems);
}

// Function to show feedback icons after order submission
function showFeedbackIcons() {
    feedbackContainer.innerHTML = `
        <div class="feedback-icons">
            <span class="thumbs-up" onclick="submitFeedback('positive')">&#128077; Thumbs Up</span>
            <span class="thumbs-down" onclick="submitFeedback('negative')">&#128078; Thumbs Down</span>
        </div>
    `;
}

// Function to handle feedback submission
function submitFeedback(feedbackType) {
    let message = '';
    
    if (feedbackType === 'positive') {
        message = 'Thanks for your positive feedback! Your feedback is registered.';
    } else if (feedbackType === 'negative') {
        message = 'Thanks for your feedback! We value your opinion.';
    }
    
    showFeedbackMessage(message);
}

// Function to display the feedback message
function showFeedbackMessage(message) {
    const feedbackMessage = document.createElement('div');
    feedbackMessage.classList.add('feedback-message');
    feedbackMessage.textContent = message;

    document.body.appendChild(feedbackMessage);

    setTimeout(() => {
        feedbackMessage.remove();
    }, 3000);
}

// Display featured items when the page loads
displayFeaturedItems();

// Display the full menu by default (show 'all' items)
filterItems('all');
