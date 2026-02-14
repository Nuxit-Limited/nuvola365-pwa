// NUVOLA365 MSP PORTAL - COMPLETE WITH WORKING LINKS
// All links now actually work and open real Microsoft portals!

const MOCK_DATA = {
  users: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@acme.com',
      role: 'owner',
      licenses: ['M365 Business Premium'],
      status: 'active'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@acme.com',
      role: 'admin',
      licenses: ['M365 Business Premium', 'Windows 365'],
      status: 'active'
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@acme.com',
      role: 'user',
      licenses: ['M365 Business Basic'],
      status: 'active'
    }
  ],
  
  subscriptions: [
    {
      id: 'sub1',
      name: 'Microsoft 365 Business Premium',
      type: 'm365',
      status: 'active',
      licenses: 25,
      assigned: 18,
      pricePerUser: 15.60,
      billingPeriod: 'monthly',
      nextBillingDate: '2024-03-01',
      features: ['Office apps', 'Email', '1TB storage', 'Teams']
    },
    {
      id: 'sub2',
      name: 'Windows 365 Business',
      type: 'w365',
      status: 'active',
      licenses: 5,
      assigned: 5,
      pricePerUser: 24.00,
      billingPeriod: 'monthly',
      nextBillingDate: '2024-03-01',
      features: ['2vCPU', '4GB RAM', '128GB storage']
    },
    {
      id: 'sub3',
      name: 'Azure Virtual Desktop',
      type: 'avd',
      status: 'active',
      licenses: 10,
      assigned: 7,
      pricePerUser: 12.00,
      billingPeriod: 'monthly',
      nextBillingDate: '2024-03-01',
      features: ['Multi-session', 'Scalable', 'Secure']
    }
  ],
  
  invoices: [
    {
      id: 'INV-2024-02',
      date: '2024-02-01',
      amount: 1250.00,
      status: 'paid',
      dueDate: '2024-02-15'
    },
    {
      id: 'INV-2024-01',
      date: '2024-01-01',
      amount: 1250.00,
      status: 'paid',
      dueDate: '2024-01-15'
    },
    {
      id: 'INV-2023-12',
      date: '2023-12-01',
      amount: 980.00,
      status: 'paid',
      dueDate: '2023-12-15'
    }
  ],
  
  storeProducts: [
    {
      id: 'sku-m365-basic',
      category: 'm365',
      name: 'Microsoft 365 Business Basic',
      description: 'Web and mobile versions of Office apps',
      price: 4.20,
      billingPeriod: 'monthly',
      icon: 'fa-th',
      features: ['Web and mobile apps', 'Email', '1TB storage', 'Teams', 'SharePoint']
    },
    {
      id: 'sku-m365-standard',
      category: 'm365',
      name: 'Microsoft 365 Business Standard',
      description: 'Desktop Office apps with cloud services',
      price: 10.00,
      billingPeriod: 'monthly',
      icon: 'fa-th',
      popular: true,
      features: ['Desktop Office apps', 'Email', '1TB storage', 'Teams', 'Webinars']
    },
    {
      id: 'sku-m365-premium',
      category: 'm365',
      name: 'Microsoft 365 Business Premium',
      description: 'Advanced security and device management',
      price: 15.60,
      billingPeriod: 'monthly',
      icon: 'fa-th',
      popular: true,
      features: ['Everything in Standard', 'Advanced security', 'Device management', 'Intune']
    },
    {
      id: 'sku-w365-2c4gb',
      category: 'w365',
      name: 'Windows 365 Business (2vCPU/4GB)',
      description: 'Cloud PC for essential productivity',
      price: 24.00,
      billingPeriod: 'monthly',
      icon: 'fa-windows',
      features: ['2 vCPU', '4GB RAM', '128GB storage', 'Windows 11']
    },
    {
      id: 'sku-w365-2c8gb',
      category: 'w365',
      name: 'Windows 365 Business (2vCPU/8GB)',
      description: 'Enhanced performance Cloud PC',
      price: 32.00,
      billingPeriod: 'monthly',
      icon: 'fa-windows',
      features: ['2 vCPU', '8GB RAM', '256GB storage', 'Windows 11']
    },
    {
      id: 'sku-w365-4c16gb',
      category: 'w365',
      name: 'Windows 365 Business (4vCPU/16GB)',
      description: 'High-performance Cloud PC',
      price: 66.00,
      billingPeriod: 'monthly',
      icon: 'fa-windows',
      features: ['4 vCPU', '16GB RAM', '512GB storage', 'Windows 11']
    },
    {
      id: 'sku-avd-basic',
      category: 'avd',
      name: 'Azure Virtual Desktop',
      description: 'Multi-session remote desktop',
      price: 12.00,
      billingPeriod: 'monthly',
      icon: 'fa-server',
      features: ['Multi-session', 'Scalable', 'Pay-as-you-go', 'Secure']
    },
    {
      id: 'bundle-essential',
      category: 'bundles',
      name: 'Essential Workspace Bundle',
      description: 'M365 Basic - Perfect for small teams',
      price: 4.20,
      billingPeriod: 'monthly',
      icon: 'fa-box',
      features: ['M365 Business Basic', 'Everything you need to start']
    },
    {
      id: 'bundle-complete',
      category: 'bundles',
      name: 'Complete Workspace Bundle',
      description: 'M365 Premium + Windows 365',
      price: 35.60,
      regularPrice: 39.60,
      billingPeriod: 'monthly',
      icon: 'fa-box',
      popular: true,
      savings: 4.00,
      features: ['M365 Business Premium', 'Windows 365 (2vCPU/4GB)', 'Save £4/user']
    },
    {
      id: 'bundle-pro',
      category: 'bundles',
      name: 'Professional Workspace Bundle',
      description: 'M365 Premium + Windows 365 + AVD',
      price: 45.00,
      regularPrice: 51.60,
      billingPeriod: 'monthly',
      icon: 'fa-box',
      savings: 6.60,
      features: ['M365 Business Premium', 'Windows 365 (2vCPU/4GB)', 'Azure VD', 'Save £6.60/user']
    },
    {
      id: 'hw-dock',
      category: 'hardware',
      name: 'USB-C Docking Station',
      description: 'Universal dock with 11 ports',
      price: 149.99,
      billingPeriod: 'one-time',
      icon: 'fa-plug',
      features: ['11 ports', 'Dual 4K monitors', '100W power delivery', 'Universal']
    },
    {
      id: 'hw-monitor',
      category: 'hardware',
      name: '27" 4K Monitor',
      description: 'Professional display with USB-C',
      price: 449.99,
      billingPeriod: 'one-time',
      icon: 'fa-desktop',
      features: ['27" 4K IPS', 'USB-C hub', 'Height adjustable', 'VESA mount']
    },
    {
      id: 'hw-webcam',
      category: 'hardware',
      name: '4K Webcam with AI',
      description: 'Professional video calls',
      price: 199.99,
      billingPeriod: 'one-time',
      icon: 'fa-video',
      features: ['4K video', 'AI framing', 'Noise cancellation', 'HDR']
    }
  ]
};

const AppState = {
  currentView: 'landing',
  currentUser: null,
  currentOrg: null,
  cart: [],
  currentDashboardView: 'home'
};

// REAL MICROSOFT PORTAL URLS
const PORTAL_URLS = {
  m365: 'https://portal.office.com',
  windows365: 'https://windows.cloud.microsoft.com',
  avd: 'https://client.wvd.microsoft.com/arm/webclient',
  admin: 'https://admin.microsoft.com',
  azure: 'https://portal.azure.com'
};

function showView(viewName) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  
  const viewMap = {
    'landing': 'landingPage',
    'dashboard': 'dashboard',
    'signup': 'signupFlow',
    'provisioning': 'provisioningProgress'
  };
  
  const pageId = viewMap[viewName];
  if (pageId) {
    document.getElementById(pageId).classList.remove('hidden');
    AppState.currentView = viewName;
  }
}

function showDashboardView(viewName) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  const viewId = `${viewName}View`;
  const viewElement = document.getElementById(viewId);
  if (viewElement) {
    viewElement.classList.add('active');
    AppState.currentDashboardView = viewName;
  }
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    }
  });
}

function login(email, password) {
  AppState.currentUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: email,
    role: 'owner'
  };
  
  AppState.currentOrg = {
    id: 'org1',
    name: 'Acme Corporation',
    domain: 'acme.onmicrosoft.com'
  };
  
  document.getElementById('userName').textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
  document.getElementById('userEmail').textContent = AppState.currentUser.email;
  document.getElementById('orgName').textContent = AppState.currentOrg.name;
  document.getElementById('welcomeName').textContent = AppState.currentUser.firstName;
  
  loadDashboardData();
  showView('dashboard');
  showNotification('Welcome back!', 'Logged in successfully', 'success');
}

function logout() {
  AppState.currentUser = null;
  AppState.currentOrg = null;
  showView('landing');
  showNotification('Logged out', 'See you soon!', 'success');
}

function loadDashboardData() {
  document.getElementById('statSubscriptions').textContent = MOCK_DATA.subscriptions.length;
  document.getElementById('statUsers').textContent = MOCK_DATA.users.length;
  
  const totalCost = MOCK_DATA.subscriptions.reduce((sum, sub) => {
    return sum + (sub.licenses * sub.pricePerUser);
  }, 0);
  document.getElementById('statCost').textContent = `£${totalCost.toFixed(2)}`;
  
  loadHomeSubscriptions();
  loadSubscriptionsList();
  loadUsersList();
  loadStoreProducts('all');
  loadInvoices();
}

function loadHomeSubscriptions() {
  const container = document.getElementById('homeSubscriptionsList');
  container.innerHTML = MOCK_DATA.subscriptions.slice(0, 2).map(sub => createSubscriptionCard(sub)).join('');
}

function loadSubscriptionsList() {
  const container = document.getElementById('subscriptionsList');
  container.innerHTML = MOCK_DATA.subscriptions.map(sub => createSubscriptionCard(sub, true)).join('');
}

function createSubscriptionCard(sub, showAllActions = false) {
  const totalCost = (sub.licenses * sub.pricePerUser).toFixed(2);
  
  return `
    <div class="subscription-card glass-card">
      <div class="sub-header">
        <div>
          <h3>${sub.name}</h3>
          <div class="sub-meta">${sub.licenses} licenses • £${sub.pricePerUser}/user/month</div>
        </div>
        <span class="sub-badge ${sub.status}">${sub.status}</span>
      </div>
      
      <div class="sub-details">
        <div class="sub-detail-item">
          <div class="sub-detail-label">Total Licenses</div>
          <div class="sub-detail-value">${sub.licenses}</div>
        </div>
        <div class="sub-detail-item">
          <div class="sub-detail-label">Assigned</div>
          <div class="sub-detail-value">${sub.assigned}</div>
        </div>
        <div class="sub-detail-item">
          <div class="sub-detail-label">Available</div>
          <div class="sub-detail-value">${sub.licenses - sub.assigned}</div>
        </div>
        <div class="sub-detail-item">
          <div class="sub-detail-label">Monthly Cost</div>
          <div class="sub-detail-value">£${totalCost}</div>
        </div>
        <div class="sub-detail-item">
          <div class="sub-detail-label">Next Billing</div>
          <div class="sub-detail-value">${new Date(sub.nextBillingDate).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div class="sub-actions">
        <button class="btn-sm" onclick="manageSubscription('${sub.id}')">
          <i class="fas fa-cog"></i> Manage
        </button>
        ${showAllActions ? `
          <button class="btn-sm" onclick="addLicenses('${sub.id}')">
            <i class="fas fa-plus"></i> Add Licenses
          </button>
          <button class="btn-sm" onclick="viewDetails('${sub.id}')">
            <i class="fas fa-info-circle"></i> Details
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

function loadUsersList() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = MOCK_DATA.users.map(user => `
    <tr>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td style="text-transform: capitalize;">${user.role}</td>
      <td>${user.licenses.join(', ')}</td>
      <td><span class="user-status ${user.status}">${user.status}</span></td>
      <td>
        <button class="btn-sm" onclick="editUser('${user.id}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function loadStoreProducts(category) {
  const container = document.getElementById('storeProducts');
  
  const filtered = category === 'all' 
    ? MOCK_DATA.storeProducts 
    : MOCK_DATA.storeProducts.filter(p => p.category === category);
  
  container.innerHTML = filtered.map(product => `
    <div class="product-card glass-card">
      <div class="product-icon">
        <i class="fas ${product.icon}"></i>
      </div>
      ${product.popular ? '<div class="product-badge">Popular</div>' : ''}
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      
      <div class="product-price">
        £${product.price.toFixed(2)}
        <span>/${product.billingPeriod === 'monthly' ? 'user/mo' : 'one-time'}</span>
      </div>
      
      ${product.regularPrice ? `
        <div style="text-decoration: line-through; color: #999; font-size: 0.875rem; margin-bottom: 0.5rem;">
          Was £${product.regularPrice.toFixed(2)}
        </div>
      ` : ''}
      
      <ul class="product-features">
        ${product.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      
      <button class="btn-add-cart" onclick="addToCart('${product.id}')">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  `).join('');
}

function loadInvoices() {
  const tbody = document.getElementById('invoicesTableBody');
  tbody.innerHTML = MOCK_DATA.invoices.map(inv => `
    <tr>
      <td>${inv.id}</td>
      <td>${new Date(inv.date).toLocaleDateString()}</td>
      <td>£${inv.amount.toFixed(2)}</td>
      <td><span class="invoice-status ${inv.status}">${inv.status}</span></td>
      <td>
        <button class="btn-sm" onclick="downloadInvoice('${inv.id}')">
          <i class="fas fa-download"></i> Download
        </button>
      </td>
    </tr>
  `).join('');
}

function addToCart(productId) {
  const product = MOCK_DATA.storeProducts.find(p => p.id === productId);
  if (!product) return;
  
  AppState.cart.push({
    productId: productId,
    name: product.name,
    price: product.price,
    quantity: 1
  });
  
  updateCartCount();
  showNotification('Added to cart', `${product.name} added`, 'success');
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = AppState.cart.length;
}

// MAKE QUICK LAUNCH BUTTONS ACTUALLY WORK!
function launchPortal(portal) {
  const url = PORTAL_URLS[portal];
  if (url) {
    window.open(url, '_blank');
    showNotification('Launching...', `Opening ${portal.toUpperCase()} in new tab`, 'success');
  }
}

let mockProgress = 0;
let provisioningInterval = null;

function startProvisioning(formData) {
  showView('provisioning');
  mockProgress = 0;
  
  const steps = [
    { name: 'Validation', desc: 'Verifying your information' },
    { name: 'Create Tenant', desc: 'Setting up Microsoft 365 tenant' },
    { name: 'Order Licenses', desc: 'Ordering selected licenses' },
    { name: 'Assign Licenses', desc: 'Assigning licenses to users' },
    { name: 'Configure', desc: 'Applying security settings' }
  ];
  
  const stepsList = document.getElementById('stepsList');
  stepsList.innerHTML = steps.map((step, i) => `
    <div class="step-item pending" id="step-${i}">
      <div class="step-item-icon">
        <i class="fas fa-circle"></i>
      </div>
      <div class="step-item-text">${step.name}</div>
    </div>
  `).join('');
  
  provisioningInterval = setInterval(() => {
    mockProgress += 5;
    
    if (mockProgress >= 100) {
      clearInterval(provisioningInterval);
      completeProvisioning(formData);
      return;
    }
    
    document.getElementById('progressFill').style.width = `${mockProgress}%`;
    document.getElementById('progressPercentage').textContent = `${mockProgress}%`;
    
    const currentStepIndex = Math.floor(mockProgress / 20);
    if (currentStepIndex < steps.length) {
      document.getElementById('currentStepTitle').textContent = steps[currentStepIndex].name;
      document.getElementById('currentStepDesc').textContent = steps[currentStepIndex].desc;
      
      steps.forEach((step, i) => {
        const stepEl = document.getElementById(`step-${i}`);
        if (i < currentStepIndex) {
          stepEl.className = 'step-item completed';
          stepEl.querySelector('.step-item-icon').innerHTML = '<i class="fas fa-check"></i>';
        } else if (i === currentStepIndex) {
          stepEl.className = 'step-item running';
          stepEl.querySelector('.step-item-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
      });
    }
  }, 500);
}

function completeProvisioning(formData) {
  login(formData.email, formData.password);
  showNotification(
    'Workspace Created!',
    `Welcome to Nuvola365, ${formData.firstName}!`,
    'success'
  );
}

function manageSubscription(id) {
  showNotification('Manage Subscription', `Opening management for subscription ${id}`, 'success');
}

function addLicenses(id) {
  showNotification('Add Licenses', 'This would open license purchase flow', 'success');
}

function viewDetails(id) {
  showNotification('View Details', 'This would show detailed subscription info', 'success');
}

function editUser(id) {
  showNotification('Edit User', `Editing user ${id}`, 'success');
}

function downloadInvoice(id) {
  showNotification('Download Invoice', `Downloading invoice ${id}...`, 'success');
}

function showNotification(title, body, type = 'success') {
  const container = document.getElementById('notificationContainer');
  
  const notif = document.createElement('div');
  notif.className = 'notification glass';
  notif.innerHTML = `
    <div class="notification-icon ${type}">
      <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
    </div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      ${body ? `<div class="notification-body">${body}</div>` : ''}
    </div>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navLoginBtn')?.addEventListener('click', () => {
    document.getElementById('loginModal').classList.remove('hidden');
  });
  
  document.getElementById('heroSignInBtn')?.addEventListener('click', () => {
    document.getElementById('loginModal').classList.remove('hidden');
  });
  
  document.getElementById('heroCreateBtn')?.addEventListener('click', () => {
    showView('signup');
  });
  
  document.getElementById('closeLogin')?.addEventListener('click', () => {
    document.getElementById('loginModal').classList.add('hidden');
  });
  
  document.getElementById('showSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginModal').classList.add('hidden');
    showView('signup');
  });
  
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
    document.getElementById('loginModal').classList.add('hidden');
  });
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) showDashboardView(view);
    });
  });
  
  document.getElementById('userMenuBtn')?.addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('hidden');
  });
  
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadStoreProducts(btn.dataset.category);
    });
  });
  
  // Make Quick Launch buttons work!
  document.querySelectorAll('.quick-launch-card').forEach((card, index) => {
    const portals = ['m365', 'windows365', 'avd'];
    card.addEventListener('click', () => launchPortal(portals[index]));
  });
  
  document.getElementById('backToLanding')?.addEventListener('click', () => {
    showView('landing');
  });
  
  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      orgName: document.getElementById('signupOrgName').value,
      domain: document.getElementById('signupDomain').value,
      firstName: document.getElementById('signupFirstName').value,
      lastName: document.getElementById('signupLastName').value,
      email: document.getElementById('signupEmail').value,
      password: document.getElementById('signupPassword').value,
      package: document.querySelector('input[name="package"]:checked').value,
      userCount: document.getElementById('signupUserCount').value
    };
    
    startProvisioning(formData);
  });
  
  document.getElementById('signupUserCount')?.addEventListener('input', (e) => {
    const count = parseInt(e.target.value) || 1;
    const packageRadio = document.querySelector('input[name="package"]:checked');
    const prices = { basic: 4.20, premium: 15.60, workspace: 39.60 };
    const packagePrice = prices[packageRadio.value];
    const total = (count * packagePrice).toFixed(2);
    document.getElementById('costPreview').innerHTML = `Estimated monthly cost: <strong>£${total}</strong>`;
  });
  
  // ROI Calculator
  const roiInput = document.getElementById('roiEmployees');
  if (roiInput) {
    const updateROI = () => {
      const employees = parseInt(roiInput.value) || 1;
      const laptopCost = employees * 1200; // £1200 per laptop over 3 years
      const nuvola365Cost = employees * 25 * 36; // £25/month * 36 months
      const savings = laptopCost - nuvola365Cost;
      
      document.querySelector('.old-cost').textContent = `£${laptopCost.toLocaleString()}`;
      document.querySelector('.new-cost').textContent = `£${nuvola365Cost.toLocaleString()}`;
      document.querySelector('.savings-amount').textContent = `£${savings.toLocaleString()}`;
    };
    
    roiInput.addEventListener('input', updateROI);
    updateROI(); // Initial calculation
  }
  
  showView('landing');
});
