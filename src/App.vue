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
          <q-color :default-value="colour1" @update:model-value="(val) => changeColour1(val)" />
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
          <q-color :default-value="colour2" @update:model-value="(val) => changeColour2(val)" />
        </q-popup-proxy>
      </q-icon>
      <br />

      <span class="text-h6" style="margin: 0">Size:</span>
      <q-slider v-model="canvasSize" color="blue-grey-7" markers :marker-labels="imgSizeMarkerLabel" :min="100" :max="400"
        :step="50" @change="changeSize()" />

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

<script>
// Import data/twitter.json to reduce this.canvasSize, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/twitter.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

// Vue 3, import components from `/src`:
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

import { ref } from "vue";

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

export default {
  name: "App",
  components: {
    Picker,
  },

  setup() {
    const downloadProgress = ref(false);

    return {
      canvasSize: ref("100"),
      emojiScale: ref("1"),
      emojiCurrentlySelected: ref("1"),
      smolEmojiPlace: ref("se"),
      imgSizeMarkerLabel: {
        100: "300px",
        150: "450px",
        200: "600px",
        250: "750px",
        300: "900px",
        350: "1050px",
        400: "1200px",
      },
      downloadProgress,
    };
  },

  created() {
    if (localStorage.getItem('colour1')) {
      this.colour1 = localStorage.getItem('colour1');
    }
    if (localStorage.getItem('colour2')) {
      this.colour2 = localStorage.getItem('colour2');
    }
    if (localStorage.getItem('canvasSize')) {
      this.canvasSize = localStorage.getItem('canvasSize');
    }
    if (localStorage.getItem('emojiScale')) {
      this.emojiScale = localStorage.getItem('emojiScale');
    }
  },

  mounted() {
    this.prepareCanvas(true, document.getElementById("myCanvas"));
    this.prepareCanvas(true, document.getElementById("myCanvas2"));
  },

  data() {
    return {
      emojiIndex: emojiIndex,
      emojisOutput: "",
      colour1: "#858e96",
      colour2: "#60696b",
      baseStr: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/",
    };
  },

  methods: {
    updateCanvasEmoji(emoji) {
      let emojiStr = this.parseEmoji(emoji);
    },

    invertHex(hex) {
      let newHex = "#fced1e";
      let LorD = this.lightOrDark(hex);
      if (LorD == "dark") {
        newHex = "#ffffff";
      } else {
        newHex = "#000000";
      }
      return newHex;
    },

    lightOrDark(color) {
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
    },

    parseEmoji(emoji) {
      var unicodeEmoji = emoji.unified;
      if (!unicodeEmoji.includes("200d")) {
        unicodeEmoji = unicodeEmoji.replaceAll("-fe0f", "");
      }
      if (unicodeEmoji.includes("20e3")) {
        unicodeEmoji = unicodeEmoji.replaceAll("00", "");
      }
      return this.baseStr + unicodeEmoji + ".svg";
    },

    async emojiPicked(emoji) {
      if (emoji.id != currentEmoji[1] && this.emojiCurrentlySelected == 1) {
        let svgAddress = await this.parseEmoji(emoji);
        this.getText(svgAddress).then((text) => {
          // this.drawInlineSVG(ctx, text[0], function() {

          // }, c);

          currentEmoji[0] = text;
          currentEmoji[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas"), text);

          currentEmoji2[0] = text;
          currentEmoji2[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas2"), text);
        });
      } else if (
        emoji.id != smolCurrentEmoji[1] &&
        this.emojiCurrentlySelected == 2
      ) {
        let svgAddress = await this.parseEmoji(emoji);
        this.getText(svgAddress).then((text) => {
          // this.drawInlineSVG(ctx, text[0], function() {

          // }, c);

          smolCurrentEmoji[0] = text;
          smolCurrentEmoji[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas"));

          smolCurrentEmoji2[0] = text;
          smolCurrentEmoji2[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas2"));
        });
      }
    },

    downloadCanvas() {
      this.downloadProgress = true;
      let canvas = document.getElementById("myCanvas2");
      // get canvas data
      let image = canvas.toDataURL();

      // create temporary link
      let tmpLink = document.createElement("a");
      if (currentEmoji[1]) {
        tmpLink.download = `ContactPhoto-(${currentEmoji[1].replaceAll(
          " ",
          "-"
        )})-${this.canvasSize * 3}px.png`; // set the name of the download file
      } else {
        tmpLink.download = "image.png"; // set the name of the download file
      }
      tmpLink.href = image;

      // temporarily add link to body and initiate the download
      document.body.appendChild(tmpLink);
      tmpLink.click();
      document.body.removeChild(tmpLink);
      this.downloadProgress = false;
    },

    async getText(file) {
      let x = await fetch(file);
      let y = await x.text();

      return y;
    },

    editSVG(svg, canvas, scaleFactor = 1) {
      let pos = svg.indexOf("svg") + 4;

      let scale = Math.floor(
        (canvas.width / 3) * this.emojiScale * scaleFactor
      );

      let newSVG =
        svg.slice(0, pos) +
        `width=\"${scale}\" height=\"${scale}\" ` +
        svg.slice(pos);
      return newSVG;
    },

    drawInlineSVG(ctx, rawSVG, callback, offsetx, offsety = offsetx) {
      let svg = new Blob([rawSVG], { type: "image/svg+xml;charset=utf-8" }),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svg),
        img = new Image();

      img.onload = () => {
        // this.prepareCanvas(false, canvas);
        ctx.drawImage(img, Math.floor(offsetx), Math.floor(offsety));
        domURL.revokeObjectURL(url);
        callback();
      };

      img.src = url;
    },

    prepareCanvas(doUpdate, canvas, emojiText = currentEmoji[0]) {
      let s = canvas.width;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let xpos = Math.floor(s / 2);

      let grd = ctx.createLinearGradient(xpos, 0, xpos, s);
      grd.addColorStop(0, this.colour1);
      grd.addColorStop(1, this.colour2);

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (doUpdate) {
        ctx = canvas.getContext("2d");

        if (currentEmoji[0]) {
          this.drawInlineSVG(
            ctx,
            this.editSVG(currentEmoji[0], canvas),
            function () { },
            (canvas.width - (canvas.width / 3) * this.emojiScale) / 2
          );
        }

        if (smolCurrentEmoji[0]) {
          this.drawInlineSVG(
            ctx,
            this.editSVG(smolCurrentEmoji[0], canvas, 0.5),
            function () { },
            this.smolCalcPos(0, canvas),
            this.smolCalcPos(1, canvas)
          );
        }
      }
    },

    doBoth() {
      this.prepareCanvas(
        true,
        document.getElementById("myCanvas"),
        currentEmoji[0]
      );
      this.prepareCanvas(
        true,
        document.getElementById("myCanvas2"),
        currentEmoji2[0]
      );
    },

    changeColour1(value) {
      this.colour1 = value;
      localStorage.setItem('colour1', value);
      this.doBoth();
    },

    changeColour2(value) {
      this.colour2 = value;
      localStorage.setItem('colour2', value);
      this.doBoth();
    },

    changeSize() {
      let c = document.getElementById("myCanvas2");
      if (localStorage.getItem('canvasSize') != this.canvasSize) {
        localStorage.setItem('canvasSize', this.canvasSize);
      }
      if (localStorage.getItem('emojiScale') != this.emojiScale) {
        localStorage.setItem('emojiScale', this.emojiScale);
      }
      c.setAttribute("width", this.canvasSize * 3);
      c.setAttribute("height", this.canvasSize * 3);

      this.doBoth();
    },

    reset() {
      if (this.emojiCurrentlySelected == 1) {
        currentEmoji = [null, null];
        currentEmoji2 = [null, null];
        this.doBoth();
      } else if (this.emojiCurrentlySelected == 2) {
        smolCurrentEmoji = [null, null];
        smolCurrentEmoji2 = [null, null];
        this.doBoth();
      }
    },

    updatePlace() {
      this.doBoth();
    },

    smolCalcPos(xory = 0, canvas) {
      return (
        (canvas.width - (canvas.width / 3) * this.emojiScale) / 2 +
        emojiPlace[this.smolEmojiPlace][xory] *
        (canvas.width / 3) *
        this.emojiScale
      );
    },
  },
};
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
