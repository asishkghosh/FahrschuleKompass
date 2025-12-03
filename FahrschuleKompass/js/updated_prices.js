// Pricing page functionality for updated prices - Tab switching and data loading

// Icon mapping for Font Awesome icons
const iconMap = {
    'road': 'fa-road',
    'car-side': 'fa-car-side',
    'moon': 'fa-moon'
};

// Tab switching functionality
function initTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Hide all panels
            panels.forEach(panel => {
                panel.classList.add('hidden');
            });
            
            // Show target panel
            const targetPanel = document.getElementById(`tabpanel-${targetTabId}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                
                // Load pricing data for this tab if not already loaded
                const sectionId = targetPanel.getAttribute('data-pricing-section');
                if (sectionId && window.pricingData) {
                    loadPricingForSection(sectionId, targetPanel);
                }
            }
        });
    });
}

// Update table rows
function updateTableRows(containerSelector, data, isSonderfahrten = false) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn('Table container not found:', containerSelector);
        return;
    }
    
    if (!data || data.length === 0) {
        console.warn('No data provided for table:', containerSelector);
        // Clear the table if no data
        const tbody = container.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
        }
        return;
    }
    
    const tbody = container.querySelector('tbody');
    if (!tbody) {
        console.warn('Table tbody not found in:', containerSelector);
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add new rows
    data.forEach((item, index) => {
        const bgClass = index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100';
        
        let cellContent = '';
        if (isSonderfahrten && item.icon) {
            const iconClass = iconMap[item.icon] || 'fa-circle';
            cellContent = `<i class="fas ${iconClass} text-accent mr-2"></i>${item.fahrtart}`;
        } else {
            cellContent = item.leistung || item.fahrtart || '';
        }
        
        const row = document.createElement('tr');
        row.className = `${bgClass} transition-colors`;
        row.innerHTML = `
            <td class="border border-gray-200 px-3 py-2 text-gray-700 text-sm whitespace-nowrap">${cellContent}</td>
            <td class="border border-gray-200 px-3 py-2 text-center text-gray-700 text-sm whitespace-nowrap">${item.dauer}</td>
            <td class="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-900 text-sm whitespace-nowrap">${item.preis} €</td>
        `;
        tbody.appendChild(row);
    });
}

// Update additional fees
function updateAdditionalFees(containerSelector, additional) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn('Additional fees container not found:', containerSelector);
        return;
    }
    
    if (!additional) {
        console.warn('No additional fees data provided');
        return;
    }
    
    // Find the fees container (space-y-2 div)
    let feesContainer = container.querySelector('.space-y-2');
    if (!feesContainer) {
        feesContainer = container;
    }
    
    // Clear existing fee items
    const existingItems = feesContainer.querySelectorAll('.flex.justify-between.items-center');
    existingItems.forEach(item => item.remove());
    
    // Clear note paragraph if exists
    const existingNote = feesContainer.querySelector('p.text-sm.text-gray-600');
    if (existingNote) {
        existingNote.remove();
    }
    
    // Add fee items
    Object.keys(additional).forEach((key) => {
        if (key === 'note') return; // Handle note separately
        
        const fee = additional[key];
        const label = fee.label || key;
        const value = fee.value || fee;
        const isHighlight = fee.highlight === true;
        
        const labelClass = isHighlight ? 'text-gray-700 font-medium' : 'text-gray-700';
        const valueClass = isHighlight ? 'font-bold text-gray-900 text-lg' : 'font-semibold text-gray-900';
        
        const feeDiv = document.createElement('div');
        feeDiv.className = 'flex justify-between items-center';
        feeDiv.innerHTML = `
            <span class="${labelClass}">${label}</span>
            <span class="${valueClass}">${value} €</span>
        `;
        feesContainer.appendChild(feeDiv);
    });
    
    // Update note if exists
    if (additional.note) {
        const noteElement = document.createElement('p');
        noteElement.className = 'text-sm text-gray-600 mt-2 pt-2 border-t border-accent/20';
        noteElement.textContent = additional.note;
        feesContainer.appendChild(noteElement);
    }
}

// Update package header information
function updatePackageInfo(panel, packageData) {
    const titleElement = panel.querySelector('[data-package-title]');
    const classesElement = panel.querySelector('[data-package-classes]');
    
    if (titleElement && packageData.title) {
        titleElement.textContent = packageData.title;
    }
    
    if (classesElement) {
        if (packageData.classes) {
            classesElement.innerHTML = `<span class="text-sm font-bold text-white bg-navbar px-3 py-1 rounded-md">Führerscheinklasse: ${packageData.classes}</span>`;
            classesElement.style.display = 'block';
        } else {
            classesElement.innerHTML = '';
            classesElement.style.display = 'none';
        }
    }
}

// Load pricing data for a specific section
function loadPricingForSection(sectionId, panel) {
    if (!window.pricingData || !window.pricingData.pricing || !window.pricingData.pricing[sectionId]) {
        console.warn('Pricing data not found for section:', sectionId);
        return;
    }
    
    const packageData = window.pricingData.pricing[sectionId];
    
    // Update package header
    updatePackageInfo(panel, packageData);
    
    // Update Fahrstunden table
    const fahrstundenTable = panel.querySelector('[data-table="fahrstunden"]');
    if (fahrstundenTable && packageData.fahrstunden) {
        updateTableRows(`#tabpanel-${sectionId} [data-table="fahrstunden"]`, packageData.fahrstunden);
    }
    
    // Update Sonderfahrten table
    const sonderfahrtenTable = panel.querySelector('[data-table="sonderfahrten"]');
    if (sonderfahrtenTable && packageData.sonderfahrten) {
        updateTableRows(`#tabpanel-${sectionId} [data-table="sonderfahrten"]`, packageData.sonderfahrten, true);
    }
    
    // Update additional fees
    const additionalFees = panel.querySelector('[data-additional-fees]');
    if (additionalFees && packageData.additional) {
        updateAdditionalFees(`#tabpanel-${sectionId} [data-additional-fees]`, packageData.additional);
    }
}

// Update notice message
function updateNotice(message) {
    const noticeElement = document.querySelector('#pricing-notice .text-red-700');
    if (noticeElement && message) {
        noticeElement.textContent = message;
    }
}

// Load and update prices from updated_price.json
async function loadPrices() {
    try {
        // Check if we're using file:// protocol (won't work with fetch)
        if (window.location.protocol === 'file:') {
            console.error('Cannot load JSON from file:// protocol. Please use http://localhost:8000/pages/preise_new.html');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4';
            errorDiv.innerHTML = `
                <strong>⚠️ CORS Error:</strong> Please access this page via 
                <a href="http://localhost:8000/pages/preise_new.html" class="underline font-bold">http://localhost:8000/pages/preise_new.html</a> 
                instead of opening the file directly.
            `;
            const pricingContainer = document.querySelector('.tab-panels');
            if (pricingContainer) {
                pricingContainer.parentNode.insertBefore(errorDiv, pricingContainer);
            }
            return;
        }
        
        console.log('Loading prices from updated_price.json...');
        const response = await fetch('../data/updated_price.json');
        if (!response.ok) {
            throw new Error(`Failed to load prices: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Prices loaded successfully:', data);
        
        // Store pricing data globally
        window.pricingData = data;
        
        // Update notice if exists
        if (data.notice && data.notice.message) {
            updateNotice(data.notice.message);
        }
        
        // Load data for the active tab (North-Side by default)
        const activePanel = document.querySelector('.tab-panel.active');
        if (activePanel) {
            const sectionId = activePanel.getAttribute('data-pricing-section');
            if (sectionId) {
                loadPricingForSection(sectionId, activePanel);
            }
        }
        
        console.log('All prices loaded successfully');
        
    } catch (error) {
        console.error('Error loading prices:', error);
        // Show error message to help debug
        const pricingContainer = document.querySelector('.tab-panels');
        if (pricingContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
            errorDiv.textContent = `Error loading prices: ${error.message}. Please check the browser console for details.`;
            pricingContainer.parentNode.insertBefore(errorDiv, pricingContainer);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing pricing page...');
    
    // Initialize tabs
    initTabs();
    
    // Check if we're on the pricing page
    const pricingSections = document.querySelectorAll('[data-pricing-section]');
    if (pricingSections.length > 0) {
        console.log('Found pricing sections:', pricingSections.length);
        
        // Small delay to ensure DOM is fully ready
        setTimeout(function() {
            loadPrices();
        }, 100);
    } else {
        console.log('No pricing sections found, skipping price loading');
    }
});

// Also try on window load as backup
window.addEventListener('load', function() {
    if (document.querySelector('[data-pricing-section]') && !window.pricingData) {
        console.log('Window loaded, prices not loaded yet, loading now...');
        loadPrices();
    }
});