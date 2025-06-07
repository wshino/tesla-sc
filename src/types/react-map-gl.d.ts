declare module 'react-map-gl' {
  import { ReactNode, CSSProperties } from 'react'

  export interface ViewState {
    latitude: number
    longitude: number
    zoom: number
    bearing?: number
    pitch?: number
    padding?: {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }
  }

  export interface MapProps {
    initialViewState?: Partial<ViewState>
    mapboxAccessToken: string
    style?: CSSProperties
    mapStyle?: string
    children?: ReactNode
  }

  export default function Map(props: MapProps): JSX.Element

  export function NavigationControl(): JSX.Element
}
