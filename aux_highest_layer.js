images = document.querySelectorAll('img');
left_max = '370'
seen = new Set();
pressed = [];
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function getLayerFromImg (img) {
  layer = img.alt.split('-');
  layer[0] = layer[0].slice(11);
  layer = layer.map( x => Number(x) );
  return layer;
}
function check_intersect(layer1, layer2) {
  return (layer1[0] < layer2[0] && Math.abs(layer1[1] - layer2[1]) < 8 && Math.abs(layer1[2] - layer2[2]) < 8);
}

function getNumAbove (img) {
  let layer = getLayerFromImg(img);
  let num = 0;
  for (let i = 0; i < images.length; i++) {
    if (!seen.has(i) && parseInt(images[i].parentElement.style.left, 10) < left_max) {
      let layer_local = getLayerFromImg(images[i]);
      if (check_intersect(layer, layer_local)) {
        num++;
      }
    }
  }
  return num;
}

images.forEach(img => {
  img.onmouseover = function (event) {
    if (event.target.style.opacity == 1) {
      // Get current mahjong's layer and print it.
      let rect = event.target.getBoundingClientRect();
      let num = getLayerFromImg(event.target)[0];
      let text = document.createElement('p');
      text.className = 'test';
      text.style.position = 'absolute';
      text.style.left = (rect.x + 3) + 'px';
      text.style.top = (rect.y + 18) + 'px';
      text.style.zIndex = 999;
      text.style.fontWeight = 'bold';
      text.style.color = 'purple';
      text.innerHTML = num;
      document.body.appendChild(text);
      // Get max layers.
      maxLayer = -1;
      maxLayers = [];
      maxLayersTwo = [];
      // Get Max Layer.
      for (i = 0; i < images.length; i++) {
        if (images[i].style.opacity == 1 && parseInt(images[i].parentElement.style.left, 10) < left_max) {
          layer = getLayerFromImg(images[i]);
          if (layer[0] > maxLayer) {
            maxLayer = layer[0];
            maxLayersTwo = [...maxLayers];
            maxLayers = [images[i]];
          }
          else if (layer[0] == maxLayer) {
            maxLayers.push(images[i]);
          }
          else if (layer[0] == maxLayer - 1) {
            maxLayersTwo.push(images[i]);
          }
        }
      }
      // For first layer, note a number above them.
      for (i = 0; i < maxLayers.length; i++) {
        let rect = maxLayers[i].getBoundingClientRect();
        let text = document.createElement('h1');
        text.className = 'test';
        text.style.position = 'absolute';
        text.style.left = (rect.x + 18) + 'px';
        text.style.top = (rect.y + 18) + 'px';
        text.style.zIndex = 998;
        text.innerHTML = "🟦";
        document.body.appendChild(text);
      }
      // Add second layer
      for (i = 0; i < maxLayersTwo.length; i++) {
        let rect = maxLayersTwo[i].getBoundingClientRect();
        let text = document.createElement('h1');
        text.className = 'test';
        text.style.position = 'absolute';
        text.style.left = (rect.x + 18) + 'px';
        text.style.top = (rect.y + 18) + 'px';
        text.style.zIndex = 998;
        text.innerHTML = "🟥";
        document.body.appendChild(text);
      }
      // Add layer count of the same symbol.
      for (i = 0; i < images.length; i++) {
        if (images[i].src == event.target.src) {
          let rect = images[i].getBoundingClientRect();
          let num = getNumAbove(images[i]);
          if (num < 4) {
            let text = document.createElement('p');
            text.className = 'test';
            text.style.position = 'absolute';
            text.style.left = (rect.x + 3) + 'px';
            text.style.top = (rect.y) + 'px';
            text.style.zIndex = 999;
            text.style.fontWeight = 'bold';
            text.style.color = 'purple';
            text.innerHTML = num + 1;
            document.body.appendChild(text);
          }
        }
      }
    }
  }
  img.onmousedown = function (event) {
    if (event.target.src.includes("btn-move")) {
      pressed.push(["tool", "remove", ""]);
    }
    if (event.target.style.opacity == 1) {
      pressed.push(getLayerFromImg(event.target));
      for (i = 0; i < images.length; i++) {
        if (images[i] == event.target) {
          index = i;
          break;
        }
      }
      seen.add(index);
    }
  }
  img.onmouseleave = function (event) {
    if (event.target.style.opacity == 1) {
      document.getElementsByClassName('test').remove();
    }
  }
})

