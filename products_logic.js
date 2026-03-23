// products_logic.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Cart State Let's keep array of product IDs
  let cart = JSON.parse(localStorage.getItem('inquiryCart')) || [];

  // Animation Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // 1. Render Products
  function renderProducts(filter = "all", searchQuery = "") {
    grid.innerHTML = "";
    
    let filtered = productsData;
    
    if (filter !== "all") {
      filtered = filtered.filter(p => p.category === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filtered.length === 0) {
      const msg = document.createElement('h2');
      msg.textContent = "No parts found.";
      msg.style.gridColumn = "1 / -1";
      msg.style.textAlign = "center";
      msg.style.color = "#ff3c00";
      return grid.appendChild(msg);
    }

    filtered.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "product fade-in";
      card.style.animationDelay = `${index * 50}ms`;
      
      card.innerHTML = `
        <div class="img">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <h3>${product.title}</h3>
        <p class="price">${product.priceText}</p>
      `;
      
      card.addEventListener("click", () => openModal(product));
      
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  // Handle Search Param coming from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('q') || "";
  
  if (initialSearch) {
    const searchInputs = document.querySelectorAll('.search-box-modern input[name="q"]');
    searchInputs.forEach(input => input.value = initialSearch);
  }

  // Initial Render
  renderProducts("all", initialSearch);

  // 2. Category Filter Logic
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const currentSearch = document.querySelector('.search-box-modern input[name="q"]')?.value || "";
      renderProducts(btn.dataset.filter, currentSearch);
    });
  });

  // 3. Product Modal Logic
  const productModal = document.getElementById("productModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalCategory = document.getElementById("modalCategory");
  const addToCartBtn = document.getElementById("addToCartBtn");
  
  let currentProduct = null;
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  function openModal(product) {
    currentProduct = product;
    modalImg.src = product.image;
    modalTitle.textContent = product.title;
    modalDesc.textContent = product.description;
    modalCategory.textContent = "Category: " + product.category;
    
    // Add or update the View Full Details link
    let detailsLink = document.getElementById('viewDetailsLink');
    if (!detailsLink) {
      detailsLink = document.createElement('a');
      detailsLink.id = 'viewDetailsLink';
      detailsLink.style = "display:inline-block; margin-top:15px; color:#b45309; font-weight:700; text-decoration:none;";
      addToCartBtn.parentNode.appendChild(detailsLink);
    }
    detailsLink.href = "product_details.html?id=" + product.id;
    detailsLink.textContent = "View Full Specifications →";
    
    if (!isLoggedIn) {
      addToCartBtn.textContent = "Login to Add";
      addToCartBtn.disabled = false;
      addToCartBtn.style.opacity = "1";
    } else if (cart.includes(product.id)) {
      addToCartBtn.textContent = "Already in Inquiry";
      addToCartBtn.disabled = true;
      addToCartBtn.style.opacity = "0.5";
    } else {
      addToCartBtn.textContent = "Add to Inquiry";
      addToCartBtn.disabled = false;
      addToCartBtn.style.opacity = "1";
    }
    
    productModal.style.display = "flex";
  }

  document.getElementById("closeModal").addEventListener("click", () => {
    productModal.style.display = "none";
  });

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === productModal) productModal.style.display = "none";
    if (e.target === cartModal) cartModal.style.display = "none";
  });

  // 4. Cart System
  addToCartBtn.addEventListener("click", () => {
    if (!isLoggedIn) {
      window.location.href = "login.html";
      return;
    }

    if (currentProduct && !cart.includes(currentProduct.id)) {
      cart.push(currentProduct.id);
      localStorage.setItem('inquiryCart', JSON.stringify(cart));
      updateCartBadge();
      addToCartBtn.textContent = "Added ✓";
      addToCartBtn.disabled = true;
      addToCartBtn.style.opacity = "0.5";
    }
  });

  const floatingCart = document.getElementById("floatingCart");
  const cartBadge = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const cartItemList = document.getElementById("cartItemList");
  const closeCartModal = document.getElementById("closeCartModal");
  
  function updateCartBadge() {
    cartBadge.textContent = cart.length;
    if (cart.length > 0) {
      floatingCart.classList.add("bump");
      setTimeout(() => floatingCart.classList.remove("bump"), 300);
    }
  }

  floatingCart.addEventListener("click", () => {
    renderCartItems();
    cartModal.style.display = "flex";
  });

  closeCartModal.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  function renderCartItems() {
    cartItemList.innerHTML = "";
    if (cart.length === 0) {
      cartItemList.innerHTML = "<p>Your inquiry list is empty.</p>";
      return;
    }
    
    cart.forEach((id, index) => {
      const product = productsData.find(p => p.id === id);
      if (product) {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${product.image}" width="50" style="border-radius:5px" alt="${product.title}">
          <span style="flex:1; margin-left:15px">${product.title}</span>
          <button class="remove-btn" data-index="${index}">✖</button>
        `;
        cartItemList.appendChild(li);
      }
    });

    // Remove logic
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem('inquiryCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
      });
    });
  }

  document.getElementById("requestQuoteBtn").addEventListener("click", () => {
    if(cart.length === 0) {
      if (typeof showToast === "function") showToast("Please add items to your inquiry first!", "error");
      else alert("Please add items to your inquiry first!");
      return;
    }
    // Redirect to the new high-end quote checkout page!
    window.location.href = "quote_checkout.html";
  });

  // Initial cart update
  updateCartBadge();
});
