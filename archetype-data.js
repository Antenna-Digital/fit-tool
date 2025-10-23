// Archetype Assessment Data
// Questions and archetype descriptions

const QUESTIONS = [
    {
        id: 'timeline',
        question: 'Timeline & Success Definition',
        description: 'When do you consider a project successful?',
        options: [
            { value: 'strategic', label: 'When our strategic objectives are met', archetype: 'architect' },
            { value: 'breakthrough', label: 'When we achieve authentic breakthrough/ when our industry recognizes our value', archetype: 'visionary' },
            { value: 'kpis', label: 'When we hit measurable KPIs', archetype: 'accelerator' },
            { value: 'quickWins', label: 'Quick wins while we scale/ when our revenue increases', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'decisionMaking',
        question: 'Decision-Making Authority',
        description: 'How are decisions typically made?',
        options: [
            { value: 'formal', label: 'Board/committee approval/ formal process', archetype: 'architect' },
            { value: 'vision', label: 'I decide based on creative vision/ quality of ideas', archetype: 'visionary' },
            { value: 'data', label: 'Data justifies each decision', archetype: 'accelerator' },
            { value: 'quick', label: 'My call/ quick team consensus', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'innovation',
        question: 'Innovation & Risk Approach',
        description: 'How do you approach new ideas and risk?',
        options: [
            { value: 'proven', label: 'Proven strategies with careful testing/ risk mitigation', archetype: 'architect' },
            { value: 'breakthrough', label: 'Love breakthrough creative/ willing to be first', archetype: 'visionary' },
            { value: 'test', label: 'Test small, scale proven winners/ measured experimentation', archetype: 'accelerator' },
            { value: 'fast', label: 'Move fast, fail cheap', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'partnership',
        question: 'Proactive Partnership Expectations',
        description: 'What do you expect from agency partners?',
        options: [
            { value: 'strategic', label: 'Ongoing strategic recommendations/ regular strategic insights', archetype: 'architect' },
            { value: 'creative', label: 'Constant creative inspiration/ proactive breakthrough opportunities', archetype: 'visionary' },
            { value: 'optimization', label: 'Proactive performance optimization ideas/ efficiency improvements', archetype: 'accelerator' },
            { value: 'growth', label: 'Growth tactics/whatever helps us move faster', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'budget',
        question: 'Budget Philosophy & Flexibility',
        description: 'How do you approach budget allocation?',
        options: [
            { value: 'planned', label: 'Annual strategic allocation/ planned budget categories only', archetype: 'architect' },
            { value: 'bigIdeas', label: 'Invest in big ideas/ we\'re flexible for the right opportunities', archetype: 'visionary' },
            { value: 'performance', label: 'Performance-justified spend/ we allocate based on results', archetype: 'accelerator' },
            { value: 'scale', label: 'Test budgets that scale/double down on what works', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'creative',
        question: 'Creative Boundaries & Brand Guidelines',
        description: 'How important are brand guidelines?',
        options: [
            { value: 'compliance', label: 'Brand compliance/consistency is critical', archetype: 'architect' },
            { value: 'push', label: 'Push creative boundaries/ be authentic to our brand and culture', archetype: 'visionary' },
            { value: 'conversion', label: 'Creative focused on conversion/ performance-driven creativity', archetype: 'accelerator' },
            { value: 'works', label: 'Whatever works/ respond to the market', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'communication',
        question: 'Communication & Reporting Style',
        description: 'How do you prefer to communicate with partners?',
        options: [
            { value: 'formal', label: 'Formal reports and reviews/ documented progress', archetype: 'architect' },
            { value: 'creative', label: 'Creative journey sharing/ collaborative check-ins', archetype: 'visionary' },
            { value: 'dashboards', label: 'Performance dashboards/ optimization reports', archetype: 'accelerator' },
            { value: 'quick', label: 'Quick updates/ real-time communication', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'competitive',
        question: 'Competitive Urgency & Market Pressure',
        description: 'What drives your competitive strategy?',
        options: [
            { value: 'positioning', label: 'Strategic market positioning/ competitive differentiation', archetype: 'architect' },
            { value: 'cultural', label: 'Cultural relevance/ authentic brand evolution', archetype: 'visionary' },
            { value: 'metrics', label: 'Measurable market share gains/ clear competitive metrics', archetype: 'accelerator' },
            { value: 'window', label: 'Market window closing/ competitor threat', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'agencyIdeas',
        question: 'Agency Ideas & Initiative',
        description: 'What kind of ideas do you value from agencies?',
        options: [
            { value: 'strategic', label: 'Strategic counsel with proven approaches/ thoughtful recommendations', archetype: 'architect' },
            { value: 'breakthrough', label: 'Challenge us creatively/ bring breakthrough ideas', archetype: 'visionary' },
            { value: 'optimization', label: 'Optimization ideas and efficiency improvements/ data-backed recommendations', archetype: 'accelerator' },
            { value: 'results', label: 'Whatever drives results/ growth-focused ideas', archetype: 'entrepreneur' }
        ]
    },
    {
        id: 'pastLessons',
        question: 'Past Agency Relationship Lessons',
        description: 'What have been pain points with past agencies?',
        options: [
            { value: 'process', label: 'Process failures/ lack of strategic insight', archetype: 'architect' },
            { value: 'mediocrity', label: 'Creative mediocrity/ failure to understand you', archetype: 'visionary' },
            { value: 'performance', label: 'Performance gaps/ missing transparency', archetype: 'accelerator' },
            { value: 'slow', label: 'Slowness and rigidity', archetype: 'entrepreneur' }
        ]
    }
];

const ARCHETYPE_DESCRIPTIONS = {
    architect: {
        title: 'ARCHITECT',
        description: 'You are a strategic leader who values systematic approaches and long-term brand building. You prefer formal processes, detailed planning, and stakeholder alignment. Success means achieving your strategic objectives through proven methodologies. You see value in consultative partnerships that integrate seamlessly with your corporate structures and deliver measurable brand impact over time.'
    },
    visionary: {
        title: 'VISIONARY',
        description: 'You are a creative innovator who prioritizes authentic brand expression, craft, and cultural impact. You thrive on collaborative partnerships that push creative boundaries and challenge conventional thinking. Success means breakthrough ideas that differentiate your brand. You value agencies that bring bold inspiration, understand your mission, and aren\'t afraid to take creative risks to cut through the noise.'
    },
    accelerator: {
        title: 'ACCELERATOR',
        description: 'You are a performance-focused manager who demands measurable results and operational efficiency. You prefer data-driven partnerships with transparent reporting and continuous optimization. Success means hitting specific KPIs within 90 days. You value agencies that deliver proven tactics, provide real-time performance insights, and consistently improve ROI through systematic testing and refinement.'
    },
    entrepreneur: {
        title: 'ENTREPRENEUR',
        description: 'You are a fast-moving business builder who needs flexible, responsive partnerships that adapt to changing priorities. You prefer action-oriented collaboration with quick wins and iterative learning. Success means rapid business growth and market opportunity capture. You value agencies that move at your pace, maximize limited resources, and bring growth-focused ideas.'
    },
    'accelerator-architect': {
        title: 'ARCHITECT & ACCELERATOR',
        description: 'You are a strategic optimizer who values systematic approaches backed by measurable outcomes. You prefer formal processes and detailed planning that deliver demonstrable results and continuous improvement. Success means achieving your strategic objectives through data-driven methodologies and proven tactics. You see value in consultative partnerships that provide both long-term brand building and real-time performance insights, integrating seamlessly with your corporate structures while consistently improving ROI.'
    },
    'accelerator-entrepreneur': {
        title: 'ACCELERATOR & ENTREPRENEUR',
        description: 'You are a growth-focused optimizer who demands measurable results with maximum speed and flexibility. You prefer data-driven approaches that adapt quickly to changing priorities and deliver rapid wins. Success means hitting specific KPIs while capturing market opportunities through iterative learning. You value partnerships that bring both proven performance tactics and nimble execution, providing real-time insights while moving at your pace to consistently improve ROI and drive business growth.'
    },
    'accelerator-visionary': {
        title: 'VISIONARY & ACCELERATOR',
        description: 'You are a performance-driven creative who demands breakthrough ideas that deliver measurable results. You thrive on bold innovation grounded in data and continuous optimization. Success means creative differentiation that hits specific KPIs and drives tangible business outcomes. You value partnerships that bring both creative inspiration and performance rigor, challenging conventions while providing transparent reporting and systematically improving ROI through testing and refinement.'
    },
    'architect-entrepreneur': {
        title: 'ARCHITECT & ENTREPRENEUR',
        description: 'You are a strategic builder who balances systematic planning with adaptive execution. You value formal processes that can flex to capture emerging opportunities without sacrificing long-term objectives. Success means achieving your strategic goals while maintaining the agility to pivot when market conditions change. You seek consultative partnerships that bring both proven methodologies and growth-focused ideas, delivering measurable brand impact while moving at the pace your business demands.'
    },
    'architect-visionary': {
        title: 'ARCHITECT & VISIONARY',
        description: 'You are a strategic creative who combines systematic thinking with bold vision. You value long-term brand building through innovative approaches that challenge conventions while maintaining structural integrity. Success means achieving breakthrough ideas that are grounded in proven methodologies and stakeholder alignment. You seek consultative partnerships that bring both strategic rigor and creative inspiration, integrating seamlessly with your corporate structures while pushing boundaries to deliver differentiated brand impact over time.'
    },
    'entrepreneur-visionary': {
        title: 'VISIONARY & ENTREPRENEUR',
        description: 'You are an agile innovator who combines creative vision with rapid execution. You thrive on breakthrough ideas that can be quickly tested, learned from, and scaled. Success means authentic brand differentiation achieved through fast-moving, iterative collaboration. You value partnerships that bring bold creative inspiration and growth-focused agility, understanding your mission while moving at your pace to capture market opportunities and maximize impact with available resources.'
    },
    'multiple': {
        title: 'MIXED EXPECTATIONS',
        description: 'Your results reveal evenly distributed priorities across three or more distinct archetypes, each representing fundamentally different partnership expectations. The Architect values systematic planning and formal processes, while the Visionary seeks bold creative risks. The Accelerator demands data-driven performance and rapid optimization, whereas the Entrepreneur prioritizes flexible, adaptive execution. These perspectives can sometimes pull in contradictory directions. We recommend a deeper conversation to explore how these different expectations might be prioritized, sequenced, or balanced based on your specific business context and current challenges. Let\'s discuss which approach should lead at different stages of our partnership.'
    }
};
