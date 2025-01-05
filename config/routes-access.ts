import { UserRole } from '../libs/types/common-types';
import { GetCheckoutSchema } from '../modules/checkout/schemas/checkout-schema';

export const routesAccess = {
  goodCategories: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  good: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  brand: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  images: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  deliveryMethods: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  paymentMethods: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  transaction: {
    get: {
      accessGroups: ['admin'] as UserRole[],
    },
    update: {
      accessGroups: ['admin'] as UserRole[],
    },
  },
  checkout: {
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  news: {
    privateGet: { accessGroups: ['seller', 'admin'] as UserRole[] },
    create: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
    delete: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
  settings: {
    update: {
      accessGroups: ['seller', 'admin'] as UserRole[],
    },
  },
};
