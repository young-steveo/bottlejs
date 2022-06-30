export default interface Container {
  [key: string]: any
  $decorator: () => void
  $register: () => void
  $list: () => void
  $name: string | undefined
}
