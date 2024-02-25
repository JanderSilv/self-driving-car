class Visualizer {
  public static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const { levels } = network

    const margin = 50
    const left = margin
    const top = margin
    const width = ctx.canvas.width - margin * 2
    const height = ctx.canvas.height - margin * 2

    const levelHeight = height / levels.length

    for (let index = levels.length - 1; index >= 0; index--) {
      const level = levels[index]

      if (!level) continue

      const levelTop =
        top + lerp(height - levelHeight, 0, levels.length === 1 ? 0.5 : index / (levels.length - 1))

      ctx.setLineDash([7, 3])
      Visualizer.drawLevel({
        ctx,
        level,
        left,
        top: levelTop,
        width,
        height: levelHeight,
        outputLabels: index === levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : [],
      })
    }
  }

  private static drawLevel(params: {
    ctx: CanvasRenderingContext2D
    level: Level
    left: number
    top: number
    width: number
    height: number
    outputLabels?: string[]
  }) {
    const { ctx, level, left, top, width, height, outputLabels } = params

    const right = left + width
    const bottom = top + height

    const { biases, inputs, outputs, weights } = level
    const nodeRadius = 10

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath()
        ctx.moveTo(
          Visualizer.getNodeX({
            nodes: inputs,
            left,
            right,
            index: i,
          }),
          bottom
        )
        ctx.lineTo(
          Visualizer.getNodeX({
            nodes: outputs,
            left,
            right,
            index: j,
          }),
          top
        )
        ctx.lineWidth = 2

        const value = weights?.[i]?.[j]
        ctx.strokeStyle = getRGBA(value)
        ctx.stroke()
      }
    }

    for (let index = 0; index < inputs.length; index++) {
      const x = Visualizer.getNodeX({
        nodes: inputs,
        left,
        right,
        index,
      })
      ctx.beginPath()
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'black'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = getRGBA(inputs[index])
      ctx.fill()
    }

    for (let index = 0; index < outputs.length; index++) {
      const x = Visualizer.getNodeX({
        nodes: outputs,
        left,
        right,
        index,
      })
      ctx.beginPath()
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'black'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = getRGBA(outputs[index])
      ctx.fill()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = getRGBA(biases[index])
      ctx.setLineDash([3, 3])
      ctx.stroke()
      ctx.setLineDash([])

      const currentOutputLabel = outputLabels?.[index]

      if (currentOutputLabel) {
        ctx.beginPath()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'black'
        ctx.strokeStyle = 'white'
        ctx.font = `${nodeRadius * 1.5}px Arial`
        ctx.fillText(currentOutputLabel, x, top)
        ctx.lineWidth = 0.5
        ctx.strokeText(currentOutputLabel, x, top)
      }
    }
  }

  private static getNodeX(params: { nodes: number[]; left: number; right: number; index: number }) {
    const { nodes, left, right, index } = params
    return lerp(left, right, nodes.length === 1 ? 0.5 : index / (nodes.length - 1))
  }
}
