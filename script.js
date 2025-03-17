// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212); // Dark background color

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Responsive canvas
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Camera position
camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add a point light for more dramatic lighting
const pointLight = new THREE.PointLight(0x64ffda, 1, 100);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// Particles background
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0x64ffda,
  transparent: true,
  opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 3D objects - Project showcases
const projectsGroup = new THREE.Group();
scene.add(projectsGroup);

// Function to create a project cube
function createProjectCube(position, color) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.7,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.2, // Adds a glow effect
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);

  // Add subtle animation
  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;

  projectsGroup.add(cube);
  return cube;
}

// Create project showcases
const project1 = createProjectCube({ x: -3, y: 0, z: 0 }, 0x64ffda);
const project2 = createProjectCube({ x: 0, y: 0, z: -2 }, 0xff6464);
const project3 = createProjectCube({ x: 3, y: 0, z: 0 }, 0x6464ff);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
});

// Scroll interaction
let scrollY = 0;
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  // Detect scroll direction
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    // Scrolling down
    projectsGroup.position.y = -scrollY * 0.001;
  } else {
    // Scrolling up
    projectsGroup.position.y = -scrollY * 0.001;
  }
  lastScrollTop = st <= 0 ? 0 : st;

  // Header animation - shrink on scroll
  const header = document.querySelector("header");
  if (scrollY > 100) {
    header.style.padding = "10px 40px";
  } else {
    header.style.padding = "20px 40px";
  }

  // Parallax effect for 3D elements
  particlesMesh.position.y = -scrollY * 0.0005;

  // Adjust camera based on scroll position
  camera.position.y = -scrollY * 0.001;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smooth camera movement following mouse
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  camera.position.x += (targetX - camera.position.x) * 0.05;
  // Y position is now handled by scroll
  camera.lookAt(scene.position);

  // Animate project cubes
  project1.rotation.x += 0.005;
  project1.rotation.y += 0.01;

  project2.rotation.x += 0.01;
  project2.rotation.z += 0.008;

  project3.rotation.y += 0.01;
  project3.rotation.z += 0.005;

  // Rotate entire project group slowly
  projectsGroup.rotation.y += 0.003;

  // Animate particles
  particlesMesh.rotation.y += 0.0005;

  // Animate point light
  pointLight.intensity = 1 + Math.sin(Date.now() * 0.001) * 0.5;

  renderer.render(scene, camera);
}

// Initialize scroll position
window.scrollTo(0, 0);

animate();
