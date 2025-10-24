// Compass Teaser Assessment Application
// Main application logic and rendering

class CompassTeaserAssessment {
    constructor() {
        this.showResults = false;
        this.showContactForm = false;
        this.sliderValues = {};
        this.notification = {
            show: false,
            message: '',
            type: 'success' // 'success', 'error', 'info'
        };
        
        // Initialize all slider values to 3 (middle position)
        COMPASS_QUESTIONS.forEach(q => {
            this.sliderValues[q.id] = 3;
        });
        
        this.contactData = {
            name: '',
            email: '',
            company: '',
            message: ''
        };
        
        this.calculatedScore = 0;
    }

    init() {
        this.render();
    }

    handleSliderChange(questionId, value) {
        this.sliderValues[questionId] = parseInt(value);
        this.render();
    }

    showNotification(message, type = 'success') {
        this.notification = {
            show: true,
            message: message,
            type: type
        };
        this.render();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        this.notification.show = false;
        this.render();
    }

    calculateScore() {
        let scores = [];
        COMPASS_QUESTIONS.forEach(q => {
            const value = this.sliderValues[q.id];
            scores.push({
                name: ATTRIBUTE_NAMES[q.id],
                score: SCORE_MAP[value]
            });
        });
        
        const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
        const avgScore = Math.round(totalScore / COMPASS_QUESTIONS.length);
        
        return { avgScore, scores };
    }

    getScoreDescription(avgScore, scores) {
        const sortedScores = [...scores].sort((a, b) => a.score - b.score);
        const lowest3 = sortedScores.slice(0, 3).map(item => item.name);
        return SCORE_DESCRIPTIONS.getDescription(avgScore, lowest3);
    }

    animateScore(targetScore) {
        const scoreElement = document.getElementById('ct_scoreNumber');
        if (!scoreElement) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = targetScore / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), targetScore);
            scoreElement.textContent = current;
            
            if (step >= steps || current >= targetScore) {
                clearInterval(timer);
                scoreElement.textContent = targetScore;
            }
        }, duration / steps);
    }

    getWebhookUrl() {
        const appElement = document.getElementById('app');
        const mode = appElement?.getAttribute('data-mode') || 'production';
        
        const urls = {
            production: 'https://antennagroup.app.n8n.cloud/webhook/14cb2342-5ecc-4dfb-8056-b9a5a2ab61a6',
            test: 'https://antennagroup.app.n8n.cloud/webhook-test/14cb2342-5ecc-4dfb-8056-b9a5a2ab61a6'
        };
        
        return urls[mode] || urls.production;
    }

    async sendToWebhook(data) {
        const webhookUrl = this.getWebhookUrl();
        
        try {
            console.log('=== WEBHOOK SUBMISSION START ===');
            console.log('Webhook URL:', webhookUrl);
            console.log('Payload:', JSON.stringify(data, null, 2));
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            console.log('Response statusText:', response.statusText);
            console.log('Response ok:', response.ok);

            // Try to read response body
            let responseBody;
            try {
                responseBody = await response.text();
                console.log('Response body:', responseBody);
            } catch (e) {
                console.log('Could not read response body:', e);
            }

            if (response.ok || response.status === 200) {
                console.log('✅ Data successfully sent to webhook');
                console.log('=== WEBHOOK SUBMISSION END ===');
                return true;
            } else {
                console.error('❌ Webhook returned error status:', response.status);
                console.error('Response body:', responseBody);
                console.log('=== WEBHOOK SUBMISSION END ===');
                return false;
            }
        } catch (error) {
            console.error('❌ Exception during webhook submission');
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.log('=== WEBHOOK SUBMISSION END ===');
            return false;
        }
    }

    handleShowResults(event) {
        if (event) event.preventDefault();
        
        this.showResults = true;
        this.calculatedScore = this.calculateScore().avgScore;
        this.render();
        
        // Animate score after render
        setTimeout(() => {
            this.animateScore(this.calculatedScore);
        }, 300);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Note: Webhook is only sent when user submits the contact form
    }

    handleToggleContactForm(event) {
        if (event) event.preventDefault();
        
        this.showContactForm = !this.showContactForm;
        this.render();
    }

    handleContactChange(field, value) {
        this.contactData[field] = value;
    }

    async handleContactSubmit(event) {
        if (event) event.preventDefault();
        
        if (!this.contactData.name || !this.contactData.email || !this.contactData.company) {
            this.showNotification('Please complete all required fields.', 'error');
            return;
        }
        
        const { avgScore, scores } = this.calculateScore();
        
        // Convert scores array to camelCase object
        const detailedScores = {
            industryInfluence: scores.find(s => s.name === 'Industry Influence')?.score || 0,
            audienceTrust: scores.find(s => s.name === 'Audience Trust')?.score || 0,
            brandAuthenticity: scores.find(s => s.name === 'Brand Authenticity')?.score || 0,
            contentQuality: scores.find(s => s.name === 'Content Quality')?.score || 0,
            audienceTargeting: scores.find(s => s.name === 'Audience Targeting')?.score || 0,
            creativeImpact: scores.find(s => s.name === 'Creative Impact')?.score || 0,
            visionMomentum: scores.find(s => s.name === 'Vision & Momentum')?.score || 0,
            leadershipCredibility: scores.find(s => s.name === 'Leadership Credibility')?.score || 0
        };
        
        // Send contact form data with assessment results to webhook
        const payload = {
            timestamp: new Date().toISOString(),
            assessmentType: 'compass-teaser',
            contactFormSubmitted: true,
            contactInfo: this.contactData,
            score: avgScore,
            responses: this.sliderValues,
            detailedScores: detailedScores
        };
        
        try {
            const success = await this.sendToWebhook(payload);
            
            if (success) {
                this.showNotification('Thank you! We will be in touch soon.', 'success');
                this.contactData = { name: '', email: '', company: '', message: '' };
                this.showContactForm = false;
                this.render();
            } else {
                // Check console for details
                console.error('Webhook returned non-success response. Check console logs above for details.');
                this.showNotification('There was an error submitting your information. Please check the browser console for details.', 'error');
            }
        } catch (error) {
            console.error('Unexpected error in handleContactSubmit:', error);
            this.showNotification('There was an unexpected error. Please check the browser console for details.', 'error');
        }
    }

    handleTryAgain(event) {
        if (event) event.preventDefault();
        
        // Reset all sliders to default
        COMPASS_QUESTIONS.forEach(q => {
            this.sliderValues[q.id] = 3;
        });
        
        this.showResults = false;
        this.showContactForm = false;
        this.contactData = { name: '', email: '', company: '', message: '' };
        
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderAssessmentView() {
        const questionsHtml = COMPASS_QUESTIONS.map((q, index) => {
            const columnClass = index < 4 ? 'first' : 'second';
            const value = this.sliderValues[q.id];
            
            return `
                <div class="ct_question-group" [data-gsap-hide]>
                    <div class="ct_question-text">${q.text}</div>
                    <div class="ct_slider-container">
                        <input type="range" min="1" max="5" value="${value}" class="ct_slider" id="${q.id}"
                            oninput="app.handleSliderChange('${q.id}', this.value)">
                        <div class="ct_slider-labels">
                            ${q.labels.map((label, i) => `
                                <span class="${i === value - 1 ? 'ct_active' : ''}">${label}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        const firstColumnQuestions = COMPASS_QUESTIONS.slice(0, 4).map(q => this.renderQuestion(q)).join('');
        const secondColumnQuestions = COMPASS_QUESTIONS.slice(4, 8).map(q => this.renderQuestion(q)).join('');
        
        return `
            <div class="ct_assessment-view">
                <div class="ct_header-section">
                    <div class="ct_page-label">HOW CONSCIOUS ARE YOU?</div>
                    <h2 class="ct_h2 u-text-style-h2">Perspective is everything,</h2>
                    <div class="ct_sub-heading u-text-style-h5">how conscious do you think your brand is?</div>
                    <p class="ct_intro-text u-text-style-main">Consequential brands are conscious brands.</p>
                    <p class="ct_intro-text ct_intro-text-emphasis u-text-style-main">Take two minutes to honestly assess where your brand stands across eight critical dimensions. Discover your score, see what's possible, then let's talk about unlocking your brand's full potential.</p>
                </div>
                
                <div class="ct_questions-column">
                    ${firstColumnQuestions}
                </div>
                
                <div class="ct_questions-column">
                    ${secondColumnQuestions}
                </div>
                
                <div class="ct_submit-section">
                    <button type="button" class="ct_btn-submit" onclick="app.handleShowResults(event)">See Results</button>
                </div>
            </div>
        `;
    }
    
    renderQuestion(q) {
        const value = this.sliderValues[q.id];
        return `
            <div class="ct_question-group">
                <div class="ct_question-text u-text-style-main">${q.text}</div>
                <div class="ct_slider-container">
                    <div class="ct_radio-track"></div>
                    <div class="ct_radio-options">
                        ${q.labels.map((label, i) => {
                            const position = i + 1;
                            const isActive = position === value;
                            return `
                                <label class="ct_radio-option">
                                    <input 
                                        type="radio" 
                                        name="${q.id}" 
                                        value="${position}"
                                        ${isActive ? 'checked' : ''}
                                        onchange="app.handleSliderChange('${q.id}', ${position})"
                                    >
                                    <span class="ct_radio-dot ${isActive ? 'ct_active' : ''}"></span>
                                    <span class="ct_radio-label u-text-style-small ${isActive ? 'ct_active' : ''}">${label}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderResultsView() {
        const { avgScore, scores } = this.calculateScore();
        const description = this.getScoreDescription(avgScore, scores);
        
        return `
            <div class="ct_results-view ct_active">
                <div class="ct_results-left">
                    <div class="ct_page-label">WHAT IS THIS TELLING US?</div>
                    <div class="ct_score-display">
                        <div class="ct_score-number" id="ct_scoreNumber">0</div>
                        <div class="ct_score-label u-text-style-h5">Your Indicative <strong>Brand Consciousness Score</strong></div>
                    </div>
                    <div class="ct_score-description u-text-style-main">${description}</div>
                </div>
                
                <div>
                    <div class="ct_cta-intro">
                        <p class="ct_cta-intro-text u-text-style-main">This is just an introduction to brand consciousness. If you are looking to make a real impact with your brand, please either take our broader self-assessment or connect with us to discuss a brand deep dive geared toward realizing your brand's potential.</p>
                        <div class="ct_cta-buttons">
                            <button class="ct_btn-cta-primary ${this.showContactForm ? 'ct_active' : ''}" onclick="app.handleToggleContactForm(event)">Let's Chat</button>
                            <button class="ct_btn-cta-secondary" onclick="window.location.href='#broader-assessment'">Try Our Broader Self Assessment</button>
                            <button class="ct_btn-cta-tertiary" onclick="app.handleTryAgain(event)">Try Again</button>
                        </div>
                    </div>
                    
                    ${this.showContactForm ? this.renderContactForm() : ''}
                </div>
            </div>
        `;
    }
    
    renderContactForm() {
        return `
            <div class="ct_contact-form ct_visible">
                <h3 class="u-text-style-h5">Let's Chat</h3>
                <div class="ct_form-group">
                    <label class="u-text-style-small">Name</label>
                    <input type="text" value="${this.contactData.name}" 
                        oninput="app.handleContactChange('name', this.value)" 
                        placeholder="Your name" required>
                </div>
                <div class="ct_form-group">
                    <label class="u-text-style-small">Email</label>
                    <input type="email" value="${this.contactData.email}" 
                        oninput="app.handleContactChange('email', this.value)" 
                        placeholder="your@email.com" required>
                </div>
                <div class="ct_form-group">
                    <label class="u-text-style-small">Company</label>
                    <input type="text" value="${this.contactData.company}" 
                        oninput="app.handleContactChange('company', this.value)" 
                        placeholder="Your company" required>
                </div>
                <div class="ct_form-group">
                    <label class="u-text-style-small">Message</label>
                    <textarea oninput="app.handleContactChange('message', this.value)" 
                        placeholder="Tell us about your brand goals...">${this.contactData.message}</textarea>
                </div>
                <button type="button" class="ct_btn-chat" onclick="app.handleContactSubmit(event)">Submit</button>
            </div>
        `;
    }
    
    renderNotification() {
        if (!this.notification.show) return '';
        
        const iconMap = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };
        
        return `
            <div class="ct_notification ct_notification-${this.notification.type}">
                <div class="ct_notification-content">
                    <span class="ct_notification-icon">${iconMap[this.notification.type]}</span>
                    <span class="ct_notification-message">${this.notification.message}</span>
                    <button class="ct_notification-close" onclick="app.hideNotification()">×</button>
                </div>
            </div>
        `;
    }
    
    render() {
        const appElement = document.getElementById('app');
        if (!appElement) return;
        
        let content = '';
        if (this.showResults) {
            content = this.renderResultsView();
        } else {
            content = this.renderAssessmentView();
        }
        
        // Add notification overlay
        content += this.renderNotification();
        
        appElement.innerHTML = content;
    }
}

// Initialize the app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new CompassTeaserAssessment();
        app.init();
    });
} else {
    app = new CompassTeaserAssessment();
    app.init();
}
