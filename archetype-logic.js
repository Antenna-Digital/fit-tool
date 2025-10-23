// Archetype Assessment Logic
// Core calculation and utility functions

function calculateScores(formData) {
    const scores = {
        architect: 0,
        visionary: 0,
        accelerator: 0,
        entrepreneur: 0
    };

    QUESTIONS.forEach(q => {
        const answer = formData[q.id];
        if (answer) {
            const selectedOption = q.options.find(opt => opt.value === answer);
            if (selectedOption) {
                scores[selectedOption.archetype] += 0.1;
            }
        }
    });

    return scores;
}

function getDominantArchetype(scores) {
    const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => b - a);
    
    const maxScore = sortedScores[0][1];
    const secondScore = sortedScores[1][1];
    
    // Check if all 4 archetypes are 20% or above AND none are 40% or above
    const allAbove20 = sortedScores.every(([_, score]) => score >= 0.2);
    const noneAbove40 = sortedScores.every(([_, score]) => score < 0.4);
    if (allAbove20 && noneAbove40) {
        return sortedScores.map(([archetype, _]) => archetype);
    }
    
    // Check if 3 or more archetypes have 30% or higher
    const archetypesAbove30 = sortedScores.filter(([_, score]) => score >= 0.3);
    if (archetypesAbove30.length >= 3) {
        return archetypesAbove30.map(([archetype, _]) => archetype);
    }
    
    // Get all archetypes with max score (tied for first)
    const dominants = sortedScores
        .filter(([_, score]) => score === maxScore)
        .map(([archetype, _]) => archetype);
    
    // If only one dominant and second place is 40% or higher, include it
    if (dominants.length === 1 && secondScore >= 0.4) {
        dominants.push(sortedScores[1][0]);
    }
    
    return dominants;
}

function getArchetypeKey(dominants) {
    if (dominants.length >= 3) {
        return 'multiple';
    } else if (dominants.length === 2) {
        // Sort alphabetically to match the description keys
        const sorted = [...dominants].sort();
        const key = `${sorted[0]}-${sorted[1]}`;
        // Check if this specific blend exists, otherwise return multiple
        if (ARCHETYPE_DESCRIPTIONS[key]) {
            return key;
        }
        return 'multiple';
    } else {
        return dominants[0];
    }
}

function animateScores(scores, callback) {
    const duration = 1500;
    const steps = 60;
    const increment = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        const animatedScores = {
            architect: Math.round(scores.architect * 100 * progress),
            visionary: Math.round(scores.visionary * 100 * progress),
            accelerator: Math.round(scores.accelerator * 100 * progress),
            entrepreneur: Math.round(scores.entrepreneur * 100 * progress)
        };
        
        callback(animatedScores);
        
        if (currentStep >= steps) {
            clearInterval(timer);
            callback({
                architect: Math.round(scores.architect * 100),
                visionary: Math.round(scores.visionary * 100),
                accelerator: Math.round(scores.accelerator * 100),
                entrepreneur: Math.round(scores.entrepreneur * 100)
            });
        }
    }, increment);
    
    return timer;
}

// Chevron icons as SVG strings
const ChevronRight = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
const ChevronLeft = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
