
export type Player = {
  id: string,
  name: string,
  email: string
  mainCharacter: string,
  isAdmin: boolean
  isFrozen: boolean
}

export type BackendPlayer = {
  id: string,
  name: string,
  email: string
  main_character: string,
  is_admin: boolean
  is_frozen: boolean
}

export function toPlayer(b: BackendPlayer): Player {
  return {
    ...b,
    mainCharacter: b.main_character,
    isAdmin: b.is_admin,
    isFrozen: b.is_frozen,
  }
}