// Archetype Assessment Application
// Main application logic and rendering

class ArchetypeAssessment {
    constructor() {
        this.currentStep = -1;
        this.showResults = false;
        this.showError = false;
        this.showContactForm = false;
        this.animatedScores = {
            architect: 0,
            visionary: 0,
            accelerator: 0,
            entrepreneur: 0
        };
        this.formData = {
            name: '',
            organization: '',
            role: '',
            timeline: '',
            decisionMaking: '',
            innovation: '',
            partnership: '',
            budget: '',
            creative: '',
            communication: '',
            competitive: '',
            agencyIdeas: '',
            pastLessons: '',
            additional: ''
        };
        this.contactData = {
            name: '',
            organization: '',
            email: ''
        };
        this.animationTimer = null;
    }

    init() {
        this.render();
    }

    handleInputChange(field, value) {
        this.formData[field] = value;
        const wasShowingError = this.showError;
        this.showError = false;
        // Only re-render if we need to hide the error message
        if (wasShowingError) {
            this.render();
        }
    }

    handleStartAssessment() {
        if (this.formData.name && this.formData.organization && this.formData.role) {
            this.currentStep = 0;
            this.showError = false;
            this.render();
        } else {
            this.showError = true;
            this.render();
        }
    }

    handleNext() {
        if (this.currentStep < QUESTIONS.length - 1) {
            this.currentStep++;
            this.render();
        } else {
            this.showResults = true;
            this.render();
            this.startScoreAnimation();
        }
    }

    handleBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
        } else if (this.currentStep === 0) {
            this.currentStep = -1;
        }
        this.render();
    }

    handleContactChange(field, value) {
        this.contactData[field] = value;
        // Don't re-render to avoid losing focus
    }

    handleContactSubmit() {
        if (this.contactData.name && this.contactData.organization && this.contactData.email) {
            console.log('Contact form submitted:', this.contactData);
            alert('Thank you! We will be in touch soon.');
            this.showContactForm = false;
            this.contactData = {
                name: this.formData.name,
                organization: this.formData.organization,
                email: ''
            };
            this.render();
        } else {
            alert('Please complete all fields.');
        }
    }

    handleReset() {
        this.formData = {
            name: '',
            organization: '',
            role: '',
            timeline: '',
            decisionMaking: '',
            innovation: '',
            partnership: '',
            budget: '',
            creative: '',
            communication: '',
            competitive: '',
            agencyIdeas: '',
            pastLessons: '',
            additional: ''
        };
        this.currentStep = -1;
        this.showResults = false;
        this.showContactForm = false;
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
        }
        this.render();
    }

    toggleContactForm() {
        if (this.showContactForm) {
            this.showContactForm = false;
        } else {
            this.contactData = {
                name: this.formData.name,
                organization: this.formData.organization,
                email: ''
            };
            this.showContactForm = true;
        }
        this.render();
    }

    startScoreAnimation() {
        const scores = calculateScores(this.formData);
        this.animationTimer = animateScores(scores, (animatedScores) => {
            this.animatedScores = animatedScores;
            this.updateScoreDisplay();
        });
    }

    updateScoreDisplay() {
        document.getElementById('architect-score').textContent = this.animatedScores.architect + '%';
        document.getElementById('visionary-score').textContent = this.animatedScores.visionary + '%';
        document.getElementById('accelerator-score').textContent = this.animatedScores.accelerator + '%';
        document.getElementById('entrepreneur-score').textContent = this.animatedScores.entrepreneur + '%';
    }

    renderIntroScreen() {
        return `
            <div class="fit_container">
                <div class="fit_content" style="max-width: 64rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <p style="font-size: 1rem; font-weight: 700; color: black; margin-bottom: 0.5rem;">
                            <span class="fit_highlight">Let's get started</span>
                        </p>
                        <h1 class="fit_title-large">
                            Your Antenna <strong>FIT</strong> assessment.
                        </h1>
                    </div>
                    <p class="fit_text-small">
                        At Antenna Group, we know that great work starts with great relationships. We also understand that no two clients are exactly the same.
                    </p>
                    <p class="fit_text-small" style="margin-bottom: 2rem;">
                        FIT is our framework for smarter, more personalized client partnerships. It helps us tailor how we work with each client based on their unique goals, communication style, and definition of value.
                    </p>

                    <div style="max-width: 40rem; margin-bottom: 2rem;">
                        <div class="fit_form-group">
                            <label class="fit_form-label">Name</label>
                            <input
                                type="text"
                                class="fit_form-input"
                                data-field="name"
                                placeholder="Your name"
                                value="${this.formData.name}"
                                oninput="app.handleInputChange('name', this.value)"
                            />
                        </div>
                        <div class="fit_form-group">
                            <label class="fit_form-label">Organization</label>
                            <input
                                type="text"
                                class="fit_form-input"
                                data-field="organization"
                                placeholder="Your organization"
                                value="${this.formData.organization}"
                                oninput="app.handleInputChange('organization', this.value)"
                            />
                        </div>
                        <div class="fit_form-group">
                            <label class="fit_form-label">Role</label>
                            <input
                                type="text"
                                class="fit_form-input"
                                data-field="role"
                                placeholder="Your role"
                                value="${this.formData.role}"
                                oninput="app.handleInputChange('role', this.value)"
                            />
                        </div>
                    </div>

                    ${this.showError ? `
                        <div class="fit_error-box">
                            <p class="fit_error-text">Please complete all 3 fields to continue.</p>
                        </div>
                    ` : ''}

                    <button
                        onclick="app.handleStartAssessment()"
                        class="fit_button-swipe"
                    >
                        <span>START SELF-ASSESSMENT</span>
                        <span>${ChevronRight}</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderQuestionScreen() {
        const currentQuestion = QUESTIONS[this.currentStep];
        const progress = ((this.currentStep + 1) / QUESTIONS.length) * 100;

        return `
            <div class="fit_container">
                <div class="fit_content">
                    <div class="fit_progress-container">
                        <div class="fit_progress-header">
                            <span>Question ${this.currentStep + 1} of ${QUESTIONS.length}</span>
                            <span>${Math.round(progress)}% Complete</span>
                        </div>
                        <div class="fit_progress-bar">
                            <div class="fit_progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>

                    <h2 class="fit_question-title">${currentQuestion.question}</h2>
                    <p class="fit_question-description">${currentQuestion.description}</p>

                    <div class="fit_options-container">
                        ${currentQuestion.options.map(option => `
                            <label class="fit_option-swipe ${this.formData[currentQuestion.id] === option.value ? 'fit_selected' : ''}">
                                <input
                                    type="radio"
                                    name="${currentQuestion.id}"
                                    value="${option.value}"
                                    class="fit_sr-only"
                                    ${this.formData[currentQuestion.id] === option.value ? 'checked' : ''}
                                    onchange="app.handleInputChange('${currentQuestion.id}', '${option.value}')"
                                />
                                <span class="fit_option-text">${option.label}</span>
                            </label>
                        `).join('')}
                    </div>

                    <div class="fit_button-group">
                        <button
                            onclick="app.handleBack()"
                            class="fit_button-secondary"
                        >
                            <span>${ChevronLeft}</span>
                            <span>Back</span>
                        </button>
                        <button
                            onclick="app.handleNext()"
                            class="fit_button-swipe"
                            ${!this.formData[currentQuestion.id] ? 'disabled' : ''}
                        >
                            <span>${this.currentStep === QUESTIONS.length - 1 ? 'See Results' : 'Next'}</span>
                            <span>${ChevronRight}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderResultsScreen() {
        const scores = calculateScores(this.formData);
        const dominants = getDominantArchetype(scores);
        const archetypeKey = getArchetypeKey(dominants);
        const archetypeInfo = ARCHETYPE_DESCRIPTIONS[archetypeKey] || ARCHETYPE_DESCRIPTIONS[dominants[0]];

        return `
            <div style="min-height: 100vh; padding: 2rem; font-family: 'Inter', sans-serif; background-color: #E5E1DA;">
                <div class="fit_results-content" style="max-width: 96rem; margin: 0 auto;">
                    <p style="font-size: 1rem; font-weight: 700; color: black; margin-bottom: 0.5rem;">
                        <span class="fit_highlight">Your results</span>
                    </p>
                    <h1 class="fit_title-large">Welcome to your<br /><strong>partnership</strong> <strong>profile</strong></h1>
                    <p class="fit_text-small">
                        Thank you for sharing what you value most in an agency relationship.
                    </p>
                    <p class="fit_text-small" style="margin-bottom: 2rem;">
                        Below is a summary of what we have learnt.
                    </p>

                    <div class="fit_quadrant-container">
                        <svg class="fit_diagonal-lines">
                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#999" stroke-width="1" stroke-dasharray="4,4"/>
                            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#999" stroke-width="1" stroke-dasharray="4,4"/>
                        </svg>

                        <!-- Architect Quadrant (Top Left) -->
                        <div class="fit_quadrant" style="left: 0; top: 0;">
                            <div class="fit_quadrant-overlay" style="width: ${scores.architect * 100}%; height: ${scores.architect * 100}%; right: 0; bottom: 0; background-color: ${scores.architect > 0 ? '#dde32f' : 'transparent'};"></div>
                            <div class="fit_quadrant-content">
                                <h3 class="fit_quadrant-title" style="color: ${scores.architect > 0 ? 'black' : '#D1D5DB'};">ARCHITECT</h3>
                                <p class="fit_quadrant-score" style="color: ${scores.architect > 0 ? 'black' : '#D1D5DB'};" id="architect-score">${this.animatedScores.architect}%</p>
                            </div>
                        </div>

                        <!-- Visionary Quadrant (Top Right) -->
                        <div class="fit_quadrant" style="right: 0; top: 0;">
                            <div class="fit_quadrant-overlay" style="width: ${scores.visionary * 100}%; height: ${scores.visionary * 100}%; left: 0; bottom: 0; background-color: ${scores.visionary > 0 ? '#dde32f' : 'transparent'};"></div>
                            <div class="fit_quadrant-content">
                                <h3 class="fit_quadrant-title" style="color: ${scores.visionary > 0 ? 'black' : '#D1D5DB'};">VISIONARY</h3>
                                <p class="fit_quadrant-score" style="color: ${scores.visionary > 0 ? 'black' : '#D1D5DB'};" id="visionary-score">${this.animatedScores.visionary}%</p>
                            </div>
                        </div>

                        <!-- Accelerator Quadrant (Bottom Left) -->
                        <div class="fit_quadrant" style="left: 0; bottom: 0;">
                            <div class="fit_quadrant-overlay" style="width: ${scores.accelerator * 100}%; height: ${scores.accelerator * 100}%; right: 0; top: 0; background-color: ${scores.accelerator > 0 ? '#dde32f' : 'transparent'};"></div>
                            <div class="fit_quadrant-content">
                                <h3 class="fit_quadrant-title" style="color: ${scores.accelerator > 0 ? 'black' : '#D1D5DB'};">ACCELERATOR</h3>
                                <p class="fit_quadrant-score" style="color: ${scores.accelerator > 0 ? 'black' : '#D1D5DB'};" id="accelerator-score">${this.animatedScores.accelerator}%</p>
                            </div>
                        </div>

                        <!-- Entrepreneur Quadrant (Bottom Right) -->
                        <div class="fit_quadrant" style="right: 0; bottom: 0;">
                            <div class="fit_quadrant-overlay" style="width: ${scores.entrepreneur * 100}%; height: ${scores.entrepreneur * 100}%; left: 0; top: 0; background-color: ${scores.entrepreneur > 0 ? '#dde32f' : 'transparent'};"></div>
                            <div class="fit_quadrant-content">
                                <h3 class="fit_quadrant-title" style="color: ${scores.entrepreneur > 0 ? 'black' : '#D1D5DB'};">ENTREPRENEUR</h3>
                                <p class="fit_quadrant-score" style="color: ${scores.entrepreneur > 0 ? 'black' : '#D1D5DB'};" id="entrepreneur-score">${this.animatedScores.entrepreneur}%</p>
                            </div>
                        </div>

                        <!-- Axes -->
                        <div class="fit_axis-line-vertical"></div>
                        <div class="fit_axis-line-horizontal"></div>
                        
                        <!-- Arrows -->
                        <div class="fit_arrow fit_arrow-up"></div>
                        <div class="fit_arrow fit_arrow-down"></div>
                        <div class="fit_arrow fit_arrow-left"></div>
                        <div class="fit_arrow fit_arrow-right"></div>
                        
                        <!-- Labels -->
                        <div class="fit_axis-label fit_axis-label-top">Strategic/Creative</div>
                        <div class="fit_axis-label fit_axis-label-bottom">Pragmatic/Tactical</div>
                        <div class="fit_axis-label fit_axis-label-left">Structured/Systematic</div>
                        <div class="fit_axis-label fit_axis-label-right">Flexible/Adaptive</div>
                    </div>

                    <div class="fit_archetype-box">
                        <h2 class="fit_archetype-subtitle">Your Dominant Archetype:</h2>
                        <h3 class="fit_archetype-title">${archetypeInfo.title}</h3>
                        <p class="fit_archetype-description">${archetypeInfo.description}</p>
                    </div>

                    <div class="fit_results-buttons">
                        <a
                            href="https://antennagroup.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="fit_button-swipe fit_button-link"
                        >
                            <span>Visit Antenna Group</span>
                        </a>
                        
                        <button
                            onclick="app.toggleContactForm()"
                            class="fit_button-swipe"
                        >
                            <span>${this.showContactForm ? 'Hide Contact Form' : 'Talk To Us'}</span>
                        </button>
                        
                        <button
                            onclick="app.handleReset()"
                            class="fit_button-swipe"
                            style="color: #374151; border-color: #9CA3AF;"
                        >
                            <span>Try Again</span>
                        </button>
                    </div>

                    ${this.showContactForm ? this.renderContactForm() : ''}
                </div>
            </div>
        `;
    }

    renderContactForm() {
        return `
            <div class="fit_contact-form">
                <h3>Get in touch</h3>
                <div class="fit_form-group">
                    <label class="fit_form-label">Name</label>
                    <input
                        type="text"
                        class="fit_form-input"
                        data-field="contact-name"
                        placeholder="Your name"
                        value="${this.contactData.name}"
                        oninput="app.handleContactChange('name', this.value)"
                    />
                </div>
                <div class="fit_form-group">
                    <label class="fit_form-label">Organization</label>
                    <input
                        type="text"
                        class="fit_form-input"
                        data-field="contact-organization"
                        placeholder="Your organization"
                        value="${this.contactData.organization}"
                        oninput="app.handleContactChange('organization', this.value)"
                    />
                </div>
                <div class="fit_form-group">
                    <label class="fit_form-label">Email address</label>
                    <input
                        type="email"
                        class="fit_form-input"
                        data-field="contact-email"
                        placeholder="your.email@example.com"
                        value="${this.contactData.email}"
                        oninput="app.handleContactChange('email', this.value)"
                    />
                </div>
                <button
                    onclick="app.handleContactSubmit()"
                    class="fit_button-swipe"
                    style="width: 100%;"
                >
                    <span>Submit</span>
                </button>
            </div>
        `;
    }

    render() {
        const appElement = document.getElementById('app');
        const activeElement = document.activeElement;
        const activeElementId = activeElement ? activeElement.getAttribute('data-field') : null;
        const cursorPosition = activeElement && activeElement.selectionStart !== undefined ? activeElement.selectionStart : null;
        
        if (this.showResults) {
            appElement.innerHTML = this.renderResultsScreen();
        } else if (!this.formData.name || !this.formData.organization || !this.formData.role || this.currentStep === -1) {
            appElement.innerHTML = this.renderIntroScreen();
        } else {
            appElement.innerHTML = this.renderQuestionScreen();
        }
        
        // Restore focus and cursor position
        if (activeElementId && cursorPosition !== null) {
            const elementToFocus = document.querySelector(`[data-field="${activeElementId}"]`);
            if (elementToFocus) {
                elementToFocus.focus();
                if (elementToFocus.setSelectionRange) {
                    elementToFocus.setSelectionRange(cursorPosition, cursorPosition);
                }
            }
        }
    }
}

// Initialize the app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new ArchetypeAssessment();
        app.init();
    });
} else {
    app = new ArchetypeAssessment();
    app.init();
}
