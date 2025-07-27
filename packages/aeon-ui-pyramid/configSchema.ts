export const pyramidConfigSchema = {
  type: 'object',
  properties: {
    layers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          weight: { type: 'number' }
        },
        required: ['id', 'name']
      }
    }
  },
  required: ['layers']
} as const;

export default pyramidConfigSchema;
