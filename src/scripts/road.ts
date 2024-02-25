class Road {
  public borders: [Point, Point][]

  private left: number
  private right: number
  private top: number
  private bottom: number

  constructor(private x: number, private width: number, private laneCount = 3) {
    const infinity = 1_000_000

    this.top = -infinity
    this.bottom = infinity
    this.left = this.x - width / 2
    this.right = x + width / 2

    const topLeft = { x: this.left, y: this.top }
    const topRight = { x: this.right, y: this.top }
    const bottomLeft = { x: this.left, y: this.bottom }
    const bottomRight = { x: this.right, y: this.bottom }

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ]
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5
    ctx.strokeStyle = 'white'

    for (let index = 1; index <= this.laneCount - 1; index++) {
      const x = lerp(this.left, this.right, index / this.laneCount)

      ctx.setLineDash([20, 20])

      ctx.beginPath()
      ctx.moveTo(x, this.top)
      ctx.lineTo(x, this.bottom)
      ctx.stroke()
    }

    ctx.setLineDash([])

    this.borders.forEach(([start, end]) => {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    })
  }

  public getLaneCenter(lane: number) {
    const laneWidth = this.width / this.laneCount
    return this.left + laneWidth / 2 + Math.min(lane, this.laneCount - 1) * laneWidth
  }
}
