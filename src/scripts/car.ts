class Car {
  public angle = 0
  public brain: NeuralNetwork
  public polygon: Point[] = []
  public speed = 0

  private acceleration = 0.2
  private controls: Controls
  private damaged = false
  private friction = 0.05
  private img: HTMLImageElement
  private mask: HTMLCanvasElement
  private maxReverseSpeed = -this.maxSpeed / 2
  private sensor: Sensor
  private useBrain = this.controlType === 'AI'

  constructor(
    public x: number,
    public y: number,
    private width: number,
    private height: number,
    private controlType: ControlType,
    public maxSpeed = 6,
    public color = 'blue'
  ) {
    this.controls = new Controls(this.controlType)

    const img = Car.loadImage()
    this.img = img

    const maskCanvas = Car.createMaskCanvas({ width, height })
    this.mask = maskCanvas

    this.img.onload = () => Car.createMask(maskCanvas, img, { color, width, height })

    if (this.controlType !== 'dummy') {
      this.sensor = new Sensor(this)
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
    }
  }

  public draw(ctx: CanvasRenderingContext2D, withSensors = false) {
    if (this.sensor && withSensors) this.sensor.draw(ctx)

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)

    if (!this.damaged) {
      ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height)
      ctx.globalCompositeOperation = 'multiply'
    }

    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height)
    ctx.restore()
  }

  private move() {
    if (this.controls.forward) this.speed += this.acceleration
    if (this.controls.reverse) this.speed -= this.acceleration

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
    if (this.speed < this.maxReverseSpeed) this.speed = this.maxReverseSpeed
    if (this.speed > 0) this.speed -= this.friction
    if (this.speed < 0) this.speed += this.friction
    if (Math.abs(this.speed) < this.friction) this.speed = 0

    if (this.speed !== 0) {
      const flip = this.speed < 0 ? -1 : 1
      if (this.controls.left) this.angle += 0.03 * flip
      if (this.controls.right) this.angle -= 0.03
    }

    this.x -= this.speed * Math.sin(this.angle)
    this.y -= this.speed * Math.cos(this.angle)
  }

  public update(roadBorders: Points[], traffic: Car[]) {
    if (!this.damaged) {
      this.move()
      this.polygon = this.createPolygon()
      this.damaged = this.assessDamage(roadBorders, traffic)
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic)

      const offsets = this.sensor.readings.map(reading =>
        reading === null ? 0 : 1 - reading.offset
      )
      const outputs = NeuralNetwork.feedForward(offsets, this.brain)

      if (this.useBrain) {
        this.controls.forward = !!outputs[0]
        this.controls.left = !!outputs[1]
        this.controls.right = !!outputs[2]
        this.controls.reverse = !!outputs[3]
      }
    }
  }

  private assessDamage(roadBorders: Points[], traffic: Car[]) {
    for (const roadBorder of roadBorders) {
      if (polysIntersect(this.polygon, roadBorder)) return true
    }
    for (const car of traffic) {
      if (polysIntersect(this.polygon, car.polygon)) return true
    }
    return false
  }

  private createPolygon() {
    const points: Point[] = []
    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    })

    return points
  }

  private static loadImage() {
    const img = new Image()
    img.src = 'public/images/car.png'
    return img
  }

  private static createMaskCanvas(params: { width: number; height: number }) {
    const { width, height } = params

    const mask = document.createElement('canvas')
    mask.width = width
    mask.height = height

    return mask
  }

  private static createMask(
    maskCanvas: HTMLCanvasElement,
    img: HTMLImageElement,
    params: {
      color: string
      width: number
      height: number
    }
  ) {
    const { color, width, height } = params

    const maskCtx = maskCanvas.getContext('2d')

    if (!maskCtx) return

    maskCtx.fillStyle = color
    maskCtx.rect(0, 0, width, height)
    maskCtx.fill()
    maskCtx.globalCompositeOperation = 'destination-atop'
    maskCtx.drawImage(img, 0, 0, width, height)

    return maskCanvas
  }
}

/* Simple car render   
    public draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(-this.angle)

      ctx.beginPath()
      ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
      ctx.fill()
      ctx.restore()

      this.sensor.draw(ctx)
    }
  */

/* 
/* Draw polygon
  public draw(ctx: CanvasRenderingContext2D, color = 'black', withSensors = false) {
    const firstPoint = this.polygon[0]
    if (!firstPoint) return

    if (this.damaged) ctx.fillStyle = 'grey'
    else ctx.fillStyle = color

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (let i = 1; i < this.polygon.length; i++) {
      const point = this.polygon[i]
      if (point) ctx.lineTo(point.x, point.y)
    }
    ctx.fill()
    if (this.sensor && withSensors) this.sensor.draw(ctx)
  }
*/
