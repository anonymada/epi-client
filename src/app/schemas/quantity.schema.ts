export const quantitySchemaLiteral = {
  title: 'quantity schema',
  description: 'describes products quantity like stock, supply and sold',
  version: 0,
  primaryKey: 'idQuantity',
  type: 'object',
  properties: {
    idQuantity: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    idProduct: {
      type: 'string',
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
    quantityRegisteredDate: {
      type: 'string',
      format: 'date-time',
    },
  },
  attachments: {
    encrypted: false,
  },
  required: ['idQuantity'],
  indexes: ['idQuantity'],
} as const; // <- It is important to set 'as const' to preserve the literal type
