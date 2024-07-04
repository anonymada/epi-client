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
    description: {
      type: 'string',
    },
    category: {
      type: 'string',
    },
    conditionningType: {
      type: 'string',
    },
    buyingPrice: {
      type: 'number',
    },
    sellingPrice: {
      type: 'number',
    },
    profitMargin: {
      type: 'number',
    },
    stockQuantity: {
      type: 'number',
    },
    supplyQuantity: {
      type: 'number',
    },
    soldQuantity: {
      type: 'number',
    },
  },
  attachments: {
    encrypted: false,
  },
  required: ['id', 'name'],
  indexes: ['id'],
} as const; // <- It is important to set 'as const' to preserve the literal type
