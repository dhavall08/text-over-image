export const appName = 'your_app_name';
export const baseTitle = 'Text over Image';

export const PER_PAGE = 12;

export function getTitle(pageName) {
  return `${pageName} | ${baseTitle}`;
}
