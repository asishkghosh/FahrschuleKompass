// Simple price loader - just updates values from JSON, keeps HTML structure intact

// Icon mapping for Font Awesome icons
const iconMap = {
    'road': 'fa-road',
    'car-side': 'fa-car-side',
    'moon': 'fa-moon'
};

// Update table rows
function updateTableRows(containerSelector, data, isSonderfahrten = false) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn('Table container not found:', containerSelector);
        return;
    }
    
    if (!data || data.length === 0) {
        console.warn('No data provided for table:', containerSelector);
        return;
    }
    
    const tbody = container.querySelector('tbody');
    if (!tbody) {
        console.warn('Table tbody not found in:', containerSelector);
        return;
    }
    
    console.log(`Updating table ${containerSelector} with ${data.length} rows`);
    
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
            <td class="border border-gray-200 px-4 py-3 text-gray-700">${cellContent}</td>
            <td class="border border-gray-200 px-4 py-3 text-center text-gray-700">${item.dauer}</td>
            <td class="border border-gray-200 px-4 py-3 text-right font-semibold text-gray-900">${item.preis} €</td>
        `;
        tbody.appendChild(row);
    });
    
    console.log(`Table ${containerSelector} updated with ${data.length} rows`);
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
    
    console.log('Updating additional fees for:', containerSelector, additional);
    
    // Find the fees container (space-y-2 div or the container itself)
    let feesContainer = container.querySelector('.space-y-2');
    if (!feesContainer) {
        // For first section, it's directly in the container
        feesContainer = container;
    }
    
    // Clear existing fee items (but keep the structure like h5 if exists)
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
    
    console.log('Additional fees updated for:', containerSelector);
}

// Update notice message
function updateNotice(message) {
    const noticeElement = document.querySelector('#pricing-notice .text-red-700');
    if (noticeElement && message) {
        noticeElement.textContent = message;
    }
}

// Load and update prices
async function loadPrices() {
    try {
        // Check if we're using file:// protocol (won't work with fetch)
        if (window.location.protocol === 'file:') {
            console.error('Cannot load JSON from file:// protocol. Please use http://localhost:8000/pages/preise.html');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4';
            errorDiv.innerHTML = `
                <strong>⚠️ CORS Error:</strong> Please access this page via 
                <a href="http://localhost:8000/pages/preise.html" class="underline font-bold">http://localhost:8000/pages/preise.html</a> 
                instead of opening the file directly.
            `;
            const pricingContainer = document.querySelector('[data-pricing-section="pkwAnhanger"]');
            if (pricingContainer) {
                pricingContainer.parentNode.insertBefore(errorDiv, pricingContainer);
            }
            return;
        }
        
        console.log('Loading prices from JSON...');
        const response = await fetch('../data/prices.json');
        if (!response.ok) {
            throw new Error(`Failed to load prices: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Prices loaded successfully:', data);
        
        // Update notice if exists
        if (data.notice && data.notice.message) {
            updateNotice(data.notice.message);
        }
        
        // Update PKW & Anhängerführerschein section
        if (data.pricing && data.pricing.pkwAnhanger) {
            const section = data.pricing.pkwAnhanger;
            console.log('Updating pkwAnhanger section:', section);
            
            // Update Fahrstunden table
            const fahrstundenTable = document.querySelector('[data-pricing-section="pkwAnhanger"] [data-table="fahrstunden"]');
            console.log('Fahrstunden table found:', fahrstundenTable);
            updateTableRows('[data-pricing-section="pkwAnhanger"] [data-table="fahrstunden"]', section.fahrstunden);
            
            // Update Sonderfahrten table
            const sonderfahrtenTable = document.querySelector('[data-pricing-section="pkwAnhanger"] [data-table="sonderfahrten"]');
            console.log('Sonderfahrten table found:', sonderfahrtenTable);
            updateTableRows('[data-pricing-section="pkwAnhanger"] [data-table="sonderfahrten"]', section.sonderfahrten, true);
            
            // Update additional fees
            const additionalFees = document.querySelector('[data-pricing-section="pkwAnhanger"] [data-additional-fees]');
            console.log('Additional fees container found:', additionalFees);
            updateAdditionalFees('[data-pricing-section="pkwAnhanger"] [data-additional-fees]', section.additional);
        }
        
        // Update PKW Führerschein section
        if (data.pricing && data.pricing.pkw) {
            const section = data.pricing.pkw;
            console.log('Updating pkw section:', section);
            
            // Update Fahrstunden table
            updateTableRows('[data-pricing-section="pkw"] [data-table="fahrstunden"]', section.fahrstunden);
            
            // Update Sonderfahrten table
            updateTableRows('[data-pricing-section="pkw"] [data-table="sonderfahrten"]', section.sonderfahrten, true);
            
            // Update additional fees
            updateAdditionalFees('[data-pricing-section="pkw"] [data-additional-fees]', section.additional);
        }
        
        // Update PKW Wechsler section
        if (data.pricing && data.pricing.pkwWechsler) {
            const section = data.pricing.pkwWechsler;
            console.log('Updating pkwWechsler section:', section);
            
            // Update Fahrstunden table
            updateTableRows('[data-pricing-section="pkwWechsler"] [data-table="fahrstunden"]', section.fahrstunden);
            
            // Update additional fees (no sonderfahrten for this section)
            updateAdditionalFees('[data-pricing-section="pkwWechsler"] [data-additional-fees]', section.additional);
        }
        
        console.log('All prices updated successfully');
        
    } catch (error) {
        console.error('Error loading prices:', error);
        // Show error message to help debug
        const pricingContainer = document.querySelector('[data-pricing-section="pkwAnhanger"]');
        if (pricingContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
            errorDiv.textContent = `Error loading prices: ${error.message}. Please check the browser console for details.`;
            pricingContainer.parentNode.insertBefore(errorDiv, pricingContainer);
        }
    }
}

// Initialize when DOM is ready - wait a bit to ensure all scripts are loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for pricing sections...');
    const pricingSections = document.querySelectorAll('[data-pricing-section]');
    console.log('Found pricing sections:', pricingSections.length);
    
    // Only load prices if we're on the pricing page and containers exist
    if (pricingSections.length > 0) {
        console.log('Loading prices...');
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
    if (document.querySelector('[data-pricing-section]') && document.querySelectorAll('tbody').length > 0 && document.querySelector('tbody').innerHTML.trim() === '') {
        console.log('Window loaded, prices still empty, reloading...');
        loadPrices();
    }
});
