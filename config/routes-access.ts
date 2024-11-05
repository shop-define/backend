import { UserRole } from '../libs/types/common-types';

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
};
