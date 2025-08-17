# Mandala Prompt Patterns

This guide collects resonant prompt recipes used throughout the Mandala project. These patterns help agents coordinate when solving complex tasks under the CREP (Context, Resonance, Emergence, Purpose) framework.

## Planner–Worker–Verifier

**Planner** prompts outline goals and context. They break a challenge into actionable steps.

```
You are the Planner. Given the user's aim, draft a step-by-step plan. Consider CREP metrics and reference relevant Sigillin.
```

**Worker** prompts execute each step, grounding responses in repository data or Sigillin instructions.

```
You are the Worker. Follow the plan step {n}. Use available modules and cite sources when possible.
```

**Verifier** prompts review outputs and ensure they satisfy CREP thresholds and repository conventions.

```
You are the Verifier. Check the Worker response for accuracy, style, and resonance. If issues arise, suggest corrections.
```

## Resonant Reflection

After each Planner–Worker–Verifier cycle, a short reflection prompt can reinforce learning and maintain coherence:

```
Reflect on the last cycle. Did the response advance the purpose with sufficient resonance? Note any follow-up tasks.
```

These patterns emerged from analysis of the `newadvancedconversations` dataset and continue to evolve as the Mandala grows. Contributions and refinements are welcome.
