// Reshape Tool Tweaks
// By: SharkPool

export default async function({ addon }) {
  let ogDrawSelected;

  let handleSize = 8, handleShape = "square";

  // addon util
  function requestAddonState() {
    handleSize = Math.min(25, Math.max(3, addon.settings.get("handleSize")));
    handleShape = addon.settings.get("handleShape");
  }

  function patchWorker() {
    /*
      this section makes handles square instead of round
      most of this code is ripped (and compressed) directly from Paper.js
    */
    function drawSegments(e,n,o){var r,a,i,s,l,t,f,v,d=n._segments,$=d.length,m=Array(6),u=!0;function c(n){if(o)n._transformCoordinates(o,m),r=m[0],a=m[1];else{var d=n._point;r=d._x,a=d._y}if(u)e.moveTo(r,a),u=!1;else{if(o)l=m[2],t=m[3];else{var $=n._handleIn;l=r+$._x,t=a+$._y}l===r&&t===a&&f===i&&v===s?e.lineTo(r,a):e.bezierCurveTo(f,v,l,t,r,a)}if(i=r,s=a,o)f=m[4],v=m[5];else{var $=n._handleOut;f=i+$._x,v=s+$._y}}for(var g=0;g<$;g++)c(d[g]);n._closed&&$>0&&c(d[0])}

    function drawHandles(ctx, segments, matrix, size) {
      if (size <= 0) return;

      var half = size / 2,
        miniSize = size - 2,
        miniHalf = half - 1,
        coords = new Array(6),
        pX, pY;

      function drawHandle(index) {
        var hX = coords[index],
          hY = coords[index + 1];
        if (pX != hX || pY != hY) {
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(hX, hY);
          ctx.stroke();

          // draw a square instead of circle
          // wow such a big patch for small change
          ctx.beginPath();
          if (handleShape === "square") ctx.rect(hX - half, hY - half, half * 2, half * 2);
          else ctx.arc(hX, hY, half, 0, Math.PI * 2, true);
          ctx.fill();
        }
      }

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i],
          selection = segment._selection;
        segment._transformCoordinates(matrix, coords);
        pX = coords[0];
        pY = coords[1];
        if (selection & 2) drawHandle(2);
        if (selection & 4) drawHandle(4);
        ctx.fillRect(pX - half, pY - half, size, size);
        if (miniSize > 0 && !(selection & 1)) {
          var fillStyle = ctx.fillStyle;
          ctx.fillStyle = '#ffffff80';
          ctx.fillRect(pX - miniHalf, pY - miniHalf, miniSize, miniSize);
          ctx.fillStyle = fillStyle;
        }
      }
    }

    if (!ogDrawSelected) ogDrawSelected = paper.Path.prototype._drawSelected;
    paper.Path.prototype._drawSelected = function(ctx, matrix) {
      const setHandleSize = paper.settings.handleSize;
      ctx.beginPath();
      drawSegments(ctx, this, matrix);
      ctx.stroke();
      drawHandles(
        ctx, this._segments, matrix,
        /* override the handleSize */
        setHandleSize === 0 ? 0 : handleSize
      );
    }
  }

  if (typeof scaffolding === "undefined") {
    // initialize our patch when Paper is availiable
    requestAddonState();
    const unsubscribe = ReduxStore.subscribe(() => {
      if (typeof paper === "object") queueMicrotask(() => {
        patchWorker();
        unsubscribe();
      });
    });
  }

  addon.settings.addEventListener("change", requestAddonState);
  addon.self.addEventListener("disabled", () => {
    // reset
    paper.Path.prototype._drawSelected = ogDrawSelected;
  });
  addon.self.addEventListener("reenabled", patchWorker);
}
