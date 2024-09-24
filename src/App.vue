<template>
  <div class="row">
    <h3>Welcome to the Emoji Contact photo maker</h3>
  </div>
  <br />

  <div class="main">
    <div>
      <Picker :data="emojiIndex" emoji="point_up_2" title="Pick your emoji…" set="twitter" @select="emojiPicked" />
    </div>

    <div style="display: flexbox">
      <label for="Colour1">Colour 1 for gradient: </label>
      <q-badge outline :style="{
        background: colour1 + '!important',
        color: invertHex(colour1) + '!important',
        'font-family': 'monospace',
        'font-this.canvasSize': '20px',
      }" class="q-mb-sm" q>
        {{ colour1 }}
      </q-badge>

      <q-icon name="colorize" class="cursor-pointer" size="20px">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color :default-value="colour1" @update:model-value="changeColour1" />
        </q-popup-proxy>
      </q-icon>
      <br />

      <label for="Colour2">Colour 2 for gradient: </label>
      <q-badge outline :style="{
        background: colour2 + '!important',
        color: invertHex(colour2) + '!important',
        'font-family': 'monospace',
        'font-this.canvasSize': '20px',
      }" class="q-mb-sm" q>
        {{ colour2 }}
      </q-badge>
      <q-icon name="colorize" class="cursor-pointer" size="20px">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color :default-value="colour2" @update:model-value="changeColour2" />
        </q-popup-proxy>
      </q-icon>
      <br />

      <span class="text-h6" style="margin: 0">Size:</span>
      <q-slider v-model="canvasSize" color="blue-grey-7" markers :marker-labels="imgSizeMarkerLabel" :min="100"
        :max="400" :step="50" @change="changeSize()" />

      <span class="text-h6" style="margin: 0">Emoji Size:</span>
      <q-slider v-model="emojiScale" color="blue-grey-7" markers marker-labels :min="0.5" :max="2" :step="0.5"
        @change="changeSize()" />

      <br />
      <br />

      <q-btn-toggle v-model="emojiCurrentlySelected" toggle-color="blue-grey-6" :options="[
        { label: 'Primary', value: '1' },
        { label: 'Secondary', value: '2' },
      ]" />

      <q-btn class="reload-button" padding="xs" color="deep-orange-9" icon="replay" @click="reset()" />
      <br />
      <br />
      <q-btn-toggle v-model="smolEmojiPlace" toggle-color="grey-6" :options="[
        { value: 'ne', slot: 'one' },
        { value: 'nw', slot: 'two' },
        { value: 'se', slot: 'three' },
        { value: 'sw', slot: 'four' },
      ]" class="btngroup" @click="updatePlace()">
        <template v-slot:one>
          <div>
            <q-icon name="north_east" />
          </div>
        </template>

        <template v-slot:two>
          <div>
            <q-icon name="north_west" />
          </div>
        </template>

        <template v-slot:three>
          <div>
            <q-icon name="south_east" />
          </div>
        </template>

        <template v-slot:four>
          <div>
            <q-icon name="south_west" />
          </div>
        </template>
      </q-btn-toggle>

      <br />
      <br />

      <div style="justify-content: center">
        <canvas id="myCanvas" width="300" height="300" name="Canvas with no emoji" style="border: 1px solid #d3d3d3">
          Your browser does not support the HTML canvas tag.</canvas>
        <canvas id="myCanvas2" width="300" height="300" name="Canvas with no emoji"
          style="border: 1px solid #d3d3d3; display: none">
          Your browser does not support the HTML canvas tag.</canvas>
      </div>

      <br />
      <q-btn :loading="downloadProgress" @click="downloadCanvas()" color="white" text-color="black" label="Download">
        <template v-slot:loading>
          <q-spinner-gears />
        </template>
      </q-btn>
    </div>
  </div>

  <footer>
    <div class="footer">
      Uses
      <a href="https://twemoji.twitter.com/" target="_blank">Twitter Emoji</a> |
      <a href="https://github.com/Hysterelius/EmojiCP-Vite" target="_blank">GitHub</a>
    </div>
  </footer>
</template>

<script setup>
// Import data/twitter.json to reduce this.canvasSize, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/twitter.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

// Vue 3, import components from `/src`:
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

import { ref, onMounted } from "vue";

// Create emoji data index.
// We can change it (for example, filter by category) before passing to the component.
let emojiIndex = new EmojiIndex(data);

let currentEmoji = [null, null];
let currentEmoji2 = [null, null];

let smolCurrentEmoji = [null, null];
let smolCurrentEmoji2 = [null, null];

const emojiPlace = {
  se: [0.65, 0.65],
  nw: [-0.15, -0.15],
  sw: [-0.15, 0.65],
  ne: [0.65, -0.15],
};

const downloadProgress = ref(false);
const canvasSize = ref("100");
const emojiScale = ref("1");
const emojiCurrentlySelected = ref("1");
const smolEmojiPlace = ref("se");
const imgSizeMarkerLabel = {
  100: "300px",
  150: "450px",
  200: "600px",
  250: "750px",
  300: "900px",
  350: "1050px",
  400: "1200px",
};

const emojiIndexRef = ref(emojiIndex);
const emojisOutput = ref("");
const colour1 = ref("#858e96");
const colour2 = ref("#60696b");
const baseStr = ref("https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/");


onMounted(() => {
  if (localStorage.getItem('colour1')) {
    colour1.value = localStorage.getItem('colour1');
  }
  if (localStorage.getItem('colour2')) {
    colour2.value = localStorage.getItem('colour2');
  }
  if (localStorage.getItem('canvasSize')) {
    canvasSize.value = localStorage.getItem('canvasSize');
  }
  if (localStorage.getItem('emojiScale')) {
    emojiScale.value = localStorage.getItem('emojiScale');
  }
  prepareCanvas(true, document.getElementById("myCanvas"));
  prepareCanvas(true, document.getElementById("myCanvas2"));
});

function updateCanvasEmoji(emoji) {
  let emojiStr = parseEmoji(emoji);
}

function invertHex(hex) {
  let newHex = "#fced1e";
  let LorD = lightOrDark(hex);
  if (LorD == "dark") {
    newHex = "#ffffff";
  } else {
    newHex = "#000000";
  }
  return newHex;
}

function lightOrDark(color) {
  // https://awik.io/determine-color--dark-using-javascript/

  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +(
      "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
    );

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
}

function parseEmoji(emoji) {
  var unicodeEmoji = emoji.unified;
  if (!unicodeEmoji.includes("200d")) {
    unicodeEmoji = unicodeEmoji.replaceAll("-fe0f", "");
  }
  if (unicodeEmoji.includes("20e3")) {
    unicodeEmoji = unicodeEmoji.replaceAll("00", "");
  }
  return baseStr.value + unicodeEmoji + ".svg";
}

async function emojiPicked(emoji) {
  if (emoji.id != currentEmoji[1] && emojiCurrentlySelected.value == 1) {
    let svgAddress = await parseEmoji(emoji);
    getText(svgAddress).then((text) => {
      currentEmoji[0] = text;
      currentEmoji[1] = emoji.id;
      prepareCanvas(true, document.getElementById("myCanvas"), text);

      currentEmoji2[0] = text;
      currentEmoji2[1] = emoji.id;
      prepareCanvas(true, document.getElementById("myCanvas2"), text);
    });
  } else if (
    emoji.id != smolCurrentEmoji[1] &&
    emojiCurrentlySelected.value == 2
  ) {
    let svgAddress = await parseEmoji(emoji);
    getText(svgAddress).then((text) => {
      smolCurrentEmoji[0] = text;
      smolCurrentEmoji[1] = emoji.id;
      prepareCanvas(true, document.getElementById("myCanvas"));

      smolCurrentEmoji2[0] = text;
      smolCurrentEmoji2[1] = emoji.id;
      prepareCanvas(true, document.getElementById("myCanvas2"));
    });
  }
}

function downloadCanvas() {
  downloadProgress.value = true;
  let canvas = document.getElementById("myCanvas2");
  // get canvas data
  let image = canvas.toDataURL();

  // create temporary link
  let tmpLink = document.createElement("a");
  if (currentEmoji[1]) {
    tmpLink.download = `ContactPhoto-(${currentEmoji[1].replaceAll(
      " ",
      "-"
    )})-${canvasSize.value * 3}px.png`; // set the name of the download file
  } else {
    tmpLink.download = "image.png"; // set the name of the download file
  }
  tmpLink.href = image;

  // temporarily add link to body and initiate the download
  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
  downloadProgress.value = false;
}

async function getText(file) {
  let x = await fetch(file);
  let y = await x.text();

  return y;
}

function editSVG(svg, canvas, scaleFactor = 1) {
  let pos = svg.indexOf("svg") + 4;

  let scale = Math.floor(
    (canvas.width / 3) * emojiScale.value * scaleFactor
  );

  let newSVG =
    svg.slice(0, pos) +
    `width=\"${scale}\" height=\"${scale}\" ` +
    svg.slice(pos);
  return newSVG;
}

function drawInlineSVG(ctx, rawSVG, callback, offsetx, offsety = offsetx) {
  let svg = new Blob([rawSVG], { type: "image/svg+xml;charset=utf-8" }),
    domURL = self.URL || self.webkitURL || self,
    url = domURL.createObjectURL(svg),
    img = new Image();

  img.onload = () => {
    ctx.drawImage(img, Math.floor(offsetx), Math.floor(offsety));
    domURL.revokeObjectURL(url);
    callback();
  };

  img.src = url;
}

function prepareCanvas(doUpdate, canvas, emojiText = currentEmoji[0]) {
  let s = canvas.width;
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let xpos = Math.floor(s / 2);

  let grd = ctx.createLinearGradient(xpos, 0, xpos, s);
  grd.addColorStop(0, colour1.value);
  grd.addColorStop(1, colour2.value);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (doUpdate) {
    ctx = canvas.getContext("2d");

    if (currentEmoji[0]) {
      drawInlineSVG(
        ctx,
        editSVG(currentEmoji[0], canvas),
        function () { },
        (canvas.width - (canvas.width / 3) * emojiScale.value) / 2
      );
    }

    if (smolCurrentEmoji[0]) {
      drawInlineSVG(
        ctx,
        editSVG(smolCurrentEmoji[0], canvas, 0.5),
        function () { },
        smolCalcPos(0, canvas),
        smolCalcPos(1, canvas)
      );
    }
  }
}

function doBoth() {
  prepareCanvas(
    true,
    document.getElementById("myCanvas"),
    currentEmoji[0]
  );
  prepareCanvas(
    true,
    document.getElementById("myCanvas2"),
    currentEmoji2[0]
  );
}

function changeColour1(value) {
  colour1.value = value;
  localStorage.setItem('colour1', value);
  doBoth();
}

function changeColour2(value) {
  colour2.value = value;
  localStorage.setItem('colour2', value);
  doBoth();
}

function changeSize() {
  let c = document.getElementById("myCanvas2");
  if (localStorage.getItem('canvasSize') != canvasSize.value) {
    localStorage.setItem('canvasSize', canvasSize.value);
  }
  if (localStorage.getItem('emojiScale') != emojiScale.value) {
    localStorage.setItem('emojiScale', emojiScale.value);
  }
  c.setAttribute("width", canvasSize.value * 3);
  c.setAttribute("height", canvasSize.value * 3);

  doBoth();
}

function reset() {
  if (emojiCurrentlySelected.value == 1) {
    currentEmoji = [null, null];
    currentEmoji2 = [null, null];
    doBoth();
  } else if (emojiCurrentlySelected.value == 2) {
    smolCurrentEmoji = [null, null];
    smolCurrentEmoji2 = [null, null];
    doBoth();
  }
}

function updatePlace() {
  doBoth();
}

function smolCalcPos(xory = 0, canvas) {
  return (
    (canvas.width - (canvas.width / 3) * emojiScale.value) / 2 +
    emojiPlace[smolEmojiPlace.value][xory] *
    (canvas.width / 3) *
    emojiScale.value
  );
}
</script>

<style>
#app {
  font-family: DM Sans, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

@font-face {
  font-family: DM Sans;
  src: url(DMSans-Regular.ttf);
}

.row {
  display: flex;
  align-items: center;
}

.row>h3 {
  margin: auto;
  text-align: center;
  padding: 0 10px;
  padding-top: 60px;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
}

.main {
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

@media only screen and (max-width: 600px) {
  .main {
    gap: 0;
  }
}

.main>* {
  margin: 10px;
}

.reload-button {
  margin: 0 1em;
}

.btngroup .q-btn {
  padding: 0.5rem;
}

.footer {

  text-align: center;
  padding: 0 5rem;
  font-size: 1rem;
  font-style: italic;
  font-weight: bold;
}

footer {
  margin-top: auto;
  padding-bottom: 1em;
  background-color: #CEE0DC;
}
</style>
