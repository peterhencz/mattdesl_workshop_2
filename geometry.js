// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(3, 3, 3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.enableZoom = false;

  // Setup your scene
  const scene = new THREE.Scene();

  // A grid
  // const gridScale = 10;
  // scene.add(
  //   new THREE.GridHelper(gridScale, 10, "hsl(0, 0%, 50%)", "hsl(0, 0%, 70%)")
  // );

  // A custom geometry
  const geometry = new THREE.Geometry();

  geometry.vertices = [
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(0.5, -1, -1),
    new THREE.Vector3(1, 0.5, 1),
    new THREE.Vector3(0.5, 1, -1),
  ];

  geometry.faces = [new THREE.Face3(0, 1, 2), new THREE.Face3(3, 1, 0)];

  geometry.computeVertexNormals();

  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
    })
  );
  group.add(mesh);
  scene.add(group);

  const light = new THREE.PointLight("tomato", 2);

  const light2 = new THREE.PointLight("blue", 1);
  light2.position.set(3, 12, 2);
  scene.add(light2);
  light.position.set(3, 2, 1);
  scene.add(light);

  // scene.add(new THREE.GridHelper(10, 15));
  // scene.add(new THREE.PointLightHelper(light, 0.5));
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      mesh.rotation.y = Math.sin(time * 0.5) * Math.PI;
      mesh.rotation.x = Math.cos(time * 0.5) * Math.PI;
      group.rotation.y = time * 0.5;
      group.rotation.x = time * 0.5;
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
