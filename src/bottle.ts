import Container from './container.js'

const bottles: Record<string, Bottle> = {}
let id = 0

export default class Bottle {
  private id: number
  public container: Container

  public constructor(name?: string) {
    this.id = id++
    this.container = {
      $decorator: () => {},
      $register: () => {},
      $list: () => {},
      $name: name
    }
    if (typeof name === 'string') {
      return Bottle.pop(name)
    }
  }

  public static pop(name?: string): Bottle {
    if (typeof name !== 'string') {
      return new Bottle()
    }
    let instance = bottles[name]
    if (!instance) {
      bottles[name] = instance = new Bottle()
      instance.container.$name = name
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
