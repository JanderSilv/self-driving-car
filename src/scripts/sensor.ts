class Sensor {
  public rayCount = 5
  public readings: (Reading | null)[] = []

  private rayLength = 150
  private raySpread = Math.PI / 2
  private rays: Points[] = []

  constructor(private car: Car) {}

  public draw(ctx: CanvasRenderingContext2D) {
    for (let index = 0; index < this.rayCount; index++) {
      const [startRay, endRay] = this.rays[index]!

      let auxEndRay = endRay

      if (this.readings[index]) auxEndRay = this.readings[index]!

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'yellow'
      ctx.moveTo(startRay.x, startRay.y)
      ctx.lineTo(auxEndRay.x, auxEndRay.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'
      ctx.moveTo(endRay.x, endRay.y)
      ctx.lineTo(auxEndRay.x, auxEndRay.y)
      ctx.stroke()
    }
  }

  public update(roadBorders: Points[], traffic: Car[]) {
    this.castRays()
    this.readings = []
    for (let index = 0; index < this.rays.length; index++) {
      const points = this.rays[index]!
      const reading = this.getReading(points, roadBorders, traffic)
      this.readings.push(reading)
    }
  }

  private getReading(ray: Points, roadBorders: Points[], traffic: Car[]) {
    let [startRay, endRay] = ray
    let touches: Reading[] = []

    for (const roadBorder of roadBorders) {
      const [startRoadBorder, endRoadBorder] = roadBorder
      const touch = getIntersection(startRay, endRay, startRoadBorder, endRoadBorder)
      if (touch) touches.push(touch)
    }
    for (const car of traffic) {
      const { polygon } = car

      for (let index = 0; index < polygon.length; index++) {
        const [startRay, endRay] = ray
        const startCarBorder = polygon[index]!
        const endCarBorder = polygon[(index + 1) % polygon.length]!
        const touch = getIntersection(startRay, endRay, startCarBorder, endCarBorder)
        if (touch) touches.push(touch)
      }
    }

    if (touches.length === 0) return null
    else {
      const offsets = touches.map(touch => touch.offset)
      const closestOffset = Math.min(...offsets)
      return touches.find(touch => touch.offset === closestOffset) || null
    }
  }

  private castRays() {
    this.rays = []

    for (let index = 0; index < this.rayCount; index++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : index / (this.rayCount - 1)
        ) + this.car.angle

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([start, end])
    }
  }
}
