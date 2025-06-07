// Map-related type definitions

export interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export interface MapMoveEvent {
  viewState: ViewState
}

export interface MarkerClickEvent {
  originalEvent: MouseEvent
}
