import { createContext } from 'react'

export type ContextTypes = {
  labelWidth?: number | string
  textAlign?: 'left' | 'right'
}

const DescriptionsContext = createContext<ContextTypes>({})

export default DescriptionsContext
