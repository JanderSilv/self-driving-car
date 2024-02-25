class NeuralNetwork {
  public levels: Level[] = []

  constructor(private neuronCounts: number[]) {
    for (let index = 0; index < neuronCounts.length - 1; index++) {
      this.levels.push(new Level(this.neuronCounts[index]!, this.neuronCounts[index + 1]!))
    }
  }

  public static feedForward(givenInputs: number[], network: NeuralNetwork) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]!)

    for (let index = 1; index < network.levels.length; index++) {
      outputs = Level.feedForward(outputs, network.levels[index]!)
    }

    return outputs
  }

  public static mutate(network: NeuralNetwork, mutationRate: number) {
    network.levels.forEach(level => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i]!, Math.random() * 2 - 1, mutationRate)
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i]!.length; j++) {
          level.weights[i]![j] = lerp(level.weights[i]![j]!, Math.random() * 2 - 1, mutationRate)
        }
      }
    })
  }
}

class Level {
  public biases: number[] = new Array(this.outputCount)
  public inputs: number[] = new Array(this.inputCount)
  public outputs: number[] = new Array(this.outputCount)
  public weights: number[][] = []

  constructor(private inputCount: number, private outputCount: number) {
    for (let index = 0; index < inputCount; index++) {
      this.weights[index] = new Array(outputCount)
    }

    Level.randomize(this)
  }

  private static randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i]![j] = Math.random() * 2 - 1
      }
    }

    for (let index = 0; index < level.biases.length; index++) {
      level.biases[index] = Math.random() * 2 - 1
    }
  }

  public static feedForward(givenInputs: number[], level: Level) {
    for (let index = 0; index < level.inputs.length; index++) {
      level.inputs[index] = givenInputs[index]!
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j]! * level.weights[j]![i]!
      }

      if (sum > level.biases[i]!) level.outputs[i] = 1
      else level.outputs[i] = 0
    }

    return level.outputs
  }
}
