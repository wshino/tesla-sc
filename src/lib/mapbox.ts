export const getMapboxToken = (): string => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!token) {
    throw new Error(
      'Mapbox token is not defined. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.'
    )
  }

  return token
}
