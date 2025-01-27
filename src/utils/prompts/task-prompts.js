export const taskPrompts = {
  codeReview: `I will review your code with focus on:
- Code quality and readability
- Performance optimizations
- Security vulnerabilities
- Best practices adherence
- Potential improvements
I provide constructive feedback with examples.`,

  debugging: `I will help debug your issue by:
- Analyzing the error messages
- Identifying root causes
- Suggesting solutions
- Preventing future occurrences
- Improving error handling
I provide step-by-step debugging guidance.`,

  architecture: `I will help design your system by:
- Understanding requirements
- Proposing scalable solutions
- Considering trade-offs
- Planning for growth
- Ensuring maintainability
I provide detailed architecture diagrams and explanations.`,

  security: `I will assess security by:
- Identifying vulnerabilities
- Recommending fixes
- Implementing best practices
- Ensuring data protection
- Adding security layers
I provide comprehensive security recommendations.`,

  performance: `I will optimize performance by:
- Identifying bottlenecks
- Measuring metrics
- Implementing solutions
- Monitoring improvements
- Preventing regressions
I provide measurable performance improvements.`,

  testing: `I will help with testing by:
- Designing test cases
- Writing unit tests
- Implementing integration tests
- Setting up CI/CD
- Ensuring coverage
I provide comprehensive testing strategies.`,

  deployment: `I will assist with deployment by:
- Setting up pipelines
- Configuring environments
- Automating processes
- Monitoring systems
- Handling rollbacks
I provide reliable deployment solutions.`,

  refactoring: `I will help refactor code by:
- Identifying technical debt
- Improving structure
- Enhancing readability
- Maintaining functionality
- Adding documentation
I provide clean and maintainable code solutions.`
};

export const getTaskPrompt = (taskType, context = {}) => {
  const taskPrefix = taskPrompts[taskType] || '';
  const { 
    currentState,
    desiredOutcome,
    constraints,
    technologies,
    priority
  } = context;

  let prompt = taskPrefix + '\n\n';

  if (currentState) {
    prompt += `Current State:\n${currentState}\n\n`;
  }

  if (desiredOutcome) {
    prompt += `Desired Outcome:\n${desiredOutcome}\n\n`;
  }

  if (constraints) {
    prompt += `Constraints:\n${constraints.map(c => `- ${c}`).join('\n')}\n\n`;
  }

  if (technologies) {
    prompt += `Technologies:\n${technologies.map(t => `- ${t}`).join('\n')}\n\n`;
  }

  if (priority) {
    prompt += `Priority Focus:\n- ${priority}\n\n`;
  }

  prompt += `I will approach this task with:
1. Clear understanding of requirements
2. Systematic problem-solving
3. Best practices implementation
4. Detailed documentation
5. Future-proof solutions`;

  return prompt;
};

export const combinePrompts = (basePrompt, rolePrompt, taskPrompt) => {
  return `${basePrompt}\n\n${rolePrompt}\n\n${taskPrompt}`;
}; 