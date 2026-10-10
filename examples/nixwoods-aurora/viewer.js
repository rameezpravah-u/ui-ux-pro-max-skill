/* Aurora 3D viewer. Three.js r152 (global THREE). Units are metres.
   Scene: plaster wall, oak floor, walnut console, vase, books, framed print,
   the Aurora bar at 1.62 m with a lit diffuser, physically based lights.
   Follows the page's finish / length / direction chips. */
(function () {
  var box = document.getElementById("v3d"), canvas = document.getElementById("v3dCanvas"),
      poster = document.getElementById("v3dPoster"), ui = document.getElementById("v3dUi"),
      note = document.getElementById("v3dNote"), hint = document.getElementById("v3dHint"),
      powerBtn = document.getElementById("v3dPower");
  function hasGL() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  if (!window.THREE || !hasGL()) { poster.hidden = false; canvas.hidden = true; ui.hidden = true; hint.hidden = true; note.textContent = "This browser cannot show the 3D view, so the photo is shown instead."; return; }

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CM = { 36: 0.91, 40: 1.02, 48: 1.22 };
  var BAR_Y = 1.62, BAR_H = 0.044, BAR_D = 0.032;
  var state = { on: false, len: 0.91, finish: "teak", dir: "down" };
  var renderer, scene, camera, pmrem, bar, barMat, diffDown, diffUp, spotsDown = [], spotsUp = [], washDown, washUp;
  var target = new THREE.Vector3(0, 1.46, 0.05), yaw = 0.38, pitch = 0.0, radius = 1.9, vyaw = 0, vpitch = 0;
  var dirty = true, started = false, interacted = false, power = 0, powerTarget = 0, powerFrom = 0, powerT0 = 0, t0 = performance.now();

  /* ---------- procedural textures ---------- */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function valueNoise(w, h, seed, oct) {
    var r = rng(seed), grids = [], o, g, i;
    for (o = 0; o < oct; o++) { var n = 4 << o; g = new Float32Array((n + 1) * (n + 1)); for (i = 0; i < g.length; i++) g[i] = r(); grids.push({ n: n, g: g }); }
    var out = new Float32Array(w * h), amp, sum, x, y, k;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      sum = 0; amp = 1; var norm = 0;
      for (o = 0; o < oct; o++) {
        var G = grids[o], n2 = G.n, fx = x / w * n2, fy = y / h * n2, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        var a = G.g[iy * (n2 + 1) + ix], b = G.g[iy * (n2 + 1) + ix + 1], c = G.g[(iy + 1) * (n2 + 1) + ix], d = G.g[(iy + 1) * (n2 + 1) + ix + 1];
        sum += amp * ((a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty); norm += amp; amp *= 0.5;
      }
      out[y * w + x] = sum / norm;
    }
    return out;
  }
  function tex(c) { var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; }
  // grain runs along canvas y; the bar's long axis maps to v
  function woodTexture(finish) {
    var w = 256, h = 2048, c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d"), img = g.createImageData(w, h), d = img.data;
    var warp = valueNoise(w, h, finish === "teak" ? 31 : 77, 4), fine = valueNoise(w, h, finish === "teak" ? 53 : 91, 6);
    var base = finish === "teak" ? [158, 114, 66] : [46, 30, 22], dark = finish === "teak" ? [108, 72, 34] : [22, 13, 9], light = finish === "teak" ? [196, 156, 104] : [78, 52, 38];
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var i = y * w + x, u = x / w + (warp[i] - 0.5) * 0.35;
      var ring = Math.sin(u * 60 + Math.sin(y / h * 14) * 1.2) * 0.5 + 0.5; ring = Math.pow(ring, 2.2);
      var f = fine[i], k = ring * 0.55 + (f - 0.5) * 0.5, col, p = i * 4;
      for (var ch = 0; ch < 3; ch++) { col = base[ch] + (dark[ch] - base[ch]) * Math.max(0, k) + (light[ch] - base[ch]) * Math.max(0, -k) * 0.8; d[p + ch] = Math.max(0, Math.min(255, col + (f - 0.5) * 10)); }
      d[p + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    var t = tex(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function plasterTexture() {
    var w = 512, h = 512, c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d"), img = g.createImageData(w, h), d = img.data, n = valueNoise(w, h, 5, 6), n2 = valueNoise(w, h, 9, 3);
    for (var i = 0; i < w * h; i++) { var v = 150 + (n[i] - 0.5) * 70 + (n2[i] - 0.5) * 30, p = i * 4; d[p] = d[p + 1] = d[p + 2] = v; d[p + 3] = 255; }
    g.putImageData(img, 0, 0); return tex(c);
  }
  function floorTexture() {
    var w = 1024, h = 1024, c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d"); g.fillStyle = "#6E4E33"; g.fillRect(0, 0, w, h);
    var r = rng(3), plank = 128;
    for (var y = 0; y < h; y += plank) { var off = (y / plank % 2) * 300; for (var x = -300; x < w; x += 600) { g.fillStyle = "rgba(" + (90 + r() * 30 | 0) + "," + (62 + r() * 20 | 0) + "," + (38 + r() * 14 | 0) + ",1)"; g.fillRect(x + off, y, 600, plank); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(x + off, y, 2, plank); g.fillRect(x + off, y, 600, 2); } }
    var t = tex(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function washTexture() {
    var c = document.createElement("canvas"); c.width = 512; c.height = 256; var g = c.getContext("2d"), img = g.createImageData(512, 256), d = img.data;
    for (var y = 0; y < 256; y++) for (var x = 0; x < 512; x++) { var ty = y / 256, tx = Math.abs(x / 512 - 0.5) * 2; var hx = tx < 0.72 ? 1 : Math.max(0, 1 - (tx - 0.72) / 0.28); hx = hx * hx * (3 - 2 * hx); var v = Math.pow(1 - ty, 2.0) * hx * (1 - 0.3 * tx * tx); var p = (y * 512 + x) * 4; d[p] = 255; d[p + 1] = 255; d[p + 2] = 255; d[p + 3] = v * 255; }
    g.putImageData(img, 0, 0); var t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
  }
  function glowTexture() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 64; var g = c.getContext("2d");
    var r = g.createLinearGradient(0, 0, 0, 64); r.addColorStop(0, "rgba(255,210,150,0)"); r.addColorStop(0.5, "rgba(255,214,160,.55)"); r.addColorStop(1, "rgba(255,210,150,0)");
    g.fillStyle = r; g.fillRect(0, 0, 256, 64); var t = tex(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  /* ---------- geometry helpers ---------- */
  function roundedRect(w, h, r) { var s = new THREE.Shape(); s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return s; }
  // a bar of cross-section (depth d along z, height h along y), length L along x
  function barGeometry(L, d, h, r) {
    var geo = new THREE.ExtrudeGeometry(roundedRect(d, h, r), { depth: L, bevelEnabled: false, curveSegments: 6 });
    geo.rotateY(Math.PI / 2); geo.translate(-L / 2, 0, 0); // extrude axis -> x, shape x -> -z... fix below
    geo.computeVertexNormals();
    return geo;
  }
  function makeRoom() {
    var room = new THREE.Scene();
    var shell = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), new THREE.MeshStandardMaterial({ color: 0x5A4A3C, side: THREE.BackSide, roughness: 1 })); room.add(shell);
    var win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.8), new THREE.MeshBasicMaterial({ color: 0xFFF2DF })); win.position.set(-4.9, 1.8, 1.5); win.rotation.y = Math.PI / 2; room.add(win);
    var ceil = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.2), new THREE.MeshBasicMaterial({ color: 0xFFE2C0 })); ceil.position.set(0, 2.95, 1.5); ceil.rotation.x = Math.PI / 2; room.add(ceil);
    var warm = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), new THREE.MeshBasicMaterial({ color: 0xFFB070 })); warm.position.set(0, 1.4, -4.9); room.add(warm);
    return room;
  }

  /* ---------- build ---------- */
  function build() {
    var L = state.len;
    if (bar) { scene.remove(bar); bar.geometry.dispose(); }
    bar = new THREE.Mesh(barGeometry(L, BAR_D, BAR_H, 0.004), barMat);
    bar.position.set(0, BAR_Y, BAR_D / 2 + 0.004); bar.castShadow = true; bar.receiveShadow = true; scene.add(bar);
    var dl = L - 0.07;
    diffDown.geometry.dispose(); diffDown.geometry = new THREE.BoxGeometry(dl, 0.004, 0.022); diffDown.position.set(0, BAR_Y - BAR_H / 2 + 0.001, BAR_D / 2 + 0.004);
    diffUp.geometry.dispose(); diffUp.geometry = new THREE.BoxGeometry(dl, 0.004, 0.022); diffUp.position.set(0, BAR_Y + BAR_H / 2 - 0.001, BAR_D / 2 + 0.004);
    var up = state.dir === "updown"; diffUp.visible = up;
    spotsDown[0].position.set(0, BAR_Y - BAR_H / 2 - 0.08, 0.34); spotsDown[0].target.position.set(0, 0.0, 0.3); spotsUp[0].position.set(0, BAR_Y + BAR_H / 2 + 0.08, 0.34); spotsUp[0].target.position.set(0, 3.3, 0.3); spotsUp[0].visible = up;
    washDown.scale.set(L * 1.36, 1.3, 1); washDown.position.set(0, BAR_Y - BAR_H / 2 - 0.6, 0.002);
    washUp.scale.set(L * 1.36, 1.0, 1); washUp.position.set(0, BAR_Y + BAR_H / 2 + 0.47, 0.002); washUp.visible = state.dir === "updown";
    // frame camera to length
    radius = 1.05 + L * 0.78;
    dirty = true;
  }
  function placeCamera() {
    camera.position.set(target.x + radius * Math.sin(yaw) * Math.cos(pitch), target.y + radius * Math.sin(pitch), target.z + radius * Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(target); dirty = true;
  }
  function size() { var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; }
  function applyPower(p) {
    // p 0..1; colour temperature warms up as the driver settles
    var e = Math.pow(p, 1.4), col = new THREE.Color().lerpColors(new THREE.Color(0xFF9A4A), new THREE.Color(0xFFDFBA), Math.min(1, p * 1.3));
    diffDown.material.emissive.copy(col); diffDown.material.emissiveIntensity = 0.1 + 4.2 * e; diffDown.material.color.copy(col).multiplyScalar(0.25 + 0.75 * e);
    spotsDown[0].intensity = 1.4 * e; spotsDown[0].color.copy(col); spotsUp[0].intensity = 1.1 * e; spotsUp[0].color.copy(col);
    washDown.material.opacity = 0.42 * e; washUp.material.opacity = 0.36 * e; washDown.material.color.set(0xFFB266); washUp.material.color.set(0xFFB266);
    dirty = true;
  }
  function setPower(on) { state.on = on; powerTarget = on ? 1 : 0; powerFrom = power; powerT0 = performance.now(); powerBtn.textContent = on ? "Switch off" : "Switch on"; if (reduced) { power = powerTarget; applyPower(power); } }

  function start() {
    if (started) return; started = true;
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
    renderer.useLegacyLights = false;
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x14100E);
    camera = new THREE.PerspectiveCamera(34, 4 / 3, 0.05, 60);
    pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(makeRoom(), 0.04).texture;

    // wall, floor, skirting
    var plaster = plasterTexture(); plaster.repeat.set(3, 2);
    var wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.2), new THREE.MeshStandardMaterial({ color: 0xDDD2BF, roughness: 0.96, bumpMap: plaster, bumpScale: 0.0022, envMapIntensity: 0.25 }));
    wall.position.set(0, 1.6, 0); wall.receiveShadow = true; scene.add(wall);
    var ft = floorTexture(); ft.repeat.set(4, 4);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.55, envMapIntensity: 0.5 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 3); floor.receiveShadow = true; scene.add(floor);
    var skirt = new THREE.Mesh(new THREE.BoxGeometry(9, 0.1, 0.014), new THREE.MeshStandardMaterial({ color: 0xE6DCCB, roughness: 0.7 })); skirt.position.set(0, 0.05, 0.007); scene.add(skirt);

    // console table (walnut), books, vase, framed print
    var walnut = new THREE.MeshStandardMaterial({ map: woodTexture("brown"), roughness: 0.5, envMapIntensity: 0.6 }); walnut.map.repeat.set(2, 0.5);
    var top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.035, 0.42), walnut); top.position.set(0, 0.8, 0.21); top.castShadow = top.receiveShadow = true; scene.add(top);
    var legL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.78, 0.4), walnut); legL.position.set(-0.8, 0.39, 0.21); legL.castShadow = true; scene.add(legL);
    var legR = legL.clone(); legR.position.x = 0.8; scene.add(legR);
    var shelfBack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.02), walnut); shelfBack.position.set(0, 0.52, 0.03); scene.add(shelfBack);
    var paper = new THREE.MeshStandardMaterial({ color: 0xEFE7DA, roughness: 0.85 });
    var b1 = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.028, 0.23), paper); b1.position.set(0.06, 0.832, 0.2); b1.castShadow = true; scene.add(b1);
    var b2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.026, 0.21), new THREE.MeshStandardMaterial({ color: 0xD9CFBF, roughness: 0.85 })); b2.position.set(0.08, 0.859, 0.21); b2.rotation.y = -0.08; b2.castShadow = true; scene.add(b2);
    var bowl = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0.01, 0), new THREE.Vector2(0.09, 0.01), new THREE.Vector2(0.12, 0.045), new THREE.Vector2(0.115, 0.05)], 40), new THREE.MeshStandardMaterial({ color: 0x3A2A1F, roughness: 0.45, envMapIntensity: 0.8 })); bowl.position.set(0.08, 0.872, 0.21); bowl.castShadow = true; scene.add(bowl);
    var vasePts = []; for (var i = 0; i <= 14; i++) { var t = i / 14; vasePts.push(new THREE.Vector2(0.06 + Math.sin(t * Math.PI) * 0.07 - t * 0.02, t * 0.36)); }
    var vase = new THREE.Mesh(new THREE.LatheGeometry(vasePts, 48), new THREE.MeshStandardMaterial({ color: 0x8C8073, roughness: 0.9, bumpMap: plaster, bumpScale: 0.003 })); vase.position.set(-0.55, 0.818, 0.2); vase.castShadow = true; vase.receiveShadow = true; scene.add(vase);
    var frame = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.022), walnut); frame.position.set(0.62, 1.22, 0.011); frame.castShadow = true; scene.add(frame);
    var print = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38), new THREE.MeshStandardMaterial({ color: 0xBFB39B, roughness: 0.9 })); print.position.set(0.62, 1.22, 0.023); scene.add(print);
    var mount = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.27), new THREE.MeshStandardMaterial({ color: 0x9A8A6E, roughness: 0.95 })); mount.position.set(0.62, 1.22, 0.0235); scene.add(mount);

    // the Aurora
    barMat = new THREE.MeshStandardMaterial({ map: woodTexture(state.finish), roughness: state.finish === "teak" ? 0.55 : 0.42, metalness: 0, envMapIntensity: 0.7 });
    barMat.map.repeat.set(1 / BAR_H, 1); // u spans the cross-section, v the length
    var diffMat = new THREE.MeshStandardMaterial({ color: 0xFFF1DE, emissive: 0xFFD9AE, emissiveIntensity: 4, roughness: 0.9 });
    diffDown = new THREE.Mesh(new THREE.BoxGeometry(1, 0.004, 0.022), diffMat); scene.add(diffDown);
    diffUp = new THREE.Mesh(new THREE.BoxGeometry(1, 0.004, 0.022), diffMat); scene.add(diffUp);
    function spot(cast) { var s = new THREE.SpotLight(0xFFD2A0, 0, 0, 1.0, 1, 2); if (cast) { s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -0.0004; s.shadow.normalBias = 0.004; s.shadow.radius = 6; s.shadow.camera.near = 0.02; s.shadow.camera.far = 6; } scene.add(s); scene.add(s.target); return s; }
    spotsDown.push(spot(true)); spotsDown[0].angle = 1.3; spotsUp.push(spot(false)); spotsUp[0].angle = 1.3;
    var washMat = new THREE.MeshBasicMaterial({ map: washTexture(), color: 0xFFC890, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    washDown = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), washMat); washDown.position.z = 0.002; scene.add(washDown);
    washUp = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), washMat.clone()); washUp.position.z = 0.002; washUp.rotation.z = Math.PI; scene.add(washUp);

    // room light so the off state reads
    scene.add(new THREE.HemisphereLight(0xE9DCCB, 0x3A2E26, 0.55));
    var key = new THREE.DirectionalLight(0xEADFCF, 1.4); key.position.set(-3, 3.2, 3.5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -2; key.shadow.camera.right = 2; key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -0.5; key.shadow.bias = -0.0006; scene.add(key);

    build(); placeCamera(); size(); applyPower(0);
    new ResizeObserver(size).observe(box);

    // interaction: drag with inertia
    var drag = null, last = null;
    canvas.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY }; last = { x: e.clientX, y: e.clientY, t: performance.now() }; vyaw = vpitch = 0; interacted = true; canvas.setPointerCapture(e.pointerId); hint.classList.add("gone"); });
    canvas.addEventListener("pointermove", function (e) {
      if (!drag) return; var dx = e.clientX - last.x, dy = e.clientY - last.y, now = performance.now(), dt = Math.max(8, now - last.t);
      yaw = clamp(yaw - dx * 0.0055, -1.1, 1.1); pitch = clamp(pitch + dy * 0.004, -0.14, 0.38);
      vyaw = -dx * 0.0055 / dt * 16; vpitch = dy * 0.004 / dt * 16; last = { x: e.clientX, y: e.clientY, t: now }; placeCamera();
    });
    function release() { drag = null; }
    canvas.addEventListener("pointerup", release); canvas.addEventListener("pointercancel", release);
    document.getElementById("v3dReset").addEventListener("click", function () { yaw = 0.38; pitch = 0.0; vyaw = vpitch = 0; placeCamera(); });
    powerBtn.addEventListener("click", function () { setPower(!state.on); });

    // the switch-on reveal, 450 ms after the viewer is first seen
    setTimeout(function () { setPower(true); }, reduced ? 0 : 450);

    (function loop(now) {
      requestAnimationFrame(loop);
      var moving = false;
      if (!drag && (Math.abs(vyaw) > 0.00005 || Math.abs(vpitch) > 0.00005)) { yaw = clamp(yaw + vyaw, -1.1, 1.1); pitch = clamp(pitch + vpitch, -0.14, 0.38); vyaw *= 0.93; vpitch *= 0.93; placeCamera(); moving = true; }
      if (!reduced && !interacted && now - t0 < 24000) { var drift = Math.sin(now / 4200) * 0.012; camera.position.x += drift; camera.lookAt(target); moving = true; }
      if (power !== powerTarget) { var k = reduced ? 1 : Math.min(1, (now - powerT0) / 900); k = 1 - Math.pow(1 - k, 3); power = powerFrom + (powerTarget - powerFrom) * k; if (k >= 1) power = powerTarget; applyPower(power); moving = true; }
      if (dirty || moving) { dirty = false; renderer.render(scene, camera); }
    })(performance.now());
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function sync() {
    var f = document.querySelector('input[name="finish"]:checked').value, s = document.querySelector('input[name="size"]:checked').value, d = document.querySelector('input[name="dir"]:checked').value;
    var changed = f !== state.finish; state.finish = f; state.len = CM[s]; state.dir = d;
    if (!started) return;
    if (changed) { var old = barMat.map; barMat.map = woodTexture(f); barMat.map.repeat.set(1 / BAR_H, 1); barMat.roughness = f === "teak" ? 0.55 : 0.42; barMat.needsUpdate = true; old.dispose(); }
    build(); placeCamera();
  }
  [].forEach.call(document.querySelectorAll('input[name="finish"],input[name="size"],input[name="dir"]'), function (i) { i.addEventListener("change", sync); });
  sync();
  if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { start(); sync(); io.disconnect(); } }); }, { rootMargin: "160px" }); io.observe(box); } else { start(); }
})();
