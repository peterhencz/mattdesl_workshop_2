// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1024, 1024],
  scaleToView: true,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
  camera.position.set(3, 4, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 50, 100);

  const loader = new THREE.TextureLoader();

  const jup_texture = loader.load("assets/jup.jpg");
  const eu_texture = loader.load("assets/europa2_out.jpg");
  // Setup a material
  const jup_material = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: jup_texture,
  });

  const eu_material = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: eu_texture,
  });
  // Setup a mesh with geometry + material
  const jupiterMesh = new THREE.Mesh(geometry, jup_material);
  jupiterMesh.scale.setScalar(0.6);
  scene.add(jupiterMesh);

  const euGroup = new THREE.Group();

  const euMesh = new THREE.Mesh(geometry, eu_material);
  euMesh.position.set(1, 0, 2);
  euMesh.scale.setScalar(0.25);
  euGroup.add(euMesh);

  scene.add(euGroup);

  const light = new THREE.PointLight("white", 1);

  light.position.set(3, 2, 1);
  scene.add(light);

  scene.add(new THREE.GridHelper(10, 15));
  scene.add(new THREE.PointLightHelper(light, 0.5));

  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      euMesh.rotation.y = time * 0.1;
      jupiterMesh.rotation.y = time * 0.15;
      euGroup.rotation.y = time;

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
