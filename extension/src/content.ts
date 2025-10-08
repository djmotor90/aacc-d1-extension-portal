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
    private courseSectionHandler: D1CourseSectionHandler | null = null;
    private lastPageStructure: PageStructure | null = null;
    private lastAction = 'Initialized';
    private isEnabled = false;
    private courseLinkEnabled = false;
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
            // Check what type of page we're on
            const isStudentProfile = this.analyzer.isStudentProfilePage();
            const isCourseSection = this.analyzer.isCourseSectionPage();
            
            if (!isStudentProfile && !isCourseSection) {
                this.logger.info('📄 Not on a supported D1 page, exiting gracefully');
                return;
            }
            
            this.logger.info(`✅ Detected D1 page type: ${isStudentProfile ? 'Student Profile' : 'Course Section'}`);
            this.logger.info(`🌐 Current URL: ${window.location.href}`);
            
            if (isStudentProfile) {
                await this.initializeStudentProfile();
            } else if (isCourseSection) {
                await this.initializeCourseSection();
            }
            
        } catch (error) {
            this.logger.error('❌ Failed to initialize D1 extension:', error);
            this.lastAction = 'Failed to initialize: ' + error;
        }
    }
    
    /**
     * Initialize student profile functionality
     */
    private async initializeStudentProfile(): Promise<void> {
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
    }
    
    /**
     * Initialize course section functionality
     */
    private async initializeCourseSection(): Promise<void> {
        this.courseSectionHandler = new D1CourseSectionHandler();
        await this.courseSectionHandler.initialize();
        this.lastAction = 'Course Section public link functionality added';
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
            this.logger.info('🔄 Enabling enhancement...');
            this.isEnabled = true;
            this.lastAction = 'Enhancement enabled';
            
            if (!this.analyzer.isStudentProfilePage()) {
                this.lastAction = 'Not on D1 Student Profile page';
                this.logger.warn('⚠️ Not on D1 Student Profile page');
                return false;
            }
            
            if (!this.lastPageStructure) {
                this.lastPageStructure = this.analyzer.analyzePage();
                if (this.lastPageStructure.customFieldsSection) {
                    this.storeOriginalPosition(this.lastPageStructure.customFieldsSection);
                }
            }
            
            const success = await this.customizePage(this.lastPageStructure);
            this.logger.info(success ? '✅ Enhancement enabled successfully' : '❌ Enhancement enable failed');
            return success;
        } catch (error) {
            this.logger.error('❌ Enable enhancement error:', error);
            this.lastAction = 'Enable error: ' + error;
            return false;
        }
    }
    
    /**
     * Disable the enhancement
     */
    async disableEnhancement(): Promise<boolean> {
        try {
            this.logger.info('🔄 Disabling enhancement...');
            this.isEnabled = false;
            this.lastAction = 'Enhancement disabled';
            
            if (this.lastPageStructure?.customFieldsSection && this.originalPosition) {
                this.restoreOriginalPosition(this.lastPageStructure.customFieldsSection);
                this.logger.info('✅ Enhancement disabled and position restored');
            } else {
                this.logger.info('✅ Enhancement disabled (no restoration needed)');
            }
            
            return true;
        } catch (error) {
            this.logger.error('❌ Disable enhancement error:', error);
            this.lastAction = 'Disable error: ' + error;
            return false;
        }
    }
    
    /**
     * Toggle specific feature on or off
     */
    async toggleFeature(feature: string, enabled: boolean): Promise<boolean> {
        try {
            this.logger.info(`🔄 Toggling ${feature} ${enabled ? 'on' : 'off'}...`);
            
            if (feature === 'customFields') {
                if (enabled) {
                    return await this.enableEnhancement();
                } else {
                    return await this.disableEnhancement();
                }
            } else if (feature === 'courseLink') {
                this.courseLinkEnabled = enabled;
                
                if (this.courseSectionHandler) {
                    if (enabled) {
                        await this.courseSectionHandler.initialize();
                        this.logger.info('✅ Course link feature enabled');
                    } else {
                        this.courseSectionHandler.cleanup();
                        this.logger.info('✅ Course link feature disabled');
                    }
                    return true;
                } else if (enabled && this.analyzer.isCourseSectionPage()) {
                    // Initialize course section handler if needed
                    await this.initializeCourseSection();
                    return true;
                } else {
                    this.logger.warn('⚠️ Course section handler not available');
                    return false;
                }
            }
            
            this.logger.warn(`⚠️ Unknown feature: ${feature}`);
            return false;
        } catch (error) {
            this.logger.error(`❌ Toggle ${feature} error:`, error);
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
     * Check if we're on a course section page
     */
    isCourseSectionPage(): boolean {
        const indicators = [
            () => window.location.href.includes('courseSectionProfile.do'),
            () => window.location.href.includes('courseId=') && window.location.href.includes('sectionId='),
            () => document.title.includes('Course Section'),
            () => !!document.querySelector('form[name="courseSectionForm"]')
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
        return element.hasAttribute('data-d1-customizer-moved') || 
               !!element.querySelector(`#${this.MOVED_INDICATOR_ID}`);
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
 * Course Section Public Link Generator
 * Handles creating public links for course sections on AACC website
 */
class D1CourseSectionHandler {
    private logger: D1Logger;
    private readonly AACC_PUBLIC_TEMPLATE = 'https://noncredit.aacc.edu/search/publicCourseSectionDetails.do?method=load&courseId=XXXXXX&sectionId=XXXXXX';
    private readonly BUTTON_ID = 'd1-copy-public-link-btn';
    
    constructor() {
        this.logger = new D1Logger();
    }
    
    /**
     * Initialize course section functionality
     */
    async initialize(): Promise<void> {
        try {
            if (!this.isCourseSectionPage()) {
                return;
            }
            
            this.logger.info('🎯 Course Section page detected, adding public link functionality');
            
            const urlParams = this.extractUrlParameters();
            if (!urlParams.courseId || !urlParams.sectionId) {
                this.logger.warn('⚠️ Missing courseId or sectionId parameters');
                return;
            }
            
            const publicLink = this.generatePublicLink(urlParams.courseId, urlParams.sectionId);
            this.addCopyLinkButton(publicLink);
            
            this.logger.success('✅ Public link functionality added successfully');
            
        } catch (error) {
            this.logger.error('❌ Failed to initialize course section handler:', error);
        }
    }
    
    /**
     * Check if we're on a course section page
     */
    private isCourseSectionPage(): boolean {
        return window.location.href.includes('courseSectionProfile.do') &&
               window.location.href.includes('courseId=') &&
               window.location.href.includes('sectionId=');
    }
    
    /**
     * Extract courseId and sectionId from URL parameters
     */
    private extractUrlParameters(): { courseId: string | null; sectionId: string | null } {
        const url = new URL(window.location.href);
        const courseId = url.searchParams.get('courseId');
        const sectionId = url.searchParams.get('sectionId');
        
        this.logger.info(`📋 Extracted parameters: courseId=${courseId}, sectionId=${sectionId}`);
        
        return { courseId, sectionId };
    }
    
    /**
     * Generate public AACC link using the template
     */
    private generatePublicLink(courseId: string, sectionId: string): string {
        const publicLink = this.AACC_PUBLIC_TEMPLATE
            .replace('XXXXXX', courseId)
            .replace('XXXXXX', sectionId);
            
        this.logger.info(`🔗 Generated public link: ${publicLink}`);
        return publicLink;
    }
    
    /**
     * Add "Copy Direct Public Link" button to the page
     */
    private addCopyLinkButton(publicLink: string): void {
        // Remove existing button if present
        const existingButton = document.getElementById(this.BUTTON_ID);
        if (existingButton) {
            existingButton.remove();
        }
        
        // Create the button
        const button = document.createElement('button');
        button.id = this.BUTTON_ID;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71"/>
            </svg>
            Copy Direct Public Link to Section
        `;
        button.title = `Copy public link: ${publicLink}`;
        button.style.cssText = `
            background: linear-gradient(135deg, #2d8b8a, #236b6a);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 10px 0;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(45, 139, 138, 0.2);
        `;
        
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(45, 139, 138, 0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 4px rgba(45, 139, 138, 0.2)';
        });
        
        // Add click handler
        button.addEventListener('click', () => this.copyToClipboard(publicLink, button));
        
        // Find a good place to insert the button
        this.insertButtonInPage(button);
    }
    
    /**
     * Copy link to clipboard with user feedback
     */
    private async copyToClipboard(link: string, button: HTMLButtonElement): Promise<void> {
        try {
            await navigator.clipboard.writeText(link);
            
            // Success feedback
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
                Link Copied!
            `;
            button.style.background = 'linear-gradient(135deg, #28a745, #20a744)';
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = 'linear-gradient(135deg, #2d8b8a, #236b6a)';
            }, 2000);
            
            this.logger.success('📋 Public link copied to clipboard');
            
        } catch (error) {
            this.logger.error('❌ Failed to copy to clipboard:', error);
            
            // Fallback: show the link in an alert
            alert(`Copy this public link:\n\n${link}`);
        }
    }
    
    /**
     * Insert button at an appropriate location on the page
     */
    private insertButtonInPage(button: HTMLElement): void {
        // Try to find a good insertion point
        const insertionCandidates = [
            // Try to find the page header or title area
            () => document.querySelector('h1, h2, h3')?.parentElement,
            () => document.querySelector('.pageHeader'),
            () => document.querySelector('#content'),
            () => document.querySelector('form'),
            () => document.querySelector('.blueBorder'),
            () => document.body
        ];
        
        for (const candidate of insertionCandidates) {
            const element = candidate();
            if (element) {
                // Insert at the beginning of the found element
                element.insertBefore(button, element.firstChild);
                this.logger.info(`🎯 Button inserted into: ${element.tagName}.${element.className}`);
                return;
            }
        }
        
        // Fallback: append to body
        document.body.appendChild(button);
        this.logger.info('🎯 Button appended to document body (fallback)');
    }

    /**
     * Clean up course section functionality (remove button)
     */
    cleanup(): void {
        const button = document.getElementById(this.BUTTON_ID);
        if (button) {
            button.remove();
            this.logger.info('✅ Course section button removed');
        }
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

    if (message.action === 'toggleFeature') {
        const customizer = (window as any).d1Customizer;
        if (customizer) {
            customizer.toggleFeature(message.feature, message.enabled).then((success) => {
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