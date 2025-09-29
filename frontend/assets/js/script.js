document.addEventListener("DOMContentLoaded", function () {
  // Tab Login/Register
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    });
  }

  // Produk Detail
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const products = {
    "baju-elegan": {
      name: "Baju Elegan",
      price: 249000,
      image: "assets/img/baju1.jpg",
      description: "Gaun elegan dengan potongan klasik dan bahan premium."
    },
    "baju-kasual": {
      name: "Baju Kasual",
      price: 189000,
      image: "assets/img/baju2.jpg",
      description: "Baju kasual nyaman dipakai sehari-hari."
    },
    "baju-formal": {
      name: "Baju Formal",
      price: 299000,
      image: "assets/img/baju3.jpg",
      description: "Baju formal yang tetap stylish dan nyaman dipakai."
    }
  };

  const product = products[productId];

  console.log("Product ID:", productId);
  console.log("Product Data:", product);

  if (product) {
    const imgEl = document.getElementById('productImage');
    const nameEl = document.getElementById('productName');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');

    if (imgEl && nameEl && priceEl && descEl) {
      imgEl.src = product.image;
      imgEl.alt = product.name;
      nameEl.textContent = product.name;
      priceEl.textContent = "Rp" + product.price.toLocaleString("id-ID");
      descEl.textContent = product.description;
    }
  } else {
    const detailEl = document.querySelector('.product-detail');
    if (detailEl) {
      detailEl.innerHTML = "<p>Produk tidak ditemukan.</p>";
    }
  }

  // Shopping Cart
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn && product) {
    addToCartBtn.addEventListener("click", () => {
      const size = document.getElementById("sizeSelect").value;
      const quantity = parseInt(document.getElementById("quantityInput").value);

      if (!size || quantity <= 0) {
        alert("Pilih ukuran dan jumlah yang valid.");
        return;
      }

      const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(item => item.id === productId && item.size === size);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Item ditambahkan:", cartItem);
      console.log("Cart setelah update:", cart);
      console.log("Tombol diklik");
      alert("Produk ditambahkan ke keranjang!");

      // Reset form (opsional)
      document.getElementById("sizeSelect").value = "";
      document.getElementById("quantityInput").value = 1;
    });
  }
});