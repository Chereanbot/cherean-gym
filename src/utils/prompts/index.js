import { basePrompt, formatResponse, getSystemPrompt } from './base-prompt';
import { rolePrefixes, getRolePrompt } from './role-prompts';
import { taskPrompts, getTaskPrompt, combinePrompts } from './task-prompts';

export class PromptManager {
  constructor(config = {}) {
    this.config = {
      defaultRole: 'developer',
      maxHistoryLength: 10,
      includeTimestamps: true,
      ...config
    };
  }

  async generatePrompt({
    role = this.config.defaultRole,
    task = null,
    context = {},
    user = null,
    history = [],
    customInstructions = null
  }) {
    // Get base system prompt
    const systemPrompt = getSystemPrompt({
      user,
      previousMessages: this.processHistory(history),
      customInstructions
    });

    // Get role-specific prompt
    const rolePrompt = getRolePrompt(role, {
      task: context.task,
      requirements: context.requirements,
      constraints: context.constraints
    });

    // Get task-specific prompt if task is specified
    let taskPrompt = '';
    if (task) {
      taskPrompt = getTaskPrompt(task, {
        currentState: context.currentState,
        desiredOutcome: context.desiredOutcome,
        constraints: context.constraints,
        technologies: context.technologies,
        priority: context.priority
      });
    }

    // Combine all prompts
    return combinePrompts(systemPrompt, rolePrompt, taskPrompt);
  }

  processHistory(history) {
    if (!history || !Array.isArray(history)) return [];

    return history
      .slice(-this.config.maxHistoryLength)
      .map(msg => ({
        ...msg,
        timestamp: this.config.includeTimestamps 
          ? new Date(msg.timestamp).toISOString()
          : undefined
      }));
  }

  formatResponse(response) {
    return formatResponse(response);
  }

  getAvailableRoles() {
    return Object.keys(rolePrefixes);
  }

  getAvailableTasks() {
    return Object.keys(taskPrompts);
  }

  validateContext(context) {
    const requiredFields = ['task', 'requirements'];
    const missingFields = requiredFields.filter(field => !context[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required context fields: ${missingFields.join(', ')}`);
    }

    return true;
  }

  enhancePrompt(prompt, enhancement) {
    if (typeof enhancement === 'function') {
      return enhancement(prompt);
    }
    return prompt + '\n\n' + enhancement;
  }

  async getContextualPrompt(message, context = {}) {
    // Analyze message to determine best role and task
    const role = this.determineRole(message);
    const task = this.determineTask(message);

    return this.generatePrompt({
      role,
      task,
      context: {
        ...context,
        message
      }
    });
  }

  determineRole(message) {
    // Simple keyword-based role determination
    const keywords = {
      developer: ['code', 'implement', 'develop', 'build'],
      architect: ['design', 'architecture', 'structure', 'system'],
      debugger: ['debug', 'error', 'fix', 'issue'],
      devops: ['deploy', 'pipeline', 'ci/cd', 'infrastructure'],
      security: ['security', 'vulnerability', 'protect', 'auth'],
      database: ['database', 'query', 'data', 'storage'],
      frontend: ['ui', 'interface', 'component', 'style'],
      backend: ['api', 'server', 'endpoint', 'service']
    };

    const messageLower = message.toLowerCase();
    for (const [role, terms] of Object.entries(keywords)) {
      if (terms.some(term => messageLower.includes(term))) {
        return role;
      }
    }

    return this.config.defaultRole;
  }

  determineTask(message) {
    // Simple keyword-based task determination
    const keywords = {
      codeReview: ['review', 'check', 'assess', 'evaluate'],
      debugging: ['debug', 'error', 'fix', 'issue'],
      architecture: ['design', 'structure', 'system', 'architect'],
      security: ['security', 'vulnerability', 'protect', 'auth'],
      performance: ['performance', 'optimize', 'speed', 'slow'],
      testing: ['test', 'coverage', 'unit', 'integration'],
      deployment: ['deploy', 'release', 'publish', 'launch'],
      refactoring: ['refactor', 'improve', 'clean', 'restructure']
    };

    const messageLower = message.toLowerCase();
    for (const [task, terms] of Object.entries(keywords)) {
      if (terms.some(term => messageLower.includes(term))) {
        return task;
      }
    }

    return null;
  }
}

export const defaultPromptManager = new PromptManager();

export {
  basePrompt,
  formatResponse,
  getSystemPrompt,
  rolePrefixes,
  getRolePrompt,
  taskPrompts,
  getTaskPrompt,
  combinePrompts
}; 