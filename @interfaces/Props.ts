import { Config } from './Config'

export interface Props {
  config: Config
  success: Function
  failure: Function
  db: Function
}
