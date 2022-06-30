const bottles: Record<string, Bottle> = {}

export class Bottle {
  public static pop(name?: string): Bottle {
    if (typeof name !== 'string') {
      return new Bottle()
    }
    let instance = bottles[name]
    if (!instance) {
      bottles[name] = instance = new Bottle()
    }
    return instance
  }

  public static clear(name?: string): void {
    if (typeof name === 'string') {
      delete bottles[name]
      return
    }
    for (const prop in bottles) {
      if (bottles.hasOwnProperty(prop)) {
        delete bottles[prop]
      }
    }
  }
}
