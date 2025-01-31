let users = JSON.parse(localStorage.getItem("users")) || [];
let authToken = localStorage.getItem("authToken");
let loggedInUser = localStorage.getItem("loggedInUser");
let productsData = [];

// Utility function to get multiple unique random elements from an array
const getUniqueRandomElements = (arr, num) => {
  if (num > arr.length) {
    console.warn("Requested more unique elements than available!");
    return [...arr]; // Return all available elements if num is too large
  }

  const uniqueElements = new Set();
  while (uniqueElements.size < num) {
    const randomElement = arr[Math.floor(Math.random() * arr.length)];
    uniqueElements.add(randomElement);
  }

  return [...uniqueElements];
};

document.addEventListener("DOMContentLoaded", () => {
  // If not logged in, redirect to the login page
  if (!loggedInUser) {
    alert("You must log in to access this page.");
    window.location.href = "../index.html"; // Redirect to login page
  }
});

// fetch all products
const fetchAndDisplayProducts = async () => {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "<p>Loading products...</p>"; // Arrays for random colors and sizes

  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    const colors = ["red", "blue", "black", "green", "yellow", "white"];
    const sizes = ["S", "M", "L", "XL", "XXL"];

    // Add random colors and sizes to each product
    productsData = products.map((product) => ({
      ...product,
      colors: getUniqueRandomElements(colors, 3), // Get 3 unique colors
      sizes: getUniqueRandomElements(sizes, 3), // Get 3 unique sizes
    }));
    // Call displayShopProducts after data is fetched
    displayShopProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    productsDiv.innerHTML = "<p>Failed to load products.</p>";
  }
};

// Display shop products
const displayShopProducts = () => {
  const productsDiv = document.getElementById("products");
  document.getElementById("title").innerHTML = "All Products";
  if (!productsData.length) {
    productsDiv.innerHTML = "<p>No products available to display.</p>";
    return;
  }
  console.log(productsData);

  productsDiv.innerHTML = productsData
    .map(
      (product) =>
        ` 
        <div class="box">
          <div class="item">
          <div class="single-image">
          <img src="${product.image}" alt="${product.title}" />
          </div>
            <div class="info">
              <div class="front-data">
                <p>$${product.price}</p> 
                <p>Size: ${product.sizes}</p>
              </div>
              <p >Colors:  ${product.colors
              .map(
                (color) =>
                  `<span id='color' style="background-color: ${color};"></span>`
              )
              .join("")}
               </p>
              <p>Rating: ${product.rating.rate}</p>
            </div>
          </div>
          <button onclick="addToCart(${product.id})">Add to Cart</button> 
        </div>
      `
    )
    .join("");
};

// Add to cart function
const addToCart = async (id) => {
  if (!loggedInUser) {
    alert("Please log in to add items to your cart.");
    return;
  }

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    const user = users.find((u) => u.email === loggedInUser);
    if (!user.cart) user.cart = [];

    const productIndex = user.cart.findIndex((item) => item.id === id);

    if (productIndex > -1) {
      user.cart[productIndex].quantity += 1;
    } else {
      user.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("users", JSON.stringify(users));
    alert(`${product.title} added to the cart!`);
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
};

/* Filter Data*/
document.querySelector(".filter-btn").addEventListener("click", () => {
  const selectedColorboxes = document.querySelectorAll(
    'input[name="color"]:checked'
  );
  const selectedColorValues = Array.from(selectedColorboxes).map(
    (checkbox) => checkbox.id
  );

  const ratingValue = document.getElementById("range").value;

  const selectedPriceboxes = document.querySelectorAll(
    'input[name="prange"]:checked'
  );
  const selectedPriceValues = Array.from(selectedPriceboxes).map(
    (checkbox) => checkbox.id
  );

  const selectedSizeboxes = document.querySelectorAll(
    'input[name="size"]:checked'
  );
  const selectedSizeValues = Array.from(selectedSizeboxes).map(
    (checkbox) => checkbox.id
  );
  console.log(selectedSizeValues);
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "<p>Loading products...</p>";
  try {
    // Filter products based on rating and price range
    const filteredProducts = productsData.filter((product) => {
      const meetsColor =
        !selectedColorValues.length ||
        selectedColorValues.some((color) => product.colors.includes(color));

      const meetsSize =
        !selectedSizeValues.length ||
        selectedSizeValues.some((size) => product.sizes.includes(size));

      const meetsPrice =
        !selectedPriceValues.length ||
        selectedPriceValues.some((range) => {
          if (range === "0-25")
            return product.price >= 0 && product.price <= 25;
          if (range === "25-50")
            return product.price > 25 && product.price <= 50;
          if (range === "50-100")
            return product.price > 50 && product.price <= 100;
          if (range === "100on") return product.price > 100;
        });

      const meetsRating = product.rating.rate >= ratingValue;
      console.log(meetsColor, meetsSize, meetsRating, meetsPrice);

      // Return true only if all conditions are met
      return meetsRating && meetsSize && meetsColor && meetsPrice;
    });

    // Map filtered products to HTML and display them
    productsDiv.innerHTML = filteredProducts
      .map(
        (product) => `
        <div class="box">
          <div class="item">
          <div class="single-image">
          <img src="${product.image}" alt="${product.title}" />
          </div>
            <div class="info">
              <div class="front-data">
                <p>$${product.price}</p> 
                <p>Size: ${product.sizes}</p>
              </div>
 <p >Colors:  ${product.colors
              .map(
                (color) =>
                  `<span id='color' style="background-color: ${color};"></span>`
              )
              .join("")}
               </p>              
              <p>Rating: ${product.rating.rate}</p>
            </div>
          </div>
          <button onclick="addToCart(${product.id})">Add to Cart</button> 
        </div>
      `
      )
      .join("");

    if (filteredProducts.length === 0) {
      productsDiv.innerHTML =
        "<p>No products found for the selected filters.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsDiv.innerHTML = "<p>Failed to load products.</p>";
  }
});

// Fetch products by category
const fetchProductsByCategory = async (category, Product_type) => {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "<p>Loading products...</p>";
  const colors = ["red", "blue", "black", "green", "yellow", "white"];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  try {
    const url =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${category}`;
    const res = await fetch(url);
    const products = await res.json();

    productsData = products.map((product) => ({
      ...product,
      colors: getUniqueRandomElements(colors, 3), // Get 3 unique colors
      sizes: getUniqueRandomElements(sizes, 3), // Get 3 unique sizes
    }));
    displayfilterProducts(productsData, Product_type);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    productsDiv.innerHTML = "<p>Failed to load products.</p>";
  }
};

// Display fetched products
const displayfilterProducts = (products, Product_type) => {
  const productsTitle = document.getElementById("title");
  productsTitle.innerHTML = Product_type;

  const productsDiv = document.getElementById("products");
  if (!products.length) {
    productsDiv.innerHTML = "<p>No products found.</p>";
    return;
  }
  console.log(productsData);
  productsDiv.innerHTML = products
    .map(
      (product) => `
      <div class="box">
        <div class="item">
        <div class="single-image">
        <img src="${product.image}" alt="${product.title}" />
        </div>
          <div class="info">
            <div class="front-data">
              <p>$${product.price}</p> 
              <p>Size: ${product.sizes}</p>
            </div>
            <p >Colors:  ${product.colors
              .map(
                (color) =>
                  `<span id='color' style="background-color: ${color};"></span>`
              )
              .join("")}
               </p>
            
            <p>Rating: ${product.rating.rate}</p>
          </div>
        </div>
        <button onclick="addToCart(${product.id})">Add to Cart</button> 
      </div>
    `
    )
    .join("");
};

document.addEventListener("DOMContentLoaded", () => {
  // Add button event listeners
  const buttons = document.querySelectorAll(".color-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => {
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
      });
      button.style.backgroundColor = "black";
      button.style.color = "white";
    });
  });
});

/* search Data*/
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase(); // Get the search term
  fetchProductsBySearch(query);
});

// Fetch products by Search
const fetchProductsBySearch = (query) => {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "<p>Loading products...</p>";
  try {
    query = query.toLowerCase().trim();
    const filteredProducts = query
      ? productsData.filter((product) =>
          product.title.toLowerCase().includes(query)
        )
      : productsData;

    // Map filtered products to HTML and display them
    productsDiv.innerHTML = filteredProducts
      .map(
        (product) => ` 
          <div class="box">
        <div class="item">
        <div class="single-image">
        <img src="${product.image}" alt="${product.title}" />
        </div>
          <div class="info">
            <div class="front-data">
              <p>$${product.price}</p> 
              <p>Size: ${product.sizes}</p>
            </div>
            <p >Colors:  ${product.colors
              .map(
                (color) =>
                  `<span id='color' style="background-color: ${color};"></span>`
              )
              .join("")}
               </p>
            <p>Rating: ${product.rating.rate}</p>
          </div>
        </div>
        <button onclick="addToCart(${product.id})">Add to Cart</button> 
      </div>
        `
      )
      .join("");

    if (filteredProducts.length === 0) {
      productsDiv.innerHTML = "<p>No products found.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsDiv.innerHTML = "<p>Failed to load products.</p>";
  }
};

// Initialize app
const init = () => {
  if (authToken && loggedInUser) {
    fetchAndDisplayProducts();
    displayShopProducts();
  }
};

init();
