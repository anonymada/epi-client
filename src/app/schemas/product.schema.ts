export const productSchemaLiteral = {
  title: 'product schema',
  description: 'describes a product',
  version: 0,
  primaryKey: 'idProduct',
  type: 'object',
  properties: {
    idProduct: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    category: {
      type: 'string',
    },
    conditionningType: {
      type: 'string',
    },
  },
  attachments: {
    encrypted: false,
  },
  required: ['idProduct', 'name'],
  indexes: ['idProduct'],
} as const; // <- It is important to set 'as const' to preserve the literal type
