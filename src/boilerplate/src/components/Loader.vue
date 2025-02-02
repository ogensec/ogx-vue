<template>
  <div id="logo" class="loading">
    <div class="scene" style="transform: rotateX(-35deg) rotateY(135deg)">
      <div class="shape cub-1">
        <div class="face ft"></div>
        <div class="face bk" style="background: #71aaceaa"></div>
        <div class="face rt" style="background: #00497147"></div>
        <div class="face lt"></div>
        <div class="face bm" style="background: #2094d4"></div>
        <div class="face tp" style="background: #004971"></div>
      </div>
      <div class="shape cub-2">
        <div class="face ft" style="background: #1e8ec4"></div>
        <div class="face bk" style="background: #31afe61c"></div>
        <div class="face rt" style="background: #2fabe3"></div>
        <div class="face lt" style="background: #71cbf3"></div>
        <div class="face bm" style="background: #16b5ed"></div>
        <div class="face tp"></div>
      </div>
      <div class="shape cub-3">
        <div class="face ft" style="background: #16b5ed"></div>
        <div class="face bk"></div>
        <div class="face rt" style="background: #b3e0f97d"></div>
        <div class="face lt" style="background: #31afe6"></div>
        <div class="face bm"></div>
        <div class="face tp"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#logo {
  overflow: hidden;
  width: 100%;
  height: 200px;
  background: transparent;
  font-size: 35px;
}

.scene,
.shape,
.face {
  position: absolute;
  transform-style: preserve-3d;
}

.scene {
  width: 80em;
  height: 80em;
  top: 50%;
  left: 50%;
  margin: -40em 0 0 -40em;
}

.shape {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-origin: 50%;
  transition: 2s all;
}

.face {
  overflow: hidden;
  transform-origin: 0 0;
  transition: all 2s;
}

.face:hover {
  filter: brightness(150%);
  transition: all 0.2s;
}

.face {
  background-size: 100% 100% !important;
  background-position: center;
}

.face-wrapper .face {
  left: 100%;
  width: 100%;
  height: 100%;
}

.shape .bk {
  left: 100%;
}

.shape .rt {
  transform: rotateY(-90deg) translateX(-50%);
}

.shape .lt {
  transform: rotateY(90deg) translateX(-50%);
}

.shape .tp {
  transform: rotateX(90deg) translateY(-50%);
}

.shape .bm {
  transform: rotateX(-90deg) translateY(-50%);
}

.shape .lt {
  left: 100%;
}

.shape .bm {
  top: 100%;
}

.cub-3 {
  transform: translate3D(0em, 0em, 2.005em) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}

.cub-2 {
  transform: translate3D(2.005em, 0em, 0em) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}

.cub-1 {
  transform: translate3D(0em, 0em, 0em) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}

.cub-1 .ft {
  transform: translateZ(1em);
}

.cub-1 .bk {
  transform: translateZ(-1em) rotateY(180deg);
}

.cub-1 .face,
.cub-2 .face,
.cub-3 .face {
  width: 2em;
  height: 2em;
}

.cub-1 .face {
  background: #0c517caa;
}

.cub-2 .ft {
  transform: translateZ(1em);
}

.cub-2 .bk {
  transform: translateZ(-1em) rotateY(180deg);
}

.cub-2 .face {
  background: #b1def7aa;
}

.shape {
  opacity: 1;
  width: 2em;
  height: 2em;
  margin: -1em 0 0 -1em;
}

.cub-3 .ft {
  transform: translateZ(1em);
}

.cub-3 .bk {
  transform: translateZ(-1em) rotateY(180deg);
}

.cub-3 .face {
  background: #31afe6aa;
}

.loading .cub-2 {
  animation: left-cube 3s infinite;
}

.loading .cub-3 {
  animation: right-cube 2s infinite;
}

@keyframes left-cube {
  0% {
    transform: translate3D(2.005em, 0em, 0em) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  25% {
    transform: translate3D(2.005em, 0em, 0em) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
  }
  50% {
    transform: translate3D(2.005em, 0em, 0em) rotateX(-180deg) rotateY(0deg) rotateZ(0deg);
  }
  75% {
    transform: translate3D(2.005em, 0em, 0em) rotateX(-270deg) rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: translate3D(2.005em, 0em, 0em) rotateX(-360deg) rotateY(0deg) rotateZ(0deg);
  }
}

@keyframes right-cube {
  0% {
    transform: translate3D(0em, 0em, 2.005em) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: translate3D(0em, 0em, 2.005em) rotateX(0deg) rotateY(0deg) rotateZ(360deg);
  }
}
</style>
