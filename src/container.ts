export default interface Container {
  [key: string]: any
  $decorator: () => void
  $register: () => void
  $list: () => void
  $name: string | undefined
}

export const newContainer = (name?: string) => {
  return {
    $decorator: () => {},
    $register: () => {},
    $list: () => {},
    $name: name
  }
}
