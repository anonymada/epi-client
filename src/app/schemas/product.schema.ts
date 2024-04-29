export const productSchemaLiteral = {
  title: 'product schema',
  description: 'describes a product',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: 'string',
    },
    category: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
  },
  required: ['id'],
  indexes: ['name'],
} as const; // <- It is important to set 'as const' to preserve the literal type
