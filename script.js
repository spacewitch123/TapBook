// Sample business data and configurations
const businessProfiles = {
    barber: {
        name: "Tony's Barbershop",
        description: "Premium cuts & traditional shaves",
        location: "Downtown, NYC",
        phone: "+1234567890",
        whatsapp: "+1234567890",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&h=120&fit=crop&crop=face",
        services: [
            {
                name: "Classic Haircut",
                description: "Precision cut styled to perfection",
                price: "$35",
                duration: "45 min"
            },
            {
                name: "Beard Trim",
                description: "Professional beard shaping and styling",
                price: "$20",
                duration: "30 min"
            },
            {
                name: "Hot Towel Shave",
                description: "Traditional wet shave with hot towel",
                price: "$45",
                duration: "60 min"
            }
        ],
        hours: {
            monday: "9:00 AM - 7:00 PM",
            tuesday: "9:00 AM - 7:00 PM",
            wednesday: "9:00 AM - 7:00 PM",
            thursday: "9:00 AM - 8:00 PM",
            friday: "9:00 AM - 8:00 PM",
            saturday: "8:00 AM - 6:00 PM",
            sunday: "Closed"
        },
        social: {
            instagram: "https://instagram.com/tonysbarbershop",
            facebook: "https://facebook.com/tonysbarbershop"
        }
    },
    restaurant: {
        name: "Bella's Kitchen",
        description: "Authentic Italian cuisine & fresh pasta",
        location: "Little Italy, NYC",
        phone: "+1234567891",
        whatsapp: "+1234567891",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop",
        services: [
            {
                name: "Lunch Special",
                description: "Pasta, salad, and garlic bread",
                price: "$18",
                duration: "Available 11AM-3PM"
            },
            {
                name: "Chef's Tasting Menu",
                description: "5-course Italian culinary journey",
                price: "$65",
                duration: "2 hours"
            },
            {
                name: "Private Catering",
                description: "Custom catering for your events",
                price: "From $25/person",
                duration: "Quote on request"
            }
        ],
        hours: {
            monday: "11:00 AM - 10:00 PM",
            tuesday: "11:00 AM - 10:00 PM",
            wednesday: "11:00 AM - 10:00 PM",
            thursday: "11:00 AM - 11:00 PM",
            friday: "11:00 AM - 11:00 PM",
            saturday: "4:00 PM - 11:00 PM",
            sunday: "4:00 PM - 9:00 PM"
        },
        social: {
            instagram: "https://instagram.com/bellaskitchen",
            facebook: "https://facebook.com/bellaskitchen",
            google: "https://maps.google.com/bellaskitchen"
        }
    },
    trainer: {
        name: "FitLife Personal Training",
        description: "Transform your body, transform your life",
        location: "Fitness District, NYC",
        phone: "+1234567892",
        whatsapp: "+1234567892",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop&crop=face",
        services: [
            {
                name: "1-on-1 Training",
                description: "Personalized workout and nutrition plan",
                price: "$80/session",
                duration: "60 min"
            },
            {
                name: "Group Classes",
                description: "High-energy group fitness sessions",
                price: "$25/class",
                duration: "45 min"
            },
            {
                name: "Nutrition Coaching",
                description: "Meal planning and dietary guidance",
                price: "$150/month",
                duration: "Ongoing support"
            }
        ],
        hours: {
            monday: "6:00 AM - 9:00 PM",
            tuesday: "6:00 AM - 9:00 PM",
            wednesday: "6:00 AM - 9:00 PM",
            thursday: "6:00 AM - 9:00 PM",
            friday: "6:00 AM - 8:00 PM",
            saturday: "7:00 AM - 6:00 PM",
            sunday: "8:00 AM - 5:00 PM"
        },
        social: {
            instagram: "https://instagram.com/fitlifept",
            facebook: "https://facebook.com/fitlifept"
        }
    }
};

// Current business data
let currentBusiness = businessProfiles.barber; // Default to barber

// DOM Elements
const businessName = document.getElementById('businessName');
const businessDescription = document.getElementById('businessDescription');
const businessLocation = document.getElementById('businessLocation');
const businessImage = document.getElementById('businessImage');
const whatsappBtn = document.getElementById('whatsappBtn');
const callBtn = document.getElementById('callBtn');
const servicesGrid = document.getElementById('servicesGrid');
const hoursGrid = document.getElementById('hoursGrid');
const socialLinks = document.getElementById('socialLinks');
const editToggle = document.getElementById('editToggle');
const adminPanel = document.getElementById('adminPanel');
const businessForm = document.getElementById('businessForm');

// Form inputs
const nameInput = document.getElementById('nameInput');
const descriptionInput = document.getElementById('descriptionInput');
const locationInput = document.getElementById('locationInput');
const phoneInput = document.getElementById('phoneInput');
const whatsappInput = document.getElementById('whatsappInput');

// Initialize the app
function init() {
    // Check for business type in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const businessType = urlParams.get('type');
    
    if (businessType && businessProfiles[businessType]) {
        currentBusiness = businessProfiles[businessType];
    }
    
    // Load business data from localStorage if available
    const savedBusiness = localStorage.getItem('tapbook-business');
    if (savedBusiness) {
        currentBusiness = { ...currentBusiness, ...JSON.parse(savedBusiness) };
    }
    
    updateDisplay();
    setupEventListeners();
}

// Update the display with current business data
function updateDisplay() {
    // Update header
    businessName.textContent = currentBusiness.name;
    businessDescription.textContent = currentBusiness.description;
    businessLocation.textContent = currentBusiness.location;
    businessImage.src = currentBusiness.image;
    businessImage.alt = `${currentBusiness.name} Logo`;
    
    // Update contact buttons
    const whatsappMessage = encodeURIComponent(`Hi! I'm interested in your services at ${currentBusiness.name}`);
    whatsappBtn.href = `https://wa.me/${currentBusiness.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;
    callBtn.href = `tel:${currentBusiness.phone}`;
    
    // Update services
    updateServices();
    
    // Update hours
    updateHours();
    
    // Update social links
    updateSocialLinks();
    
    // Update form with current data
    updateForm();
}

// Update services display
function updateServices() {
    servicesGrid.innerHTML = '';
    
    currentBusiness.services.forEach((service, index) => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.style.animationDelay = `${index * 0.1}s`;
        
        serviceItem.innerHTML = `
            <div class="service-header">
                <div class="service-name">${service.name}</div>
                <div class="service-price">${service.price}</div>
            </div>
            <div class="service-description">${service.description}</div>
            <div class="service-duration">${service.duration}</div>
        `;
        
        servicesGrid.appendChild(serviceItem);
    });
}

// Update business hours display
function updateHours() {
    hoursGrid.innerHTML = '';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to our array index
    
    days.forEach((day, index) => {
        const hoursItem = document.createElement('div');
        hoursItem.className = 'hours-item';
        
        if (index === todayIndex) {
            hoursItem.classList.add('today');
        }
        
        hoursItem.innerHTML = `
            <div class="hours-day">${dayNames[index]}</div>
            <div class="hours-time">${currentBusiness.hours[day]}</div>
        `;
        
        hoursGrid.appendChild(hoursItem);
    });
}

// Update social links display
function updateSocialLinks() {
    socialLinks.innerHTML = '';
    
    if (currentBusiness.social) {
        Object.entries(currentBusiness.social).forEach(([platform, url]) => {
            const socialLink = document.createElement('a');
            socialLink.className = `social-link ${platform}`;
            socialLink.href = url;
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            
            let iconClass;
            switch (platform) {
                case 'instagram':
                    iconClass = 'fab fa-instagram';
                    break;
                case 'facebook':
                    iconClass = 'fab fa-facebook-f';
                    break;
                case 'google':
                    iconClass = 'fab fa-google';
                    break;
                default:
                    iconClass = 'fas fa-link';
            }
            
            socialLink.innerHTML = `<i class="${iconClass}"></i>`;
            socialLinks.appendChild(socialLink);
        });
    }
}

// Update form with current business data
function updateForm() {
    nameInput.value = currentBusiness.name;
    descriptionInput.value = currentBusiness.description;
    locationInput.value = currentBusiness.location;
    phoneInput.value = currentBusiness.phone;
    whatsappInput.value = currentBusiness.whatsapp;
}

// Setup event listeners
function setupEventListeners() {
    // Edit toggle button
    editToggle.addEventListener('click', toggleAdminPanel);
    
    // Business form submission
    businessForm.addEventListener('submit', handleFormSubmit);
    
    // Close admin panel when clicking outside
    document.addEventListener('click', (e) => {
        if (adminPanel.style.display === 'block' && 
            !adminPanel.contains(e.target) && 
            !editToggle.contains(e.target)) {
            closeAdminPanel();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminPanel.style.display === 'block') {
            closeAdminPanel();
        }
    });
}

// Toggle admin panel
function toggleAdminPanel() {
    if (adminPanel.style.display === 'none' || adminPanel.style.display === '') {
        openAdminPanel();
    } else {
        closeAdminPanel();
    }
}

// Open admin panel
function openAdminPanel() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.id = 'adminOverlay';
    document.body.appendChild(overlay);
    
    adminPanel.style.display = 'block';
    updateForm();
    
    // Focus first input
    nameInput.focus();
}

// Close admin panel
function closeAdminPanel() {
    adminPanel.style.display = 'none';
    
    // Remove overlay
    const overlay = document.getElementById('adminOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Update current business data
    currentBusiness.name = nameInput.value;
    currentBusiness.description = descriptionInput.value;
    currentBusiness.location = locationInput.value;
    currentBusiness.phone = phoneInput.value;
    currentBusiness.whatsapp = whatsappInput.value;
    
    // Save to localStorage
    localStorage.setItem('tapbook-business', JSON.stringify({
        name: currentBusiness.name,
        description: currentBusiness.description,
        location: currentBusiness.location,
        phone: currentBusiness.phone,
        whatsapp: currentBusiness.whatsapp
    }));
    
    // Update display
    updateDisplay();
    
    // Close admin panel
    closeAdminPanel();
    
    // Show success feedback
    showNotification('Business information updated successfully!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1001;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Quick business type switcher (for demo purposes)
function switchBusinessType(type) {
    if (businessProfiles[type]) {
        currentBusiness = businessProfiles[type];
        updateDisplay();
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('type', type);
        window.history.pushState({}, '', url);
    }
}

// Make switcher function globally available for demo
window.switchBusinessType = switchBusinessType;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some demo buttons for switching business types (for testing)
function addDemoSwitcher() {
    const demoSwitcher = document.createElement('div');
    demoSwitcher.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
    `;
    
    ['barber', 'restaurant', 'trainer'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.style.cssText = `
            padding: 8px 12px;
            background: #4F46E5;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        `;
        btn.onclick = () => switchBusinessType(type);
        demoSwitcher.appendChild(btn);
    });
    
    document.body.appendChild(demoSwitcher);
}

// Add demo switcher in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', addDemoSwitcher);
}