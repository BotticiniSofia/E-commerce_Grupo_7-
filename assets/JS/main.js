let cart = JSON.parse(localStorage.getItem('cart')) || [];

const fetchProducts = async () => {
    const products = await fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
  
    return products;
}

// Function to create and return a DOM element with specified attributes
const createElement = (tag, className, attributes = {}) => {
    const element = document.createElement(tag);

    if (className) element.className = className;

    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });

    return element;
};

// UPDATE CART BADGE
const updateCartUI = () => {
    const cartBadge = document.getElementById('cart-badge');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const totalItems = cart.reduce((total, product) => total + product.quantity, 0);

    cartBadge.textContent = totalItems;
};

// SAVE ON LOCAL STORAGE
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (product, quantity = 1) => {
    // Always refresh the cart from localStorage before adding a new item
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        // If the product already exists, increase its quantity
        existingProduct.quantity += quantity;
    } else {
        // Add the product to the cart with the specified quantity
        cart.push({ ...product, quantity });
    }

    saveCartToLocalStorage();
    updateCartUI();
    showSuccessAddToast();
};

// Function to initialize the cart UI when the page loads
const initializeCartUI = () => {
    updateCartUI();
    fillFavoritesModal();
};

// Function to remove a product from the cart
const removeFromCart = (productId) => {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the product with the matching ID
    cart = cart.filter(product => product.id !== productId);

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart badge
    updateCartUI();
};

// Function to fill the cart modal with products and add quantity controls
const fillCartModal = () => {
    const cartBody = document.getElementById('cart-body');
    const totalPriceElement = document.getElementById('total-price');

    // Clear the cart body first to avoid duplication
    cartBody.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let totalPrice = 0;

    cart.forEach(product => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = product.title;

        const categoryCell = document.createElement('td');
        categoryCell.textContent = product.category;

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${(product.price * product.quantity).toFixed(2)}`;

        // Quantity control cell
        const quantityCell = document.createElement('td');
        const quantityControl = createQuantityControl(product.id, product.quantity);
        quantityCell.appendChild(quantityControl);

        // Remove button cell
        const removeButtonCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Eliminar';

        removeButton.addEventListener('click', () => {
            removeFromCart(product.id);
            fillCartModal();
        });

        removeButtonCell.appendChild(removeButton);

        // Append cells to the row
        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(removeButtonCell);

        cartBody.appendChild(row);

        // Update total price
        totalPrice += product.price * product.quantity;
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
};

// Helper function to create a quantity control (counter)
const createQuantityControl = (productId, quantity) => {
    const container = document.createElement('div');
    container.className = 'd-flex align-items-center';

    const decrementButton = document.createElement('button');
    decrementButton.className = 'btn btn-sm btn-outline-secondary';
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', () => {
        updateProductQuantity(productId, -1);
    });

    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'mx-2';
    quantityDisplay.textContent = quantity;

    const incrementButton = document.createElement('button');
    incrementButton.className = 'btn btn-sm btn-outline-secondary';
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', () => {
        updateProductQuantity(productId, 1);
    });

    container.appendChild(decrementButton);
    container.appendChild(quantityDisplay);
    container.appendChild(incrementButton);

    return container;
};

// Function to update the product quantity in the cart
const updateProductQuantity = (productId, change) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product and update its quantity
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = Math.max(1, product.quantity + change); // Ensure quantity is at least 1
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart UI and modal
    updateCartUI();
    fillCartModal();
};

const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};

const saveFavorites = (favorites) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

const updateFavoritesBadge = () => {
    const favorites = getFavorites();

    const badge = document.querySelector('#favorites-badge');

    badge.textContent = favorites.length;
};

/**
 * Create an HTML code for card product with the details of a product.
 *
 * @param {Object} product - The product details.
 * @param {string} product.title - The title of the product.
 * @param {string} product.description - A description of the product.
 * @param {string} product.price - The price of the product.
 * @param {string} product.image - The URL of the product image.
 * @param {string} product.category - The category of the product
 * @param {number} index 
 * @returns {string} The HTML code
 */
const createProductCard = (product, index) => {
    const productCard = createElement('div', 'col-md-6 col-lg-4 col-xl-3 p-2');

    // Image Container with fixed height
    const imgContainer = createElement('div', 'product-img position-relative overflow-hidden', {
        style: 'height: 250px;' // Adjust the height as needed
    });

    // Image with Bootstrap class and object-fit cover
    const img = createElement('img', 'w-100 h-100', {
        src: product.image,
        alt: product.title,
        style: 'object-fit: contain;'
    });

    imgContainer.appendChild(img);

    // Heart Icon
    const heartIcon = createElement('span', 'position-absolute d-flex align-items-center justify-content-center text-primary fs-4');
    const heartElement = createElement('i', 'fas fa-heart', {
        'data-product-id': product.id // Store product ID for later use
    });
    heartIcon.appendChild(heartElement);
    imgContainer.appendChild(heartIcon);

    // Get favorites from localStorage
    const favorites = getFavorites();
    const isFavorited = favorites.some(fav => fav.id === product.id);
    heartElement.classList.add(isFavorited ? 'text-danger' : 'text-secondary');

    heartIcon.addEventListener('click', () => {
        let favorites = getFavorites();

        if (favorites.some(fav => fav.id === product.id)) {
            // Remove from favorites
            favorites = favorites.filter(fav => fav.id !== product.id);
            heartElement.classList.remove('text-danger');
            heartElement.classList.add('text-secondary');
        } else {
            // Add to favorites
            favorites.push(product);
            heartElement.classList.remove('text-secondary');
            heartElement.classList.add('text-danger');
        }

        saveFavorites(favorites);
        updateFavoritesBadge(); // Update the badge count
        updateHeartIcons();
        fillFavoritesModal();
    });

    productCard.appendChild(imgContainer);

    // Description Container
    const descriptionContainer = createElement('div', 'text-center');
    const title = createElement('p', 'text-capitalize mt-3 mb-1');
    title.textContent = product.title.trim().slice(0, 25) + '...';
    descriptionContainer.appendChild(title);

    const price = createElement('span', 'fw-bold d-block');
    price.textContent = '$' + product.price;
    descriptionContainer.appendChild(price);

    // Button Container
    const btnContainer = createElement('div', 'd-flex justify-content-around');

    const viewButton = createElement('a', 'btn btn-primary mt-3 view-product', {
        href: '#',
        'data-bs-toggle': 'modal',
        'data-bs-target': '#product-modal',
        'data-index': index,
    });
    viewButton.textContent = 'Ver';

    const addToCartButton = createElement('button', 'btn btn-primary mt-3 add-to-cart', {
        'data-index': index,
    });
    const shoppingCartIcon = createElement('i', 'fa fa-shopping-cart px-1');
    addToCartButton.appendChild(shoppingCartIcon);
    addToCartButton.appendChild(document.createTextNode('Agregar'));
    addToCartButton.onclick = () => addToCart(product);

    btnContainer.appendChild(viewButton);
    btnContainer.appendChild(addToCartButton);

    descriptionContainer.appendChild(btnContainer);
    productCard.appendChild(descriptionContainer);

    return productCard;
};

const renderProducts = async () => {
    const products = await fetchProducts();
    const productList = document.querySelector('.product-list');
 
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);

        productList.appendChild(productCard);

        productCard.querySelectorAll('.view-product').forEach(button => {
            button.addEventListener('click', function() {
                fillModalWithProduct(product);
            });
        });
    });
};

const getCategoryBadgeColor = (badge, category) => {
    // Remove previous color classes
    badge.classList.remove('text-bg-secondary', 'text-bg-warning', 'text-bg-success', 'text-bg-danger', 'text-bg-dark');

    // Set badge color based on category
    switch (category.toLowerCase()) {
        case 'electronics':
            badge.classList.add('text-bg-secondary');
            break;
        case 'jewelery':
            badge.classList.add('text-bg-warning');
            break;
        case "men's clothing":
            badge.classList.add('text-bg-dark');
            break;
        case "women's clothing":
            badge.classList.add('text-bg-danger');
            break;
        default:
            badge.classList.add('text-bg-success'); // Default color if no match
    }
};

/**
 * Fill the modal with the product details
 * 
 * @param {Object} product - The product details.
 * @param {string} product.title - The title of the product.
 * @param {string} product.description - A description of the product.
 * @param {string} product.price - The price of the product.
 * @param {string} product.image - The URL of the product image.
 * @param {string} product.category - The category of the product
 */
const fillModalWithProduct = (product) => {
    const modalImage = document.getElementById('modal-product-img');
    modalImage.src = product.image;
    modalImage.alt = product.title;

    // Apply the same style as in the dynamically created image
    modalImage.style.objectFit = 'contain';
    modalImage.style.width = '100%';
    modalImage.style.height = '100%';

    // Badge element
    const categoryBadge = document.getElementById('modal-product-category');
    getCategoryBadgeColor(categoryBadge, product.category);

    document.getElementById('modal-product-img').alt = product.title;
    document.querySelector('.card-title').textContent = product.title;
    document.querySelector('.card-text').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `$${product.price}`;
    document.getElementById('modal-product-category').textContent = `${product.category}`;

    let quantity = 1;
    const quantityDisplay = document.getElementById('modal-quantity');
    quantityDisplay.textContent = quantity;

    // Increase quantity
    document.getElementById('modal-increase-quantity').addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });

    // Decrease quantity, but don't go below 1
    document.getElementById('modal-decrease-quantity').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });

    const addToCartButton = document.getElementById('modal-add-to-cart');
    addToCartButton.onclick = () => addToCart(product, quantity);
}

const updateHeartIcons = () => {
    const favorites = getFavorites();
    const allHeartIcons = document.querySelectorAll('.fa-heart');

    allHeartIcons.forEach(icon => {
        const productId = parseInt(icon.getAttribute('data-product-id'), 10);
        if (favorites.some(fav => fav.id === productId)) {
            icon.classList.add('text-danger');
            icon.classList.remove('text-secondary');
        } else {
            icon.classList.add('text-secondary');
            icon.classList.remove('text-danger');
        }
    });
};


// Function to fill the favorites modal with favorite products
const fillFavoritesModal = () => {
    const favorites = getFavorites();
    const favoritesBody = document.getElementById('favorites-body');
    
    // Clear the current content of the table body
    favoritesBody.innerHTML = '';

    favorites.forEach(product => {
        const row = createElement('tr');
        
        const titleCell = createElement('td');
        titleCell.textContent = product.title;

        const categoryCell = createElement('td');
        categoryCell.textContent = product.category;

        const priceCell = createElement('td');
        priceCell.textContent = `$${product.price}`;

        const removeCell = createElement('td');
        const removeButton = createElement('button', 'btn btn-danger btn-sm');
        removeButton.textContent = 'Eliminar';
        removeButton.addEventListener('click', () => {
            // Remove from favorites
            let favorites = getFavorites();
            favorites = favorites.filter(fav => fav.id !== product.id);
            saveFavorites(favorites);

            // Update the heart icons in product cards
            updateHeartIcons();

            fillFavoritesModal();
            updateFavoritesBadge();
        });
        removeCell.appendChild(removeButton);

        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(priceCell);
        row.appendChild(removeCell);

        favoritesBody.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-section');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Muestra el mensaje de éxito
        responseMessage.textContent = '¡Enviado exitosamente!';
        responseMessage.style.display = 'block';
        responseMessage.style.opacity = 1;

        // Desvanece el mensaje después de 3 segundos
        setTimeout(function() {
            responseMessage.style.opacity = 0; 
            
            setTimeout(function() {
                responseMessage.style.display = 'none'; 
            }, 1000); 
        }, 3000); 
        form.reset();
    });
});

// Function to show a success toast notification
const showSuccessToast = () => {
    const toast = new bootstrap.Toast(document.getElementById('success-toast'));
    toast.show();
};

const showSuccessAddToast = () => {
    const toast = new bootstrap.Toast(document.getElementById('success-add-toast'));
    toast.show();
};

// Function to clear the cart from localStorage and update the UI
const clearCart = () => {
    localStorage.removeItem('cart');
    updateCartUI();
    fillCartModal(); // Clear the cart modal content
};

document.addEventListener('DOMContentLoaded', () => {
    initializeCartUI();
    renderProducts();
    updateFavoritesBadge();
    updateHeartIcons();

    // Handle the "Comprar" button click
    document.querySelector('#cart .btn-primary').addEventListener('click', () => {
        showSuccessToast();
        clearCart();
    });
});

// Event listener to open the cart modal and fill it with products
document.getElementById('cart').addEventListener('show.bs.modal', fillCartModal);
