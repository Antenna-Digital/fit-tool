// Compass Teaser Assessment Application
// Main application logic and rendering

class CompassTeaserAssessment {
    constructor() {
        this.showResults = false;
        this.showContactForm = false;
        this.sliderValues = {};
        this.hasRendered = false; // Track if we've rendered before
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
        
        // Scroll to top of app element + 120px
        const appElement = document.getElementById('app');
        if (appElement) {
            const appTop = appElement.getBoundingClientRect().top + window.pageYOffset;
            const scrollPosition = appTop - 120;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
        
        // Animate score after render
        setTimeout(() => {
            this.animateScore(this.calculatedScore);
        }, 300);
        
        // Note: Webhook is only sent when user submits the contact form
    }

    handleToggleContactForm(event) {
        if (event) event.preventDefault();
        
        this.showContactForm = !this.showContactForm;
        
        // Just toggle the form visibility without re-rendering
        const contactForm = document.querySelector('.ct_contact-form');
        const button = event.target.closest('.button_main_wrap');
        
        if (contactForm) {
            if (this.showContactForm) {
                contactForm.classList.add('ct_visible');
                if (button) button.classList.add('ct_active');
            } else {
                contactForm.classList.remove('ct_visible');
                if (button) button.classList.remove('ct_active');
            }
        }
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
        
        // Convert scores array to object with attribute names as keys
        const detailedScores = {
            awake: scores.find(s => s.name === 'Awake')?.score || 0,
            aware: scores.find(s => s.name === 'Aware')?.score || 0,
            reflective: scores.find(s => s.name === 'Reflective')?.score || 0,
            attentive: scores.find(s => s.name === 'Attentive')?.score || 0,
            cogent: scores.find(s => s.name === 'Cogent')?.score || 0,
            sentient: scores.find(s => s.name === 'Sentient')?.score || 0,
            visionary: scores.find(s => s.name === 'Visionary')?.score || 0,
            intentional: scores.find(s => s.name === 'Intentional')?.score || 0
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
    }

    renderAssessmentView() {
        const gsapAttr = this.hasRendered ? '' : ' data-gsap-hide';
        
        const questionsHtml = COMPASS_QUESTIONS.map((q, index) => {
            const columnClass = index < 4 ? 'first' : 'second';
            const value = this.sliderValues[q.id];
            
            return `
                <div class="ct_question-group"${gsapAttr}>
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
                    <div class="ct_page-label"${gsapAttr}>THE CONSCIOUS COMPASS</div>
                    <h2 class="ct_h2 u-text-style-h3"${gsapAttr} style="margin-bottom: var(--_spacing---space--4);">How conscious is your brand?</h2>
                    <p class="ct_intro-text u-text-style-main"${gsapAttr} style="margin-bottom: var(--_spacing---space--6);">Our eight-question assessment is the start; it reveals where you're leading and where opportunity awaits across eight essential brand attributes:</p>
                    <div ${gsapAttr}>
                    <div class="ct_intro-text_attr_list">
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Awake</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>How well do you shape narratives and lead industry discourse?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Aware</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>Do you understand audiences and build trust?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Reflective</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>Do you have an authentic brand?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Attentive</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>Do you deliver exceptional, consistent experiences?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Cogent</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>Is your marketing driven by strategic insights and data?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Sentient</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>How well do you create emotional connections that inspire action?</span></p>
                    </div>
                    <div>
                    <p class="ct_intro-text_attr" ${gsapAttr}>Intentional</p>
                    <p class="ct_intro-text_attr_text u-text-style-main" ${gsapAttr}>Do you show up with substance, confidence, and leadership?</span></p>
                    </div>
                    </div>
                </div>
                </div>
                
                <div class="ct_questions-column">
                    ${firstColumnQuestions}
                </div>
                
                <div class="ct_questions-column">
                    ${secondColumnQuestions}
                </div>
                
                <div class="ct_submit-section" data-gsap-hide>
                    <div class="u-button-group">
                        <div data-wf--button-main--style="primary" class="button_main_wrap">
                            <div class="clickable_wrap u-cover-absolute">
                                <button type="button" class="clickable_btn" style="display: block;" onclick="app.handleShowResults(event)">
                                    <span class="clickable_text u-sr-only">See Results</span>
                                </button>
                            </div>
                            <div class="button_main_bg u-cover-absolute"></div>
                            <div class="button_main_icon_wrap is-optional">
                                <div class="u-display-contents"></div>
                            </div>
                            <div class="button_main_text_wrap">
                                <div aria-hidden="true" class="button_main_text u-text-style-h6 is-placeholder-text">See Results</div>
                                <div aria-hidden="true" class="button_main_text u-text-style-h6 is-default-text">See Results</div>
                                <div aria-hidden="true" class="button_main_text u-text-style-h6 is-hover-text">See Results</div>
                            </div>
                            <div class="button_main_icon_wrap is-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 19" fill="none" class="u-svg">
                                    <path d="M13.7231 3.24951L2.28467 3.24951L2.28467 1.09033L17.4106 1.09033L17.4106 16.2163L15.2515 16.2163L15.2515 4.77588L1.93701 18.0894L0.410644 16.563L13.7231 3.24951Z" fill="currentColor"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderQuestion(q) {
        const gsapAttr = this.hasRendered ? '' : ' data-gsap-hide';
        const value = this.sliderValues[q.id];
        return `
            <div class="ct_question-group"${gsapAttr}>
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
                        <div class="ct_score-number u-text-style-display" id="ct_scoreNumber">0</div>
                        <div class="ct_score-label u-text-style-h5">Your Indicative <strong>Brand Consciousness Score</strong></div>
                    </div>
                    <div class="ct_score-description u-text-style-main">${description}</div>
                </div>
                
                <div>
                    <div class="ct_cta-intro">
                        <div>
                            <h3 class="u-text-style-h4 u-mb-6">Ready to go deeper?</h3>
                            <p class="u-text-style-main">Two more ways to discover where your brand’s clarity, courage, and consequence can grow.</p>
                        </div>
                        <div class="ct_results-section">
                            <h4 class="ct_results-headline u-text-style-h5">Self-Assessment at FullyConscious.com</h4>
                            
                            <p class="ct_cta-intro-text u-text-style-main">Assess your brand’s consciousness. This guided experience measures your performance across eight defining attributes and delivers actionable insights to strengthen strategy, storytelling, and impact.</p>
                            
                            <div class="ct_cta-buttons-column">
                                <div class="u-button-group">
                                    <div data-wf--button-main--style="primary" class="button_main_wrap">
                                        <div class="clickable_wrap u-cover-absolute">
                                            <a target="_blank" href="https://www.fullyconscious.com" class="clickable_link w-inline-block">
                                                <span class="clickable_text u-sr-only">Take Me To fullyconscious.com</span>
                                            </a>
                                            <button type="button" class="clickable_btn">
                                                <span class="clickable_text u-sr-only">Take Me To fullyconscious.com</span>
                                            </button>
                                        </div>
                                        <div class="button_main_bg u-cover-absolute"></div>
                                        <div class="button_main_icon_wrap is-optional">
                                            <div class="u-display-contents"></div>
                                        </div>
                                        <div class="button_main_text_wrap">
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-placeholder-text">Take Me To fullyconscious.com</div>
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-default-text">Take Me To fullyconscious.com</div>
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-hover-text">Take Me To fullyconscious.com</div>
                                        </div>
                                        <div class="button_main_icon_wrap is-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 19" fill="none" class="u-svg">
                                                <path d="M13.7231 3.24951L2.28467 3.24951L2.28467 1.09033L17.4106 1.09033L17.4106 16.2163L15.2515 16.2163L15.2515 4.77588L1.93701 18.0894L0.410644 16.563L13.7231 3.24951Z" fill="currentColor"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div data-wf--button-main--style="primary" class="button_main_wrap">
                                        <div class="clickable_wrap u-cover-absolute">
                                            <button type="button" class="clickable_btn" onclick="app.handleTryAgain(event)">
                                                <span class="clickable_text u-sr-only">Try Again</span>
                                            </button>
                                        </div>
                                        <div class="button_main_bg u-cover-absolute"></div>
                                        <div class="button_main_icon_wrap is-optional">
                                            <div class="u-display-contents"></div>
                                        </div>
                                        <div class="button_main_text_wrap">
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-placeholder-text">Try Again</div>
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-default-text">Try Again</div>
                                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-hover-text">Try Again</div>
                                        </div>
                                        <div class="button_main_icon_wrap is-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 19" fill="none" class="u-svg">
                                                <path d="M13.7231 3.24951L2.28467 3.24951L2.28467 1.09033L17.4106 1.09033L17.4106 16.2163L15.2515 16.2163L15.2515 4.77588L1.93701 18.0894L0.410644 16.563L13.7231 3.24951Z" fill="currentColor"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="ct_results-section">
                            <h3 class="ct_results-headline u-text-style-h5">Comprehensive assessment powered by proprietary AI analysis.</h3>
                            
                            <p class="ct_cta-intro-text u-text-style-main">Partner with our team for a full-scale evaluation of your brand’s digital ecosystem. Using AI-driven analysis across 50+ criteria, we analyze how well your brand is optimized across social, earned, and owned channels—and evaluate its effectiveness in influencing reputation and building trust. Then, we deliver a clear snapshot of how your brand performs across all eight consciousness attributes, and where it can grow. </p>
                            
                            <div class="u-button-group">
                                <div data-wf--button-main--style="primary" class="button_main_wrap ${this.showContactForm ? 'ct_active' : ''}">
                                    <div class="clickable_wrap u-cover-absolute">
                                        <button type="button" class="clickable_btn" onclick="app.handleToggleContactForm(event)">
                                            <span class="clickable_text u-sr-only">Let's Chat</span>
                                        </button>
                                    </div>
                                    <div class="button_main_bg u-cover-absolute"></div>
                                    <div class="button_main_icon_wrap is-optional">
                                        <div class="u-display-contents"></div>
                                    </div>
                                    <div class="button_main_text_wrap">
                                        <div aria-hidden="true" class="button_main_text u-text-style-h6 is-placeholder-text">Let's Chat</div>
                                        <div aria-hidden="true" class="button_main_text u-text-style-h6 is-default-text">Let's Chat</div>
                                        <div aria-hidden="true" class="button_main_text u-text-style-h6 is-hover-text">Let's Chat</div>
                                    </div>
                                    <div class="button_main_icon_wrap is-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 19" fill="none" class="u-svg">
                                            <path d="M13.7231 3.24951L2.28467 3.24951L2.28467 1.09033L17.4106 1.09033L17.4106 16.2163L15.2515 16.2163L15.2515 4.77588L1.93701 18.0894L0.410644 16.563L13.7231 3.24951Z" fill="currentColor"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            ${this.renderContactForm()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderContactForm() {
        return `
            <div class="ct_contact-form ${this.showContactForm ? 'ct_visible' : ''}">
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
                <div class="u-button-group">
                    <div data-wf--button-main--style="primary" class="button_main_wrap">
                        <div class="clickable_wrap u-cover-absolute">
                            <button type="button" class="clickable_btn" style="display: block;" onclick="app.handleContactSubmit(event)">
                                <span class="clickable_text u-sr-only">Submit</span>
                            </button>
                        </div>
                        <div class="button_main_bg u-cover-absolute"></div>
                        <div class="button_main_icon_wrap is-optional">
                            <div class="u-display-contents"></div>
                        </div>
                        <div class="button_main_text_wrap">
                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-placeholder-text">Submit</div>
                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-default-text">Submit</div>
                            <div aria-hidden="true" class="button_main_text u-text-style-h6 is-hover-text">Submit</div>
                        </div>
                        <div class="button_main_icon_wrap is-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 18 19" fill="none" class="u-svg">
                                <path d="M13.7231 3.24951L2.28467 3.24951L2.28467 1.09033L17.4106 1.09033L17.4106 16.2163L15.2515 16.2163L15.2515 4.77588L1.93701 18.0894L0.410644 16.563L13.7231 3.24951Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                </div>
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
        
        // Mark that we've rendered at least once
        this.hasRendered = true;
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
