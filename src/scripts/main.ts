const carCanvas = document.getElementById('car-canvas') as HTMLCanvasElement
const networkCanvas = document.getElementById('network-canvas') as HTMLCanvasElement

carCanvas.width = 200
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const cars = generateCars(100)
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'dummy', 5, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'dummy', 5, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'dummy', 5, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'dummy', 5, getRandomColor()),

  new Car(road.getLaneCenter(1), -500, 30, 50, 'dummy', 5, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'dummy', 5, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'dummy', 5, getRandomColor()),
]

let bestCar = cars[0]

if (bestCarBrainStorage.has()) {
  for (let index = 0; index < cars.length; index++) {
    cars[index]!.brain = bestCarBrainStorage.get()!

    if (index !== 0) NeuralNetwork.mutate(cars[index]!.brain, 0.1)
  }
}

animate()

function saveBestCar() {
  if (bestCar) bestCarBrainStorage.set(bestCar.brain)
}

function discardBestCar() {
  bestCarBrainStorage.remove()
}

function generateCars(count: number) {
  const cars: Car[] = []

  for (let index = 1; index <= count; index++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
  }

  return cars
}

function animate(time = 0) {
  for (const car of cars) car.update(road.borders, traffic)
  for (const car of traffic) car.update(road.borders, [])

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight
  bestCar = cars.find(car => car.y === Math.min(...cars.map(car => car.y)))

  if (!carCtx || !networkCtx || !bestCar) return

  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)
  road.draw(carCtx)
  carCtx.globalAlpha = 0.2
  for (const car of cars) car.draw(carCtx)
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, true)
  for (const car of traffic) car.draw(carCtx)
  carCtx.restore()

  carCtx.fillText(`Speed: ${bestCar.speed.toFixed(2)} / ${bestCar.maxSpeed}`, 10, 20)
  carCtx.fillText(`Angle: ${bestCar.angle.toFixed(2)}`, 10, 35)

  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  requestAnimationFrame(animate)
}
