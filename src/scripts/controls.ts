class Controls {
  public forward = false
  public left = false
  public right = false
  public reverse = false

  constructor(public controlType: ControlType) {
    switch (controlType) {
      case 'keys':
        this.addKeyListeners()
        break
      case 'dummy':
        this.forward = true
        break
    }
  }

  private addKeyListeners() {
    document.onkeydown = event => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.forward = true
          break
        case 'a':
        case 'ArrowLeft':
          this.left = true
          break
        case 's':
        case 'ArrowDown':
          this.reverse = true
          break
        case 'd':
        case 'ArrowRight':
          this.right = true
          break
      }
    }
    document.onkeyup = event => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.forward = false
          break
        case 'a':
        case 'ArrowLeft':
          this.left = false
          break
        case 's':
        case 'ArrowDown':
          this.reverse = false
          break
        case 'd':
        case 'ArrowRight':
          this.right = false
          break
      }
    }
  }
}
