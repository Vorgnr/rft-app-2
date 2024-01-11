<template>
  <div>
    <div class="row">
      <div class="col-md-2 offset-md-2">
        <a @click="$router.go(-1)">
          <v-icon name="arrow-left" />Retour
        </a>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-6 offset-md-2">
        <h1>Règles</h1>
        <p>
          Le système de ranking se base sur des paliers de rang
          (comme le système de ranking de Tekken 7).
        </p>

        <ul>
          <li>Les paliers sont définis tous les 1000 points</li>
          <li>Tous les joueurs commencent à 2000 points.</li>
          <li>Tous les matchs se font en FT10</li>
          <li>Changement de personnage autorisé après une défaite</li>
          <li>Changement de stage autorisé entre chaque match</li>
        </ul>
        <p>
          Chaque joueur peut défier une personne ayant au plus 2 rangs
          (inférieurs ou supérieurs) de différence.
          Dans le cas exceptionnel où une personne ne trouve pas de
          personne ayant moins de 2 paliers de différence,
          il pourra affronter quelqu'un avec le palier le plus proche.
        </p>
        <p>
          Lorsque deux joueurs se sont mis d'accord pour effectuer un défi,
          ils ont une semaine pour le faire (une semaine étant comptabilisée du lundi au dimanche
          ; par exemple, si une personne en défie une autre un dimanche,
          ils auront seulement ce dimanche pour faire le défi).
        </p>
        <p>
          Un joueur s'engageant à effectuer un défi et ne pouvant
          l'effectuer avant la fin de la semaine perdra le défi par forfait.
          Bien sur dans le cas où le défi sera annoncé tardivement
          (entre le vendredi et le samedi par ex)
          et/ou si les deux joueurs ont des imprévus/se mettent d'accord,
          on peut repousser la deadline...
          (à condition qu'au moins un des deux joueurs prévienne)
          Le but de la deadline n'est pas d'être relou bien sûr mais c'est bien pour éviter que
          les gens esquivent leurs engagements; dans tous les cas, le but du ranking est que
          les gens jouent le plus possible entre eux, donc si
          c'est faisable mais un peu plus tard, tant mieux.
        </p>
        <p>
          On peut affronter un même joueur pas plus d'une fois toutes les 2 semaines.
          Dans le cas éventuel où un joueur a affronté tous les joueurs éligibles
          (c'est à dire avec une différence de rang maximale égale à 2),
          celui-ci pourra affronter les joueurs avec la différence de rangs
          la plus basse disponible.
          Par exemple, un joueur tout seul dans le palier
          5 a affronté tous les joueurs des paliers 4 et 3,
          pourra donc affronter les joueurs de palier 2 (mais pas de palier inférieur)
          Dans l'autre cas (très très éventuel) où un joueur aura affronté toute la liste,
          il pourra rejouer contre la personne qu'il veut.
          Si une personne a 2 ou plus de défis pendant une semaine,
          elle a le droit de refuser les autres défis
        </p>
        <p>
          Selon les disponibilités des joueurs, il n'est pas possible de
          refuser un défi avant d'en avoir déjà 2 à faire (ou déjà faits) dans une semaine.
          Autrement, si un joueur A refuse un défi lancé par le joueur B sans réelle raison valable,
          le joueur A perd autant de point que s'il avait perdu contre B, ses éventuels gains
          de la semaine seront annulés, et il ne pourra effectuer aucun défi
          comptabilisé jusqu'au début de la semaine prochaine.
        </p>
        <p>
          Un ragequit (quitter le match avant sa fin volontairement)
          entraîne une défaite automatique et une perte en plus de
          <strong>500 points</strong>.
          Exception faite lors de conditions défavorables pour jouer,
          dans ce cas les deux joueurs peuvent se mettre d'accord pour
          reporter le match et/ou accorder un des deux joueurs vainqueur.
        </p>
        <p>
          S'il y a un désaccord entre les deux joueurs concernant
          l'origine des conditions défavorables, merci d'envoyer
          une vidéo avec les input (replay) si possible;
          dans tous les cas, un des modérateurs peut se
          permettre de trancher quand à la décision à prendre.
        </p>
        <p>
          Dans la mesure du possible, les matchs « intéressants »
          seront streamés et/ou enregistrés avec des commentaires.
          L'idéal serait de faire une playlist de tous les défis
          ayant été faits, avec les commentaires.
        </p>
        <p>
          Toutefois, l'optique du ranking est d'abord de faire jouer
          les joueurs entre eux avec un minimum d'enjeux ;
          dans cette optique je considère que le streaming et les VOD sont « secondaires ».
          Toutefois, les vidéos seraient toujours les bienvenues pour ceux et
          celles qui souhaitent voir leurs matchs dans des VODs.
          Je peux me porter volontaire pour commenter des matchs (pas forcément en direct),
          et si d'autres sont volontaires aussi ce serait cool.
        </p>
        <p>
          Pour l'instant j'ai une idée pour essayer de garder du neuf
          dans le ranking et pas que les gens se lassent au bout
          de quelques semaines ; par exemple, une semaine par mois,
          le nombre de points à gagner par match double...
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Rules',
  title: 'Règles',
};
</script>
