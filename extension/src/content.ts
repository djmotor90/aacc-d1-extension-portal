/**
 * D1 Student Profile Customizer - Content Script
 * 
 * This script analyzes the DestinyOne Student Profile page structure
 * and moves the Custom Fields section below the Student Status section
 * with enhanced logging and error handling.
 */

class D1ProfileCustomizer {
    private logger: D1Logger;
    private analyzer: D1PageAnalyzer;
    private manipulator: D1DOMManipulator;
    private lastPageStructure: PageStructure | null = null;
    private lastAction = 'Initialized';
    private isEnabled = false;
    private originalPosition: { parent: HTMLElement; nextSibling: Node | null } | null = null;
    
    constructor() {
        this.logger = new D1Logger();
        this.analyzer = new D1PageAnalyzer(this.logger);
        this.manipulator = new D1DOMManipulator(this.logger);
        
        this.logger.info('🎯 D1 Profile Customizer initialized');
    }
    
    /**
     * Main initialization method - optimized for immediate execution
     */
    async initialize(): Promise<void> {
        try {
            // Verify we're on the correct page
            if (!this.analyzer.isStudentProfilePage()) {
                this.logger.info('📄 Not on Student Profile page, exiting gracefully');
                return;
            }
            
            this.logger.info('✅ Confirmed we are on D1 Student Profile page');
            this.logger.info(`🌐 Current URL: ${window.location.href}`);
            
            // Analyze page structure but don't auto-customize
            const pageStructure = this.analyzer.analyzePage();
            this.lastPageStructure = pageStructure;
            this.logger.logPageStructure(pageStructure);
            
            // Store original position for restoration
            if (pageStructure.customFieldsSection) {
                this.storeOriginalPosition(pageStructure.customFieldsSection);
            }
            
            // Check stored extension state
            const result = await chrome.storage.local.get(['extensionEnabled']);
            this.isEnabled = result.extensionEnabled || false;
            
            // Apply enhancement if enabled
            if (this.isEnabled) {
                await this.customizePage(pageStructure);
            }
            
        } catch (error) {
            this.logger.error('❌ Failed to initialize D1 Profile Customizer:', error);
            this.lastAction = 'Failed to initialize: ' + error;
        }
    }
    
    /**
     * Get current status for popup interface
     */
    getStatus() {
        const structure = this.lastPageStructure;
        return {
            isD1Page: this.analyzer.isStudentProfilePage(),
            hasCustomFields: !!structure?.customFieldsSection,
            hasStudentStatus: !!structure?.studentStatusSection,
            isAlreadyMoved: structure?.customFieldsSection ? 
                this.manipulator.isAlreadyMoved(structure.customFieldsSection) : false,
            lastAction: this.lastAction
        };
    }
    
    /**
     * Store original position for restoration
     */
    private storeOriginalPosition(element: HTMLElement): void {
        this.originalPosition = {
            parent: element.parentElement!,
            nextSibling: element.nextElementSibling
        };
    }
    
    /**
     * Enable the enhancement
     */
    async enableEnhancement(): Promise<boolean> {
        try {
            this.isEnabled = true;
            this.lastAction = 'Enhancement enabled';
            
            if (!this.lastPageStructure) {
                this.lastPageStructure = this.analyzer.analyzePage();
            }
            
            const success = await this.customizePage(this.lastPageStructure);
            return success;
        } catch (error) {
            this.lastAction = 'Enable error: ' + error;
            return false;
        }
    }
    
    /**
     * Disable the enhancement
     */
    async disableEnhancement(): Promise<boolean> {
        try {
            this.isEnabled = false;
            this.lastAction = 'Enhancement disabled';
            
            if (this.lastPageStructure?.customFieldsSection && this.originalPosition) {
                this.restoreOriginalPosition(this.lastPageStructure.customFieldsSection);
            }
            
            return true;
        } catch (error) {
            this.lastAction = 'Disable error: ' + error;
            return false;
        }
    }
    
    /**
     * Restore element to original position
     */
    private restoreOriginalPosition(element: HTMLElement): void {
        if (!this.originalPosition) return;
        
        // Remove any styling and indicators
        this.manipulator.removeMovedIndicator(element);
        this.manipulator.removeCustomStyling(element);
        
        // Move back to original position
        if (this.originalPosition.nextSibling) {
            this.originalPosition.parent.insertBefore(element, this.originalPosition.nextSibling);
        } else {
            this.originalPosition.parent.appendChild(element);
        }
    }
    
    /**
     * Force customization (called from popup)
     */
    async forceCustomize(): Promise<boolean> {
        try {
            this.lastAction = 'Force customize requested';
            
            if (!this.analyzer.isStudentProfilePage()) {
                this.lastAction = 'Not on D1 page';
                return false;
            }
            
            const structure = this.analyzer.analyzePage();
            this.lastPageStructure = structure;
            
            const success = await this.customizePage(structure);
            this.lastAction = success ? 'Force customize successful' : 'Force customize failed';
            return success;
        } catch (error) {
            this.lastAction = 'Force customize error: ' + error;
            return false;
        }
    }
    
    /**
     * Customize the page by moving Custom Fields
     */
    private async customizePage(structure: PageStructure): Promise<boolean> {
        try {
            if (!structure.customFieldsSection) {
                this.logger.warn('⚠️ No Custom Fields section found - nothing to move');
                this.lastAction = 'No Custom Fields section found';
                return false;
            }
            
            if (!structure.studentStatusSection) {
                this.logger.warn('⚠️ No Student Status section found - cannot determine target location');
                this.lastAction = 'No Student Status section found';
                return false;
            }
            
            // Check if already moved
            if (this.manipulator.isAlreadyMoved(structure.customFieldsSection)) {
                this.logger.info('✅ Custom Fields section already moved, skipping');
                this.lastAction = 'Custom Fields already moved';
                return true;
            }
            
            // Perform the move
            const success = this.manipulator.moveCustomFields(
                structure.customFieldsSection,
                structure.studentStatusSection
            );
            
            if (success) {
                this.logger.success('🎉 Successfully moved Custom Fields section!');
                this.manipulator.addMovedIndicator(structure.customFieldsSection);
                this.lastAction = 'Successfully moved Custom Fields section';
                return true;
            } else {
                this.logger.error('❌ Failed to move Custom Fields section');
                this.lastAction = 'Failed to move Custom Fields section';
                return false;
            }
            
        } catch (error) {
            this.logger.error('❌ Error during page customization:', error);
            this.lastAction = 'Error during customization: ' + error;
            return false;
        }
    }
}

/**
 * Enhanced logging system for debugging
 */
class D1Logger {
    private prefix = '[D1-Customizer]';
    
    info(message: string, data?: any): void {
        console.log(`${this.prefix} ${message}`, data || '');
    }
    
    warn(message: string, data?: any): void {
        console.warn(`${this.prefix} ${message}`, data || '');
    }
    
    error(message: string, error?: any): void {
        console.error(`${this.prefix} ${message}`, error || '');
    }
    
    success(message: string, data?: any): void {
        console.log(`%c${this.prefix} ${message}`, 'color: #4CAF50; font-weight: bold;', data || '');
    }
    
    debug(message: string, data?: any): void {
        console.debug(`${this.prefix} ${message}`, data || '');
    }
    
    /**
     * Log detailed page structure information
     */
    logPageStructure(structure: PageStructure): void {
        this.info('📊 Page Structure Analysis:');
        
        if (structure.customFieldsSection) {
            this.info('  ✅ Custom Fields Section Found:', {
                id: structure.customFieldsSection.id,
                classes: structure.customFieldsSection.className,
                tag: structure.customFieldsSection.tagName,
                parent: structure.customFieldsSection.parentElement?.tagName
            });
        } else {
            this.warn('  ❌ Custom Fields Section: NOT FOUND');
        }
        
        if (structure.studentStatusSection) {
            this.info('  ✅ Student Status Section Found:', {
                id: structure.studentStatusSection.id,
                classes: structure.studentStatusSection.className,
                tag: structure.studentStatusSection.tagName,
                parent: structure.studentStatusSection.parentElement?.tagName
            });
        } else {
            this.warn('  ❌ Student Status Section: NOT FOUND');
        }
        
        this.info('  📋 All .blueBorder sections:', structure.allSections.length);
        structure.allSections.forEach((section, index) => {
            const text = section.textContent?.substring(0, 50).trim() || '';
            this.debug(`    Section ${index + 1}: ${section.className} - "${text}"`);
        });
    }
}

/**
 * Page structure analyzer
 */
class D1PageAnalyzer {
    constructor(private logger: D1Logger) {}
    
    /**
     * Check if we're on the correct page
     */
    isStudentProfilePage(): boolean {
        const indicators = [
            () => window.location.href.includes('studentProfile.do'),
            () => window.location.href.includes('studentProfile'),
            () => document.title.includes('Student Profile'),
            () => !!document.querySelector('form[name="studentProfileForm"]'),
            () => !!document.querySelector('#customFieldCollapse'),
            () => !!document.querySelector('select[name="studentProfileStatus"]')
        ];
        
        return indicators.some(check => check());
    }
    

    
    /**
     * Analyze the current page structure
     */
    analyzePage(): PageStructure {
        this.logger.info('🔍 Analyzing D1 page structure...');
        
        return {
            customFieldsSection: this.findCustomFieldsSection(),
            studentStatusSection: this.findStudentStatusSection(),
            allSections: Array.from(document.querySelectorAll('.blueBorder'))
        };
    }
    
    /**
     * Find Custom Fields section using optimized direct targeting
     */
    private findCustomFieldsSection(): HTMLElement | null {
        this.logger.debug('🔍 Looking for Custom Fields section...');
        
        // Direct targeting - Custom Fields is always #customFieldCollapse
        const element = document.querySelector('#customFieldCollapse') as HTMLElement;
        if (element) {
            this.logger.debug('✅ Found Custom Fields via #customFieldCollapse');
            return element;
        }
        
        this.logger.warn('❌ Custom Fields section not found');
        return null;
    }
    
    /**
     * Find Student Status section using optimized direct targeting
     */
    private findStudentStatusSection(): HTMLElement | null {
        this.logger.debug('🔍 Looking for Student Status section...');
        
        // Direct targeting - find select element and get its .blueBorder container
        const statusSelect = document.querySelector('select[name="studentProfileStatus"]');
        if (statusSelect) {
            const container = statusSelect.closest('.blueBorder') as HTMLElement;
            if (container) {
                this.logger.debug('✅ Found Student Status via select element');
                return container;
            }
        }
        
        this.logger.warn('❌ Student Status section not found');
        return null;
    }
}

/**
 * DOM manipulation utilities
 */
class D1DOMManipulator {
    private readonly MOVED_INDICATOR_ID = 'd1-customizer-moved-indicator';
    
    constructor(private logger: D1Logger) {}
    
    /**
     * Check if Custom Fields section has already been moved
     */
    isAlreadyMoved(element: HTMLElement): boolean {
        return !!element.querySelector(`#${this.MOVED_INDICATOR_ID}`);
    }
    
    /**
     * Move Custom Fields section after Student Status section
     */
    moveCustomFields(customFields: HTMLElement, studentStatus: HTMLElement): boolean {
        try {
            this.logger.info('🚀 Attempting to move Custom Fields section...');
            
            // Use insertAdjacentElement for clean DOM manipulation
            studentStatus.insertAdjacentElement('afterend', customFields);
            
            // Apply visual styling
            this.styleMovedElement(customFields);
            
            this.logger.success('✅ Successfully moved Custom Fields section');
            return true;
            
        } catch (error) {
            this.logger.error('❌ Failed to move Custom Fields section:', error);
            return false;
        }
    }
    
    /**
     * Add visual indicator that section was moved (removed per user request)
     */
    addMovedIndicator(element: HTMLElement): void {
        // Visual indicator removed per user request
        // Just mark the element internally for tracking
        element.setAttribute('data-d1-customizer-moved', 'true');
    }
    
    /**
     * Remove moved indicator
     */
    removeMovedIndicator(element: HTMLElement): void {
        const indicator = element.querySelector(`#${this.MOVED_INDICATOR_ID}`);
        if (indicator) {
            indicator.remove();
        }
        element.removeAttribute('data-d1-customizer-moved');
    }
    
    /**
     * Remove custom styling
     */
    removeCustomStyling(element: HTMLElement): void {
        // Remove the custom styles we applied
        element.style.border = '';
        element.style.borderRadius = '';
        element.style.margin = '';
        element.style.background = '';
        element.style.boxShadow = '';
        element.style.position = '';
    }
    
    /**
     * Apply styling to moved element
     */
    private styleMovedElement(element: HTMLElement): void {
        element.style.cssText += `
            border: 2px solid #007cba !important;
            border-radius: 8px !important;
            margin: 20px 0 !important;
            background: #f8f9fa !important;
            box-shadow: 0 2px 8px rgba(0,123,186,0.1) !important;
            position: relative !important;
        `;
    }
    
    /**
     * Smooth scroll to element
     */
    scrollToElement(element: HTMLElement): void {
        setTimeout(() => {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight effect
            const originalBg = element.style.backgroundColor;
            element.style.transition = 'background-color 3s ease';
            element.style.backgroundColor = '#e3f2fd';
            
            setTimeout(() => {
                element.style.backgroundColor = originalBg;
            }, 2000);
        }, 300);
    }
}

/**
 * Interface for page structure analysis results
 */
interface PageStructure {
    customFieldsSection: HTMLElement | null;
    studentStatusSection: HTMLElement | null;
    allSections: Element[];
}

// Message handler for communication with popup and background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ping') {
        sendResponse({ pong: true });
        return;
    }
    
    if (message.action === 'getStatus') {
        const customizer = (window as any).d1Customizer;
        if (customizer) {
            sendResponse(customizer.getStatus());
        } else {
            sendResponse({
                isD1Page: false,
                hasCustomFields: false,
                hasStudentStatus: false,
                isAlreadyMoved: false,
                lastAction: 'Extension not initialized'
            });
        }
        return;
    }
    
    if (message.action === 'enable') {
        const customizer = (window as any).d1Customizer;
        if (customizer) {
            customizer.enableEnhancement().then((success) => {
                sendResponse({ success: success });
            });
            return true; // Keep channel open for async response
        } else {
            sendResponse({ success: false, error: 'Extension not initialized' });
        }
        return;
    }
    
    if (message.action === 'disable') {
        const customizer = (window as any).d1Customizer;
        if (customizer) {
            customizer.disableEnhancement().then((success) => {
                sendResponse({ success: success });
            });
            return true; // Keep channel open for async response
        } else {
            sendResponse({ success: false, error: 'Extension not initialized' });
        }
        return;
    }
    
    if (message.action === 'customize') {
        const customizer = (window as any).d1Customizer;
        if (customizer) {
            customizer.forceCustomize().then((success) => {
                sendResponse({ success: success });
            });
            return true; // Keep channel open for async response
        } else {
            sendResponse({ success: false, error: 'Extension not initialized' });
        }
        return;
    }
});

// Initialize the customizer when DOM is ready
(() => {
    const customizer = new D1ProfileCustomizer();
    
    // Store reference globally for message handling
    (window as any).d1Customizer = customizer;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => customizer.initialize());
    } else {
        customizer.initialize();
    }
    
    // Also try when window fully loads (extra safety)
    window.addEventListener('load', () => {
        setTimeout(() => customizer.initialize(), 1000);
    });
})();