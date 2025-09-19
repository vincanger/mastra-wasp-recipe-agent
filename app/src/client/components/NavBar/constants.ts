import { routes } from 'wasp/client/router';
import { BlogUrl, DocsUrl } from '../../../shared/common';
import type { NavigationItem } from './NavBar';

const staticNavigationItems: NavigationItem[] = [
  { name: 'Documentation', to: DocsUrl },
  { name: 'Blog', to: BlogUrl },
];

export const marketingNavigationItems: NavigationItem[] = [
  { name: 'Features', to: '/#features' },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
  ...staticNavigationItems,
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: 'Recipe Agent', to: routes.RecipeChatRoute.to },
  { name: 'File Upload', to: routes.FileUploadRoute.to },
  ...staticNavigationItems,
] as const;
