import type { NextRouter } from 'next/router'

export const getProjectDetail = (router: NextRouter) => {
  const slug = router?.query?.slug ?? []
  return slug ?? []
}
