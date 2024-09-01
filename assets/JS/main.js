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
        style: 'object-fit: contain;' // Ensures the image covers the container area
    });
  
    imgContainer.appendChild(img);
  
    // Heart Icon
    const heartIcon = createElement('span', 'position-absolute d-flex align-items-center justify-content-center text-primary fs-4');
    const heartElement = createElement('i', 'fas fa-heart');
    heartIcon.appendChild(heartElement);
    imgContainer.appendChild(heartIcon);
  
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
}


renderProducts();
