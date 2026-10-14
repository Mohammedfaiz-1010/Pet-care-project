/**
 * PawPals Pet Care Center - Interactive Logic
 * Clean, readable, vanilla JavaScript.
 * Crafted with care: No heavy libraries, fast execution, human-readable architecture.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY HEADER & ACTIVE NAV HIGHLIGHTING
  // ==========================================
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add shadow to header when scrolling
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // ScrollSpy to update active navigation item
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 2. MOBILE NAVIGATION MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
    });

    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-active');
      });
    });
  }

  // ==========================================
  // 3. MINIMUM DATE SETUP FOR BOOKING FORM
  // ==========================================
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today; // Default to today's date for convenience
  }

  // ==========================================
  // 4. FAQ ACCORDION LOGIC
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other FAQ items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
          }
        });

        // Toggle clicked FAQ item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  // ==========================================
  // 5. BOOKING FORM SUBMISSION & MODAL
  // ==========================================
  const bookingForm = document.getElementById('petBookingForm');
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Retrieve form values
      const ownerName = document.getElementById('ownerName').value.trim();
      const ownerEmail = document.getElementById('ownerEmail').value.trim();
      const ownerPhone = document.getElementById('ownerPhone').value.trim();
      const petName = document.getElementById('petName').value.trim();
      const petType = document.getElementById('petType').value;
      const selectedService = document.getElementById('selectedService').value;
      const preferredDate = document.getElementById('preferredDate').value;
      const preferredTime = document.getElementById('preferredTime').value;

      // Basic validation
      if (!ownerName || !ownerEmail || !ownerPhone || !petName || !petType || !selectedService || !preferredDate) {
        alert('Please fill in all required fields marked with * before submitting.');
        return;
      }

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ownerEmail)) {
        alert('Please enter a valid email address so we can send your confirmation.');
        document.getElementById('ownerEmail').focus();
        return;
      }

      // Generate a human-friendly booking reference code
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const bookingRef = `#PAW-2026-${randomCode}`;

      // Populate confirmation modal summary
      document.getElementById('summaryRef').textContent = bookingRef;
      document.getElementById('summaryOwner').textContent = `${ownerName} (${ownerPhone})`;
      document.getElementById('summaryPet').textContent = `${petName} (${petType})`;
      document.getElementById('summaryService').textContent = selectedService;
      document.getElementById('summaryDate').textContent = `${preferredDate} • ${preferredTime}`;

      // Open Modal
      bookingModal.classList.add('active');

      // Reset form fields
      bookingForm.reset();
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  // Close modal when button is clicked
  if (modalCloseBtn && bookingModal) {
    modalCloseBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });

    // Close modal when clicking on the dark backdrop
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });

    // Close modal when pressing ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        bookingModal.classList.remove('active');
      }
    });
  }

});

// ==========================================
// 6. GLOBAL HELPER FUNCTIONS
// ==========================================

/**
 * Filter pet cards by species category
 * @param {string} category - 'all', 'dog', 'cat', 'rabbit', 'bird', 'other'
 */
function filterPets(category) {
  const cards = document.querySelectorAll('.pet-profile-card');
  const buttons = document.querySelectorAll('.pet-filter-btn');

  // Update active button state
  buttons.forEach(btn => {
    if (btn.getAttribute('data-target') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Filter cards with smooth visibility
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Preselect service from Services section and scroll to booking form
 * @param {string} serviceName
 */
function preselectService(serviceName) {
  const serviceSelect = document.getElementById('selectedService');
  if (serviceSelect) {
    // Look for matching option
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
          serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
    
    // Smooth scroll down to booking
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Gentle highlight feedback on the select input
    setTimeout(() => {
      serviceSelect.focus();
    }, 600);
  }
}

/**
 * Choose a pricing tier and preselect corresponding service in booking form
 * @param {string} planTitle
 * @param {number} price
 */
function selectPricing(planTitle, price) {
  const serviceSelect = document.getElementById('selectedService');
  if (serviceSelect) {
    // Map pricing plan to service dropdown value
    if (planTitle.includes('Essential') || planTitle.includes('Refresh')) {
      serviceSelect.value = 'Pet Bathing';
    } else if (planTitle.includes('Full Spa') || planTitle.includes('Pamper')) {
      serviceSelect.value = 'Pet Grooming';
    } else if (planTitle.includes('Daycare') || planTitle.includes('Adventure')) {
      serviceSelect.value = 'Pet Sitting';
    } else if (planTitle.includes('Overnight') || planTitle.includes('Boarding')) {
      serviceSelect.value = 'Overnight Boarding';
    }

    // Smooth scroll to booking
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Focus input
    setTimeout(() => {
      serviceSelect.focus();
    }, 600);
  }
}
