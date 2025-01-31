let users = JSON.parse(localStorage.getItem("users")) || [];
let authToken = localStorage.getItem("authToken");
let loggedInUser = localStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", () => {
  // If not logged in, redirect to the login page
  if (!loggedInUser) {
    alert("You must log in to access this page.");
    window.location.href = "../index.html"; // Redirect to login page
  }
});

// Update quantity in cart
const updateQuantity = (index, quantity) => {
  const user = users.find((u) => u.email === loggedInUser);

  if (user && user.cart[index]) {
    const qty = parseInt(quantity);
    if (qty <= 0) {
      user.cart.splice(index, 1);
    } else {
      user.cart[index].quantity = qty;
    }

    localStorage.setItem("users", JSON.stringify(users));
    displayCartItems();
  }
};
console.log(users);

// Remove item from cart
const removeFromCart = (index) => {
  const user = users.find((u) => u.email === loggedInUser);
  if (user && user.cart) {
    user.cart.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    displayCartItems();
  }
};

// Display cart items
const displayCartItems = () => {
  const cartDiv = document.getElementById("cart-items");
  const cartSidebar = document.getElementById("total-sidebar");

  const user = users.find((u) => u.email === loggedInUser);

  if (!user || !user.cart || user.cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    cartSidebar.innerHTML = "<p>Total: $0.00</p>";
    return;
  }
  let totalCost = 0;
  cartDiv.innerHTML = user.cart
    .map((item, index) => {
      const itemTotal = item.quantity * item.price;
      totalCost += itemTotal; // Add to total cost

      return `
      <div class="item">
        <img src="${item.image}" alt="${item.title}" />
        <div class="info">
          <p>Title: ${item.title}</p>
          <p>Price: $${item.price}</p>
          <p>
            Quantity: 
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" />
          </p>
        </div>
        <button onclick="removeFromCart(${index})">Remove From Cart</button>
      </div>
    `;
    })
    .join("");
  cartSidebar.innerHTML = `
    ${user.cart
      .map(
        (item) => ` 
        <div id="total-product">
          <div class="data">
            <p>${item.quantity}</p>
            <p>${item.title}</p>
          </div>
          <div class="price">
            <p>$${item.price}</p>
          </div>
        </div>
      `
      )
      .join("")}

  <div class="total">
    <p>Total:</p>
    <p id="total_cost">$${totalCost.toFixed(2)}</p>
  </div>
`;
};

//checkout data
document.getElementById("rzp-button1").onclick = function (e) { 
  const totalCostElement = document.getElementById("total_cost");
  console.log(totalCostElement);
  
  const totalCost = parseFloat(totalCostElement.innerText.replace('$', '')) * 100; // Convert to paise
  
  console.log(totalCost); // For debugging
 const user = users.find((u) => u.email === loggedInUser);

  if (!user || user.cart.length === 0) {
    alert("Cart is empty");
    return;
  } 
  var options = {
  
     key: "rzp_test_PV1oQ0oMtgXOsq",
      amount: totalCost,// Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "MyShop Checkout",
    description: "Purchase Items",
    theme: {
      color: "#000",
    },
    image:
      "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
      handler: function (response) {
        console.log("Payment Successful!", response);
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        user.cart.splice(0, user.cart.length);
        localStorage.setItem("users", JSON.stringify(users));
        displayCartItems();
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "1234567890", // Replace with dynamic contact if available
      },
  };

  var rzpy1 = new Razorpay(options);
  rzpy1.open();
  // clear mycart - localStorage
  e.preventDefault();
};

// Initialize app
const init = () => {
  if (authToken && loggedInUser) {
    displayCartItems();
  }
};
init();
