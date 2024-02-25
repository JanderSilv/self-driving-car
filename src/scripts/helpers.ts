const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount

const getIntersection = (p1: Point, p2: Point, p3: Point, p4: Point) => {
  const tTop = (p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)
  const uTop = (p3.y - p1.y) * (p1.x - p2.x) - (p3.x - p1.x) * (p1.y - p2.y)
  const bottom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y)

  if (bottom === 0) return null

  const t = tTop / bottom
  const u = uTop / bottom

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
    return {
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t),
      offset: t,
    }

  return null
}

const polysIntersect = (poly1: Point[], poly2: Point[]) => {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const [poly1Point, poly1NextPoint, poly2Point, poly2NextPoint] = [
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length],
      ]

      if (!poly1Point || !poly1NextPoint || !poly2Point || !poly2NextPoint) continue
      const touch = getIntersection(poly1Point, poly1NextPoint, poly2Point, poly2NextPoint)
      if (touch) return true
    }
  }

  return false
}

const getRGBA = (value?: number) => {
  if (!value) return 'rgba(0, 0, 0, 0)'

  const alpha = Math.abs(value)
  const R = value < 0 ? 0 : 255
  const G = R
  const B = value > 0 ? 0 : 255

  return `rgba(${R}, ${G}, ${B}, ${alpha})`
}

const getRandomColor = () => {
  const hue = 290 + Math.random() * 260
  return `hsl(${hue}, 100%, 60%)`
}
