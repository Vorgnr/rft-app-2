<template>
  <div class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container">
      <router-link @click.native="collapsed = true" tag="a" class="nav-brand" to="/">
        <img width="70" height="28" alt="Vue logo" src="@/assets/logo.png" />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        :class="collapsed ? '' : 'collapsed'"
        @click="collapsed = !collapsed"
        data-toggle="collapse"
        aria-controls="mainNavbar"
        data-target="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="collapsed ? '' : 'show'" class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav  mr-auto">
          <router-link
            @click.native="collapsed = true"
            tag="li"
            class="nav-item"
            to="/matches"
          >
            <a class="nav-link">Matchs</a>
          </router-link>
          <router-link
            @click.native="collapsed = true"
            v-if="isAuth"
            tag="li"
            class="nav-item"
            to="/matches/new"
          >
            <a class="nav-link">Nouveau match</a>
          </router-link>
          <router-link
           @click.native="collapsed = true"
           v-if="isAdmin" tag="li"
           class="nav-item"
           to="/admin/leagues"
          >
            <a class="nav-link">Saisons</a>
          </router-link>
        </ul>
        <ul class="navbar-nav">
          <router-link
           @click.native="collapsed = true"  v-if="isAuth" tag="li" class="nav-item" to="/profile">
            <a class="nav-link">
              <v-icon name="user" />
            </a>
          </router-link>
          <router-link
            @click.native="collapsed = true"
            v-if="isAuth"
            tag="li"
            class="nav-item"
            to="/my-chart"
          >
            <a class="nav-link">
              <v-icon name="bar-chart-2" />
            </a>
          </router-link>
          <router-link
            @click.native="collapsed = true"
            v-if="!isAuth"
            tag="li"
            class="nav-item"
            to="/inscription"
          >
            <a class="nav-link">Inscription</a>
          </router-link>
          <router-link
            @click.native="collapsed = true"  v-if="!isAuth" tag="li" class="nav-item" to="/login">
            <a class="nav-link">Login</a>
          </router-link>
          <li v-if="isAuth" @click="$emit('signout')" class="nav-item">
            <a class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TopNav',

  data() {
    return {
      collapsed: true,
    };
  },

  props: {
    isAuth: Boolean,
    isAdmin: Boolean,
  },
};
</script>
