// Compass Teaser Assessment Data
// Questions, scoring, and descriptions

const COMPASS_QUESTIONS = [
    {
        id: 'awake',
        text: 'How effectively does your brand influence industry conversations?',
        labels: [
            'No influence',
            'Rarely cited',
            'Some presence',
            'Regular voice',
            'Industry leader'
        ]
    },
    {
        id: 'aware',
        text: 'How deeply does your brand understand and build trust with audiences?',
        labels: [
            'Disconnected',
            'Basic awareness',
            'Adequate trust',
            'Strong connection',
            'Deeply trusted'
        ]
    },
    {
        id: 'reflective',
        text: 'How authentic is your brand promise when compared to reality?',
        labels: [
            'Inauthentic',
            'Gaps exist',
            'Mostly aligned',
            'Strong alignment',
            'Fully authentic'
        ]
    },
    {
        id: 'attentive',
        text: 'How exceptional is the quality of your content and brand experience?',
        labels: [
            'Poor quality',
            'Inconsistent',
            'Adequate',
            'High quality',
            'Flawless'
        ]
    },
    {
        id: 'cogent',
        text: 'How targeted is your brand for your audiences and channels?',
        labels: [
            'No segmentation',
            'Limited targeting',
            'Some targeting',
            'Effective targeting',
            'Ongoing optimization'
        ]
    },
    {
        id: 'sentient',
        text: 'How effectively does your brand\'s creative inspire action among your target audience?',
        labels: [
            'No creative',
            'It\'s ineffective',
            'Could be better',
            'It\'s adequate',
            'Award winning'
        ]
    },
    {
        id: 'visionary',
        text: 'How clear is your future vision, and how visible is your momentum?',
        labels: [
            'No vision',
            'Vague direction',
            'Some clarity',
            'Clear vision',
            'It\'s inspiring audiences'
        ]
    },
    {
        id: 'intentional',
        text: 'What is the perception of the credibility of your leadership team?',
        labels: [
            'Weak',
            'Uncertain',
            'Adequate',
            'Strong',
            'Exceptional'
        ]
    }
];

const SCORE_MAP = {
    1: 15,
    2: 40,
    3: 60,
    4: 80,
    5: 100
};

const ATTRIBUTE_NAMES = {
    awake: 'Awake',
    aware: 'Aware',
    reflective: 'Reflective',
    attentive: 'Attentive',
    cogent: 'Cogent',
    sentient: 'Sentient',
    visionary: 'Visionary',
    intentional: 'Intentional'
};

const SCORE_DESCRIPTIONS = {
    getDescription: function(avgScore, lowest3) {
        if (avgScore < 70) {
            if (avgScore >= 60) {
                return `Your brand has established a baseline of consciousness, but there are clear opportunities for enhancement. Your assessment reveals particular gaps in ${lowest3[0]}, ${lowest3[1]}, and ${lowest3[2]}. These areas represent significant opportunities to strengthen your brand's market position and effectiveness. We recommend a follow-up conversation to develop a targeted strategy for improving these critical attributes and accelerating your brand's conscious evolution.`;
            } else if (avgScore >= 45) {
                return `Your brand shows awareness and potential, but strategic improvements are needed across multiple attributes to reach full consciousness. The assessment highlights challenges particularly in ${lowest3[0]}, ${lowest3[1]}, and ${lowest3[2]}. Addressing these foundational gaps will be critical to your brand's growth and market impact. Let's schedule a conversation to explore how we can help you develop a comprehensive transformation roadmap and prioritize the initiatives that will deliver the greatest impact.`;
            } else {
                return `Your brand requires comprehensive strategic and execution improvements to develop consciousness and compete effectively. The assessment shows significant challenges in ${lowest3[0]}, ${lowest3[1]}, and ${lowest3[2]}, among other areas. This presents both a challenge and a tremendous opportunity for transformation. We strongly recommend a follow-up conversation to understand your brand's current state, business objectives, and develop a structured plan to build the foundational capabilities needed for conscious brand leadership.`;
            }
        } else {
            if (avgScore >= 90) {
                return "Exceptional! Your brand demonstrates exemplary consciousness across all attributes with authentic, data-driven, creative execution at the highest level. To gain even deeper insights and validate these strong results, we encourage you to explore Antenna Group's comprehensive Brand Consciousness Assessment. This detailed analysis evaluates your brand across owned, earned, paid, and social channels, providing external validation and actionable intelligence to maintain your competitive edge.";
            } else if (avgScore >= 75) {
                return "Strong performance! Your brand shows high consciousness with solid execution across most attributes. You're well-positioned to lead in your market. To further optimize your brand strategy and identify specific opportunities for enhancement, consider Antenna Group's comprehensive Brand Consciousness Assessment. For a modest investment, you'll receive deep analysis across multiple channels including owned, earned, paid, and social media, plus detailed benchmarking and recommendations to elevate your brand to exceptional status.";
            } else {
                return "Solid baseline! Your brand has established consciousness standards with clear opportunities for enhancement across several attributes. To identify exactly where to focus your efforts for maximum impact, we recommend Antenna Group's comprehensive Brand Consciousness Assessment. This detailed evaluation across owned, earned, paid, and social channels will reveal specific gaps and opportunities, providing you with a data-driven roadmap to accelerate your brand's evolution and competitive positioning.";
            }
        }
    }
};
