import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export function initLogo3D() {
  var canvas = document.getElementById('logo3d');
  if (!canvas) return;

  var wrap = canvas.parentElement;
  var W = wrap.clientWidth || 400;
  var H = 550;

  var _visible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      _visible = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(canvas);
  } else {
    _visible = true;
  }

  var _isMob = window.matchMedia('(max-width: 768px)').matches;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !_isMob });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, _isMob ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  var ambient = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambient);
  var dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(2, 3, 4);
  scene.add(dir);
  var dir2 = new THREE.DirectionalLight(0xffffff, 0.6);
  dir2.position.set(-2, 0, -2);
  scene.add(dir2);

  var logoGroup = new THREE.Group();
  scene.add(logoGroup);

  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  var loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load('./logo/logodunedragon.glb', function (gltf) {
    var model = gltf.scene;

    model.rotation.set(Math.PI / 2, 0, 0);
    model.updateMatrixWorld();

    model.traverse(function (child) {
      if (child.isMesh) {
        child.geometry.applyMatrix4(child.matrixWorld);
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
      child.position.set(0, 0, 0);
      child.rotation.set(0, 0, 0);
      child.scale.set(1, 1, 1);
    });

    var box = new THREE.Box3().setFromObject(model);
    var center = box.getCenter(new THREE.Vector3());

    model.traverse(function (child) {
      if (child.isMesh) {
        child.geometry.translate(-center.x, -center.y, -center.z);
      }
    });

    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    var size = box.getSize(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z);
    // 3.5 (antes 4.0) deja margen para que no se corten los cuernos al girar.
    var logoBaseScale = 3.5 / maxDim;
    model.scale.setScalar(logoBaseScale);

    logoGroup.add(model);
  });

  var windX = 0, windY = 0;
  var smoothRotX = 0, smoothRotY = 0;
  var LOGO_ROT_Y = 0.8;
  var LOGO_ROT_X = 0.3;

  window.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    windX = ((e.clientX - cx) / (rect.width / 2));
    windY = ((e.clientY - cy) / (rect.height / 2));
  });

  canvas.addEventListener('mouseleave', function () {
    windX = 0;
    windY = 0;
  });

  // Solo en celular: movimiento propio + impulso al desplazar (sin mouse).
  // En PC el logo se mueve unicamente con el mouse.
  var _t = 0;
  var _spin = 0;
  var _spinVel = 0;
  var _lastSY = null;
  var _lastTY = null;

  function _kick(d) {
    _spinVel += d;
    if (_spinVel > 0.45) _spinVel = 0.45;
    else if (_spinVel < -0.45) _spinVel = -0.45;
  }

  if (_isMob) {
    document.addEventListener('scroll', function (e) {
      var el = e.target;
      var y = (el === document || el === window) ? (window.scrollY || 0) : (el.scrollTop || 0);
      if (_lastSY !== null) _kick((y - _lastSY) * 0.0009);
      _lastSY = y;
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', function (e) {
      if (!e.touches || !e.touches.length) return;
      var y = e.touches[0].clientY;
      if (_lastTY !== null) _kick((_lastTY - y) * 0.0016);
      _lastTY = y;
    }, { passive: true });
    window.addEventListener('touchend', function () { _lastTY = null; });
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!_visible) return;

    // Escala controlable desde el panel (?dev) vía la var --logo3d-scale del wrap.
    var _us = parseFloat(wrap.style.getPropertyValue('--logo3d-scale'));
    logoGroup.scale.setScalar(_us > 0 ? _us : 1);

    smoothRotY += (windX * LOGO_ROT_Y - smoothRotY) * 0.12;
    smoothRotX += (-windY * LOGO_ROT_X - smoothRotX) * 0.12;

    if (_isMob) {
      _t += 0.016;
      _spin += _spinVel;
      _spinVel *= 0.93;
      var autoY = Math.sin(_t * 0.5) * 0.32;
      var autoX = Math.sin(_t * 0.4) * 0.10;
      logoGroup.rotation.y = smoothRotY + autoY + _spin;
      logoGroup.rotation.x = smoothRotX + autoX;
    } else {
      logoGroup.rotation.y = smoothRotY;
      logoGroup.rotation.x = smoothRotX;
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    W = wrap.clientWidth;
    if (W < 1) W = 400;
    H = Math.min(550, W * 0.85);
    canvas.width = W;
    canvas.height = H;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);

  animate();
}
