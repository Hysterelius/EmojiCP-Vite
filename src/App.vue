<template>
  <div class="row">
    <h3>Welcome to the Emoji Contact photo maker</h3>
  </div><br>

  <div class="main">
    <div>
      <Picker 
      :data = "emojiIndex"
      emoji = "point_up_2"
      title = "Pick your emoji…"
      set = "twitter"
      @select = "emojiPicked" />

    </div>

    <div style="display: flexbox">
          <label for="Colour1">Colour 1 for gradient: </label>
          <q-badge outline :style="{
                'background': colour1 + '!important', 
                'color': invertHex(colour1) + '!important',
                'font-family': 'monospace', 'font-this.canvasSize': '20px'
              }" 
              class="q-mb-sm" q>
            {{ colour1 }}
          </q-badge>

          <q-icon name="colorize" class="cursor-pointer" size="20px">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color :default-value=colour1 @update:model-value ="val => changeColour1(val)" />
          </q-popup-proxy>
          </q-icon>
          <br>
          
          <label for="Colour2">Colour 2 for gradient: </label>
          <q-badge outline :style="{
                'background': colour2 + '!important', 
                'color': invertHex(colour2) + '!important',
                'font-family': 'monospace', 'font-this.canvasSize': '20px'
              }" 
              class="q-mb-sm" q>
            {{ colour2 }}
          </q-badge>
          <q-icon name="colorize" class="cursor-pointer" size="20px">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color :default-value=colour2 @update:model-value ="val => changeColour2(val)" />
          </q-popup-proxy>
          </q-icon>
          <br>



          <span class="text-h6" style="margin: 0">Size:</span>
          <q-slider
            v-model="canvasSize"
            color="blue-grey-7"
            markers
            :marker-labels="imgSizeMarkerLabel"
            :min="100"
            :max="400"
            :step="50"
            @change="changeSize()"
          />

          <span class="text-h6" style="margin: 0">Emoji Size:</span>
          <q-slider
            v-model="emojiScale"
            color="blue-grey-7"
            markers
            marker-labels
            :min="0.5"
            :max="2"
            :step="0.5"
            @change="changeSize()"
          />


          
          <div style="justify-content: center;">
            <canvas id="myCanvas" width="300" height="300" name="Canvas with no emoji"
                  style="border:1px solid #d3d3d3;">
                  Your browser does not support the HTML canvas tag.</canvas>
            <canvas id="myCanvas2" width="300" height="300" name="Canvas with no emoji"
                  style="border:1px solid #d3d3d3; display: none">
                  Your browser does not support the HTML canvas tag.</canvas>
          </div>
          
          <br>
          <q-btn :loading="downloadProgress"  @click="downloadCanvas()" color="white" text-color="black" label="Download">
            <template v-slot:loading>
              <q-spinner-gears />
            </template>
          </q-btn>

    </div>
  </div>


</template>




<script>
// Import data/twitter.json to reduce this.canvasSize, all.json contains data for
// all emoji sets.
import data from "emoji-mart-vue-fast/data/twitter.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";

// Vue 3, import components from `/src`:
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";



import { ref } from 'vue';




// Create emoji data index.
// We can change it (for example, filter by category) before passing to the component.
let emojiIndex = new EmojiIndex(data);

let currentEmoji = [null, null];
let currentEmoji2 = [null, null];

export default {
  name: "App",
  components: {
    Picker
  },

  setup () {
    const downloadProgress = ref(false)

    return {
      canvasSize: ref('100'),
      emojiScale: ref('1'),
      imgSizeMarkerLabel: { 100: '300px', 150: '450px', 200: '600px', 250: '750px', 300: '900px', 350: '1050px', 400: '1200px' },
      downloadProgress,
      
    }
  },

  created () {
    document.title = "Emoji CP";
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
      baseStr: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/"
    };
  },


  methods: {
    updateCanvasEmoji(emoji) {
      let emojiStr = this.parseEmoji(emoji);
      


    },

    invertHex(hex) {
        let newHex = "#fced1e"
        let LorD = this.lightOrDark(hex);
        if (LorD == 'dark') {
          newHex = '#ffffff'
        } else {
          newHex = '#000000'
        }
        return newHex
    },

    lightOrDark(color) {
      // https://awik.io/determine-color-bright-dark-using-javascript/

        // Variables for red, green, blue values
        var r, g, b, hsp;
        
        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {

            // If RGB --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            
            r = color[1];
            g = color[2];
            b = color[3];
        } 
        else {
            
            // If hex --> Convert it to RGB: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace( 
            color.length < 5 && /./g, '$&$&'));

            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }
        
        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
        );

        // Using the HSP value, determine whether the color is light or dark
        if (hsp>127.5) {

            return 'light';
        } 
        else {

            return 'dark';
        }
    },

    parseEmoji(emoji) {
      var unicodeEmoji = emoji.unified;
      if (!unicodeEmoji.includes("200d")) {
        unicodeEmoji = unicodeEmoji.replaceAll("-fe0f", "")
      }
      return this.baseStr + unicodeEmoji + '.svg';
    },

    async emojiPicked(emoji) {
      let svgAddress = await this.parseEmoji(emoji)
      this.getText(svgAddress).then(
        (text) => {
          // this.drawInlineSVG(ctx, text[0], function() {

          // }, c);

          currentEmoji[0] = text;
          currentEmoji[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas"), text);

          currentEmoji2[0] = text;
          currentEmoji2[1] = emoji.id;
          this.prepareCanvas(true, document.getElementById("myCanvas2"), text);
        }

      );


  },

    downloadCanvas() {
      this.downloadProgress = true;
      let canvas = document.getElementById("myCanvas2");
      // get canvas data  
      let image = canvas.toDataURL();

      // create temporary link  
      let tmpLink = document.createElement( "a" );
      if (currentEmoji[1]) {
          tmpLink.download = `ContactPhoto-(${currentEmoji[1].replaceAll(" ", "-")})-${this.canvasSize*3}px.png`; // set the name of the download file 
      } else {
          tmpLink.download = "image.png" // set the name of the download file 
      }
      tmpLink.href = image;  

      // temporarily add link to body and initiate the download  
      document.body.appendChild( tmpLink );  
      tmpLink.click();  
      document.body.removeChild( tmpLink );
      this.downloadProgress = false;
      },

    async getText(file) {
          let x = await fetch(file);
          let y = await x.text();


          return  y;
    },

    editSVG(svg, canvas) {
        let pos = svg.indexOf("svg") + 4;
        let newSVG = svg.slice(0, pos) + `width=\"${(canvas.width/3)*this.emojiScale}\" height=\"${(canvas.height/3)*this.emojiScale}\" ` + svg.slice(pos);
        return newSVG;
    },



    drawInlineSVG(ctx, rawSVG, callback, canvas) {
        let svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svg),
        img = new Image;

        let edgeDis = (canvas.width - (canvas.width/3)*this.emojiScale) / 2;

        img.onload = () => {
            this.prepareCanvas(false, canvas);
            ctx.drawImage(img, edgeDis, edgeDis);
            domURL.revokeObjectURL(url);
            callback();
        };

        img.src = url;
    },

    prepareCanvas(doUpdate, canvas, emojiText = currentEmoji[0]) { 
        let s = canvas.width;
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let xpos = Math.floor(s/2);

        let grd = ctx.createLinearGradient(xpos, 0, xpos, s);
        grd.addColorStop(0, this.colour1);
        grd.addColorStop(1, this.colour2);
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (currentEmoji[0] && doUpdate) {
            ctx = canvas.getContext("2d");


            this.drawInlineSVG(ctx, this.editSVG(emojiText, canvas), function() {
            },
            canvas)

        }
    },

    doBoth() {
      this.prepareCanvas(true, document.getElementById("myCanvas"), currentEmoji[0]);
      this.prepareCanvas(true, document.getElementById("myCanvas2"), currentEmoji2[0]);
    },

    changeColour1(value) {
        this.colour1 = value;
        this.doBoth()
    },

    changeColour2(value) {
        this.colour2 = value;
        this.doBoth()
    },

    changeSize() {
        let c = document.getElementById("myCanvas2");
        c.setAttribute("width", this.canvasSize * 3);
        c.setAttribute("height", this.canvasSize * 3);
        this.doBoth()
    }

  }
};
</script>

<style>
#app {
  font-family: DM Sans, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

@font-face {
    font-family: DM Sans;
    src: url(DMSans-Regular.ttf);
}

.row {
  display: flex;
  align-items: center;
}

.row > h3 {
  margin: auto;
  text-align: center;
  padding: 0 10px;
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

.main > * {
  margin: 10px;
}
</style>
