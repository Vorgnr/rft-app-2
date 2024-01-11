
export type League = {
  id: string,
  name: string,
  isActive: boolean,
  startingElo: string,
  winningBaseElo: string,
  losingBaseElo: string,
  ragequitPenalty: string,
  rankTreshold: string,
  rankDiffRatio: string,
}

export type BackendLeague = {
  id: string,
  name: string,
  is_active: boolean,
  starting_elo: string,
  winning_base_elo: string,
  losing_base_elo: string,
  ragequit_penalty: string,
  rank_treshold: string,
  rank_diff_ratio: string,
}

export function toLeague(l: BackendLeague): League {
  return {
    ...l,
    isActive: l.is_active,
    startingElo: l.starting_elo,
    winningBaseElo: l.winning_base_elo,
    losingBaseElo: l.losing_base_elo,
    ragequitPenalty: l.ragequit_penalty,
    rankTreshold: l.rank_treshold,
    rankDiffRatio: l.rank_diff_ratio,
  }
}