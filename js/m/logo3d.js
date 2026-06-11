import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export function initLogo3D() {
  var canvas = document.getElementById('logo3d');
  if (!canvas) return;

  var wrap = canvas.parentElement;
  var W = wrap.clientWidth || 400;
  var H = 550;

  // Render solo cuando el canvas esta en pantalla. El logo vive en la seccion
  // de ventajas (oculta casi siempre), asi que sin esto renderiza WebGL en cada
  // frame de gusto y traba el scroll en movil.
  var _visible = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      _visible = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(canvas);
  } else {
    _visible = true;
  }

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // DRACOLoader decodifica el glb comprimido con Draco. El decoder se baja
  // del CDN de Google (pequeño y cacheado), no se sube al repo.
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
    var logoBaseScale = 4.0 / maxDim;
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

  function animate() {
    requestAnimationFrame(animate);

    if (!_visible) return;

    smoothRotY += (windX * LOGO_ROT_Y - smoothRotY) * 0.12;
    smoothRotX += (-windY * LOGO_ROT_X - smoothRotX) * 0.12;
    logoGroup.rotation.y = smoothRotY;
    logoGroup.rotation.x = smoothRotX;

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
