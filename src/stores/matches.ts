import api from '@/lib/api';
import type { Match } from '@/types/match';
import { defineStore } from 'pinia';

type MatchState = {
  match?: Match,
  list: Match[],
  noMoreItems: boolean
}

export const useLeagueStore = defineStore('Match', {
  state(): MatchState {
    return {
      match: undefined,
      list: [],
      noMoreItems: false,
    }
  },

  actions: {
    setList(list: Match[]) {
      this.list = list;
      this.noMoreItems = !list.length;
    },

    appendToList(list: Match[]) {
      if (list.length) {
        this.list = [...this.list, ...list];
      } else {
        this.noMoreItems = true;
      }
    },

    setMatch(match?: Match) {
      this.match = match;
    },

    updateMatch(match: Match) {
      this.match = { ...this.match, ...match };
    },
  
  callList(obj) {
    const payload = {
      method: 'GET',
      params: obj.params,
    };
  
    return api
      .from('matches')
      .request(payload);
  },
  
    save(match: Match) {
      const payload = {
        method: 'POST',
        data: match,
      };
      return api
        .from('matches')
        .request(payload);
    },
  
    async moderate(match: Pick<Match, 'id'>) {
      const response = await api
        .from('matches')
        .put(`/${match.id}/moderate`);
  
      this.updateMatch(response.data);
    },
  
    async unmoderate(match: Pick<Match, 'id'>) {
      const response = await api
        .from('matches')
        .put(`/${match.id}/unmoderate`);
  
      this.updateMatch(response.data);
    },
  
    clearMatch() {
      this.setMatch();
    },
  
    async penalize(body: Match) {
      const response = await api
        .from('matches')
        .post(`/${body.id}/penalize`, {
          player1_elo_penalty: body.player1_elo_penalty,
          player2_elo_penalty: body.player2_elo_penalty,
        });
  
      this.updateMatch(response.data);
    },
  
    async cancel(match: Pick<Match, 'id'>) {
      const response = await api
        .from('matches')
        .put(`/${match.id}/cancel`);
  
      this.updateMatch(response.data);
    },
  
    async update(matchId: string, body: Partial<Match>) {
      const response = await api
        .from('matches')
        .put(`/${matchId}`, body);
  
      this.updateMatch(response.data);
    },
  
    async getById(match: Pick<Match, 'id'>) {
      const response = await this.callList({ params: { matchId: match.id, perPage: 1 } });
      this.setMatch(response.data[0]);
    },
  
    async fetchMore(obj = {}) {
      const response = await this.callList(obj);
      this.appendToList(response.data);
    },
  
    async fetchList(obj = {}) {
      const response = await this.callList(obj);
      this.setList(response.data);
    },
  },
});
