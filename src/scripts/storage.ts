const storageKeys = {
  bestCarBrain: '@self-driving:best-brain',
} as const

const bestCarBrainStorage = {
  get: () => {
    const bestCarBrain = localStorage.getItem(storageKeys.bestCarBrain)
    return bestCarBrain ? (JSON.parse(bestCarBrain) as NeuralNetwork) : null
  },
  has: () => !!localStorage.getItem(storageKeys.bestCarBrain),
  set: (network: NeuralNetwork) =>
    localStorage.setItem(storageKeys.bestCarBrain, JSON.stringify(network)),
  remove: () => localStorage.removeItem(storageKeys.bestCarBrain),
}
