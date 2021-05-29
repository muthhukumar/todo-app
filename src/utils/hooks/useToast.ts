import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react'

const standaloneToast = createStandaloneToast()

const useToast = (options?: UseToastOptions | undefined) => {
  return standaloneToast({
    ...options,
    position: 'top-right',
    duration: 3000,
  })
}

export { useToast }
