export const priceSchemaLiteral = {
  title: 'price schema',
  description: 'describes price evolution',
  version: 0,
  primaryKey: 'idPrice',
  type: 'object',
  properties: {
    idPrice: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    idProduct: {
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
    priceRegisteredDate: {
      type: 'string',
      format: 'date-time',
    },
  },
  attachments: {
    encrypted: false,
  },
  required: ['idPrice'],
  indexes: ['idPrice'],
} as const; // <- It is important to set 'as const' to preserve the literal type
