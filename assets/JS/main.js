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
    const description = createElement('p', 'text-capitalize mt-3 mb-1');
    description.textContent = product.description.trim().slice(0, 25) + '...';
    descriptionContainer.appendChild(description);
  
    const price = createElement('span', 'fw-bold d-block');
    price.textContent = '$' + product.price;
    descriptionContainer.appendChild(price);
  
    // Button Container
    const btnContainer = createElement('div', 'd-flex justify-content-around');
  
    const viewButton = createElement('a', 'btn btn-primary mt-3 view-product', {
        href: '#',
        'data-bs-toggle': 'modal',
        'data-bs-target': '#product',
        'data-index': index,
    });
    viewButton.textContent = 'Ver';
  
    const addToCartButton = createElement('a', 'btn btn-primary mt-3 add-to-cart', {
        href: '#',
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
    });
};

renderProducts()

  