# Aeon UI Pyramid Blueprint

This blueprint expands the Pyramid UI planning with additional operational notes.

## Error Management

- Provide fallbacks when rendering fails.
- Log audio errors via the Sonification module.

## Performance

- Measure FPS and load times via OpenTelemetry.

## Accessibility

- Use high-contrast colors and ARIA labels for interactive nodes.

## Config Schema

- Document `pyramid.config.yaml` defaults and options.

## Testing

- Add Vitest suites for hooks and Cypress end-to-end tests.

## Deployment

- Offer a Docker Compose setup for quick start.
