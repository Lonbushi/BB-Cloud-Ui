import defaultSettings from '@/settings'

const title = defaultSettings.title || '蹦蹦云'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
