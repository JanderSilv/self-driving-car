type Point = { x: number; y: number }
type Points = [Point, Point]

type Reading = Point & {
  offset: number
}

type ControlType = 'AI' | 'dummy' | 'keys'

type CarMask = {
  width: number
  height: number
}
