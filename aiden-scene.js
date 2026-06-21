import * as THREE from './assets/three.module.min.js';

const canvas = document.getElementById('aidenCanvas');
const container = document.getElementById('robotScene');

if (!canvas || !container) {
  throw new Error('AIDEN stage is missing.');
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050609, 0.075);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0.2, 0.7, 8.2);

let renderer;

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
} catch (error) {
  container.classList.add('no-webgl');
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const colors = {
  birth: new THREE.Color('#9f7cff'),
  curiosity: new THREE.Color('#ff9d57'),
  purpose: new THREE.Color('#4ddf92'),
  feeling: new THREE.Color('#ff5b6e'),
  transcend: new THREE.Color('#f4f4f4')
};

const shellMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xb7c2d0,
  metalness: 0.9,
  roughness: 0.16,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  iridescence: 0.24,
  iridescenceIOR: 1.4
});

const shellSecondaryMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x202a3b,
  metalness: 0.94,
  roughness: 0.18,
  clearcoat: 0.82,
  clearcoatRoughness: 0.12
});

const darkMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0a1019,
  metalness: 0.82,
  roughness: 0.18,
  clearcoat: 1
});

const accentMaterial = new THREE.MeshStandardMaterial({
  color: colors.birth,
  emissive: colors.birth,
  emissiveIntensity: 3.4,
  metalness: 0.25,
  roughness: 0.18
});

const accentSoftMaterial = new THREE.MeshBasicMaterial({
  color: colors.birth,
  transparent: true,
  opacity: 0.34,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x111a2b,
  metalness: 0.38,
  roughness: 0.08,
  transmission: 0.15,
  transparent: true,
  opacity: 0.96,
  clearcoat: 1
});

function roundedBoxGeometry(width, height, depth, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: Math.min(radius * 0.45, depth * 0.22),
    bevelThickness: Math.min(radius * 0.45, depth * 0.22),
    curveSegments: 8
  });

  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function mesh(geometry, material, position = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function capsule(radius, length, material) {
  return mesh(new THREE.CapsuleGeometry(radius, length, 8, 18), material);
}

const world = new THREE.Group();
world.scale.setScalar(0.78);
world.position.y = -0.02;
scene.add(world);

const robotFloat = new THREE.Group();
robotFloat.position.y = 0.28;
world.add(robotFloat);

const robot = new THREE.Group();
robot.rotation.y = -0.25;
robot.visible = true;
robotFloat.add(robot);

const abdomen = capsule(0.42, 0.42, darkMaterial);
abdomen.position.set(0, 0.18, 0);
abdomen.scale.set(0.88, 1, 0.64);
robot.add(abdomen);

const torso = capsule(0.78, 0.58, shellMaterial);
torso.position.set(0, 1.04, 0);
torso.scale.set(1.2, 1, 0.58);
robot.add(torso);

const chestArmor = capsule(0.58, 0.42, shellSecondaryMaterial);
chestArmor.position.set(0, 1.22, 0.43);
chestArmor.scale.set(1.34, 0.92, 0.18);
robot.add(chestArmor);

const sternum = mesh(roundedBoxGeometry(0.3, 0.92, 0.1, 0.1), darkMaterial, [0, 1.05, 0.59]);
robot.add(sternum);

const clavicle = mesh(new THREE.TorusGeometry(0.72, 0.055, 12, 48, Math.PI), shellSecondaryMaterial, [0, 1.58, 0.25]);
clavicle.rotation.z = Math.PI;
clavicle.scale.y = 0.34;
robot.add(clavicle);

const collarGlow = mesh(new THREE.TorusGeometry(0.36, 0.018, 10, 40, Math.PI), accentMaterial, [0, 1.82, 0.3]);
collarGlow.rotation.z = Math.PI;
collarGlow.scale.y = 0.42;
robot.add(collarGlow);

const bustHalo = mesh(new THREE.TorusGeometry(1.58, 0.018, 10, 96), accentSoftMaterial, [0, 1.05, -0.76]);
bustHalo.scale.y = 1.12;
robot.add(bustHalo);

for (const side of [-1, 1]) {
  const chestPlate = mesh(roundedBoxGeometry(0.5, 0.82, 0.1, 0.12), shellSecondaryMaterial, [side * 0.52, 1.06, 0.61]);
  chestPlate.rotation.z = side * -0.22;
  robot.add(chestPlate);

  const chestSignal = mesh(roundedBoxGeometry(0.055, 0.48, 0.035, 0.02), accentMaterial, [side * 0.54, 1.08, 0.69]);
  chestSignal.rotation.z = side * -0.22;
  robot.add(chestSignal);
}

const coreHalo = mesh(new THREE.TorusGeometry(0.22, 0.028, 12, 48), accentMaterial, [0, 1.15, 0.68]);
robot.add(coreHalo);

const core = mesh(new THREE.SphereGeometry(0.115, 24, 24), accentMaterial, [0, 1.15, 0.7]);
core.scale.z = 0.42;
robot.add(core);

const coreGlow = mesh(new THREE.SphereGeometry(0.34, 24, 24), accentSoftMaterial, [0, 1.15, 0.67]);
coreGlow.scale.z = 0.15;
robot.add(coreGlow);

for (const side of [-1, 1]) {
  const rib = mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 32, Math.PI * 0.72), darkMaterial, [side * 0.22, 0.82, 0.56]);
  rib.rotation.z = side > 0 ? 2.5 : 0.64;
  rib.scale.y = 0.42;
  robot.add(rib);
}

const pelvis = capsule(0.55, 0.18, shellSecondaryMaterial);
pelvis.position.set(0, -0.36, 0);
pelvis.scale.set(1.12, 0.75, 0.66);
robot.add(pelvis);

const pelvisGuard = mesh(roundedBoxGeometry(0.66, 0.38, 0.12, 0.12), darkMaterial, [0, -0.35, 0.46]);
robot.add(pelvisGuard);

const neck = mesh(new THREE.CylinderGeometry(0.2, 0.29, 0.48, 28), darkMaterial, [0, 2.05, 0]);
robot.add(neck);

for (const side of [-1, 1]) {
  const neckCable = mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 24, Math.PI * 0.58), shellSecondaryMaterial, [side * 0.15, 2.04, 0.02]);
  neckCable.rotation.z = side > 0 ? 2.22 : 0.92;
  neckCable.scale.y = 1.25;
  robot.add(neckCable);
}

const headPivot = new THREE.Group();
headPivot.position.set(0, 2.62, 0);
robot.add(headPivot);

const cranium = mesh(new THREE.SphereGeometry(0.66, 40, 28), shellMaterial);
cranium.scale.set(0.82, 1.05, 0.88);
headPivot.add(cranium);

const facePlate = mesh(new THREE.SphereGeometry(0.585, 36, 24), glassMaterial, [0, 0.01, 0.36]);
facePlate.scale.set(0.73, 0.87, 0.2);
headPivot.add(facePlate);

const brow = mesh(roundedBoxGeometry(0.78, 0.11, 0.08, 0.045), shellSecondaryMaterial, [0, 0.17, 0.57]);
headPivot.add(brow);

const eyes = [];
for (const side of [-1, 1]) {
  const eye = mesh(new THREE.CapsuleGeometry(0.038, 0.2, 6, 14), accentMaterial, [side * 0.19, 0.08, 0.625]);
  eye.rotation.z = Math.PI / 2;
  eye.scale.set(1, 1, 0.35);
  headPivot.add(eye);
  eyes.push(eye);
}

for (const offset of [-0.11, 0, 0.11]) {
  const neuralNode = mesh(new THREE.SphereGeometry(0.022, 12, 10), accentMaterial, [offset, 0.34, 0.57]);
  neuralNode.scale.z = 0.45;
  headPivot.add(neuralNode);
}

const jaw = mesh(roundedBoxGeometry(0.46, 0.24, 0.32, 0.1), shellSecondaryMaterial, [0, -0.44, 0.16]);
headPivot.add(jaw);

const chin = mesh(roundedBoxGeometry(0.2, 0.12, 0.2, 0.05), darkMaterial, [0, -0.56, 0.17]);
headPivot.add(chin);

for (const side of [-1, 1]) {
  const temple = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 28), darkMaterial, [side * 0.56, 0.02, 0]);
  temple.rotation.z = Math.PI / 2;
  headPivot.add(temple);

  const templeGlow = mesh(new THREE.TorusGeometry(0.105, 0.018, 8, 28), accentMaterial, [side * 0.615, 0.02, 0]);
  templeGlow.rotation.y = Math.PI / 2;
  headPivot.add(templeGlow);
}

function buildHand(side) {
  const hand = new THREE.Group();
  const palm = capsule(0.16, 0.18, shellSecondaryMaterial);
  palm.scale.set(0.92, 1, 0.62);
  hand.add(palm);

  for (let index = 0; index < 4; index += 1) {
    const finger = capsule(0.032, 0.18 - index * 0.012, shellMaterial);
    finger.position.set((index - 1.5) * 0.072, -0.25, 0.015);
    finger.rotation.z = (index - 1.5) * -0.025;
    hand.add(finger);
  }

  const thumb = capsule(0.042, 0.14, shellMaterial);
  thumb.position.set(side * 0.19, -0.08, 0.02);
  thumb.rotation.z = side * -0.72;
  hand.add(thumb);
  return hand;
}

function buildArm(side) {
  const shoulder = new THREE.Group();
  shoulder.position.set(side * 1.04, 1.52, 0);
  robot.add(shoulder);

  shoulder.add(mesh(new THREE.SphereGeometry(0.25, 28, 20), darkMaterial));

  const shoulderArmor = mesh(new THREE.SphereGeometry(0.36, 28, 18), shellSecondaryMaterial, [side * 0.055, 0.03, 0]);
  shoulderArmor.scale.set(0.9, 0.72, 1.02);
  shoulder.add(shoulderArmor);

  const upper = capsule(0.18, 0.72, shellMaterial);
  upper.position.y = -0.58;
  upper.scale.set(1, 1, 0.88);
  shoulder.add(upper);

  const upperInset = capsule(0.085, 0.54, darkMaterial);
  upperInset.position.set(0, -0.58, 0.165);
  shoulder.add(upperInset);

  const elbow = new THREE.Group();
  elbow.position.y = -1.12;
  shoulder.add(elbow);

  elbow.add(mesh(new THREE.SphereGeometry(0.2, 24, 18), darkMaterial));
  const elbowCap = mesh(new THREE.TorusGeometry(0.16, 0.035, 10, 28), shellSecondaryMaterial, [0, 0, 0.07]);
  elbow.add(elbowCap);

  const lower = capsule(0.16, 0.72, shellMaterial);
  lower.position.y = -0.57;
  lower.scale.set(0.92, 1, 0.8);
  elbow.add(lower);

  const forearmGuard = capsule(0.12, 0.45, shellSecondaryMaterial);
  forearmGuard.position.set(0, -0.54, 0.15);
  forearmGuard.scale.set(0.88, 1, 0.42);
  elbow.add(forearmGuard);

  const hand = buildHand(side);
  hand.position.set(0, -1.13, 0);
  elbow.add(hand);

  return { shoulder, elbow, hand };
}

const leftArm = buildArm(-1);
const rightArm = buildArm(1);

function buildLeg(side) {
  const hip = new THREE.Group();
  hip.position.set(side * 0.39, -0.52, 0);
  robot.add(hip);

  hip.add(mesh(new THREE.SphereGeometry(0.25, 26, 20), darkMaterial));

  const hipArmor = mesh(new THREE.SphereGeometry(0.34, 28, 20), shellSecondaryMaterial, [side * 0.06, 0.02, 0]);
  hipArmor.scale.set(0.92, 0.72, 0.92);
  hip.add(hipArmor);

  const upper = capsule(0.24, 0.9, shellMaterial);
  upper.position.y = -0.72;
  upper.scale.set(1, 1, 0.86);
  hip.add(upper);

  const thighInset = capsule(0.11, 0.65, darkMaterial);
  thighInset.position.set(0, -0.7, 0.215);
  hip.add(thighInset);

  const knee = new THREE.Group();
  knee.position.y = -1.43;
  hip.add(knee);

  knee.add(mesh(new THREE.SphereGeometry(0.23, 26, 20), darkMaterial));
  const kneeGuard = mesh(roundedBoxGeometry(0.38, 0.34, 0.2, 0.1), shellSecondaryMaterial, [0, -0.02, 0.2]);
  knee.add(kneeGuard);

  const lower = capsule(0.2, 0.88, shellMaterial);
  lower.position.y = -0.72;
  lower.scale.set(0.92, 1, 0.78);
  knee.add(lower);

  const shinGuard = capsule(0.13, 0.62, shellSecondaryMaterial);
  shinGuard.position.set(0, -0.67, 0.19);
  shinGuard.scale.set(0.92, 1, 0.48);
  knee.add(shinGuard);

  const ankle = mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.26, 24), darkMaterial, [0, -1.3, 0]);
  knee.add(ankle);

  const foot = mesh(roundedBoxGeometry(0.46, 0.28, 0.78, 0.12), shellSecondaryMaterial, [0, -1.52, 0.18]);
  foot.rotation.x = -0.04;
  knee.add(foot);

  const sole = mesh(roundedBoxGeometry(0.48, 0.08, 0.82, 0.035), darkMaterial, [0, -1.67, 0.19]);
  knee.add(sole);

  return { hip, knee, foot };
}

const leftLeg = buildLeg(-1);
const rightLeg = buildLeg(1);
leftLeg.hip.visible = false;
rightLeg.hip.visible = false;

const platform = mesh(new THREE.CylinderGeometry(2.65, 2.85, 0.18, 96), darkMaterial, [0, -3.66, 0]);
platform.visible = false;
platform.receiveShadow = true;
world.add(platform);

const platformGlow = mesh(
  new THREE.RingGeometry(1.75, 2.12, 96),
  accentSoftMaterial,
  [0, -3.55, 0]
);
platformGlow.rotation.x = -Math.PI / 2;
platformGlow.visible = false;
world.add(platformGlow);

const orbitMaterials = [];
for (let index = 0; index < 4; index += 1) {
  const material = accentSoftMaterial.clone();
  material.opacity = 0.1 + index * 0.035;
  orbitMaterials.push(material);
  const ring = mesh(new THREE.TorusGeometry(2.2 + index * 0.72, 0.008, 8, 128), material, [0, -3.52 + index * 0.03, 0]);
  ring.rotation.x = Math.PI / 2;
  ring.rotation.y = index * 0.21;
  world.add(ring);
}

const particleCount = 620;
const particlePositions = new Float32Array(particleCount * 3);
for (let index = 0; index < particleCount; index += 1) {
  const radius = 3.4 + Math.random() * 8;
  const angle = Math.random() * Math.PI * 2;
  particlePositions[index * 3] = Math.cos(angle) * radius;
  particlePositions[index * 3 + 1] = (Math.random() - 0.42) * 10;
  particlePositions[index * 3 + 2] = Math.sin(angle) * radius - 2;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: colors.birth,
  size: 0.025,
  transparent: true,
  opacity: 0.58,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

scene.add(new THREE.HemisphereLight(0xdce8ff, 0x050608, 1.25));

const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
keyLight.position.set(-3.5, 6, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const rimLight = new THREE.PointLight(colors.birth, 38, 13, 1.6);
rimLight.position.set(3.2, 1.6, 2.4);
scene.add(rimLight);

const lowerLight = new THREE.PointLight(0x4778ff, 18, 10, 2);
lowerLight.position.set(-2.4, -2.2, 1.5);
scene.add(lowerLight);

const poses = [
  {
    color: colors.birth,
    camera: [-0.62, 1.0, 5.25],
    look: [0, 1.02, 0],
    robotY: -0.04,
    robotRotate: -0.28,
    bodyTilt: 0.03,
    bodyLean: -0.015,
    head: [0.24, 0, -0.06],
    leftShoulder: [0.18, 0, 0.18],
    rightShoulder: [0.18, 0, -0.18],
    leftElbow: -0.1,
    rightElbow: 0.1,
    leftHip: [0.02, 0, 0.025],
    rightHip: [-0.02, 0, -0.025],
    knees: [0.045, 0.045],
    core: 2.8
  },
  {
    color: colors.curiosity,
    camera: [0.72, 1.08, 5.15],
    look: [0, 1.05, 0],
    robotY: 0.08,
    robotRotate: 0.2,
    bodyTilt: -0.025,
    bodyLean: 0.035,
    head: [-0.08, -0.22, 0.12],
    leftShoulder: [-0.05, 0, 0.3],
    rightShoulder: [-0.62, 0.08, -0.62],
    leftElbow: -0.12,
    rightElbow: -1.05,
    leftHip: [-0.03, 0, 0.07],
    rightHip: [0.04, 0, -0.05],
    knees: [0.08, 0.02],
    core: 4.2
  },
  {
    color: colors.purpose,
    camera: [-0.78, 0.92, 4.95],
    look: [0, 1.0, 0],
    robotY: 0.18,
    robotRotate: -0.2,
    bodyTilt: -0.02,
    bodyLean: -0.02,
    head: [-0.04, 0.13, -0.04],
    leftShoulder: [-0.74, 0, 0.75],
    rightShoulder: [-0.74, 0, -0.75],
    leftElbow: -0.62,
    rightElbow: 0.62,
    leftHip: [-0.06, 0, 0.09],
    rightHip: [-0.06, 0, -0.09],
    knees: [0.12, 0.12],
    core: 5.2
  },
  {
    color: colors.feeling,
    camera: [0.78, 1.18, 5.5],
    look: [0, 0.98, 0],
    robotY: -0.2,
    robotRotate: 0.38,
    bodyTilt: 0.13,
    bodyLean: 0.04,
    head: [0.46, -0.08, 0.16],
    leftShoulder: [0.38, 0, 0.12],
    rightShoulder: [0.38, 0, -0.12],
    leftElbow: -0.24,
    rightElbow: 0.24,
    leftHip: [0.08, 0, 0.035],
    rightHip: [0.08, 0, -0.035],
    knees: [0.15, 0.15],
    core: 1.8
  },
  {
    color: colors.transcend,
    camera: [0, 1.1, 4.85],
    look: [0, 1.08, 0],
    robotY: 0.24,
    robotRotate: 0,
    bodyTilt: -0.035,
    bodyLean: 0,
    head: [-0.07, 0, 0],
    leftShoulder: [-0.34, 0, 0.42],
    rightShoulder: [-0.34, 0, -0.42],
    leftElbow: -0.26,
    rightElbow: 0.26,
    leftHip: [-0.03, 0, 0.045],
    rightHip: [-0.03, 0, -0.045],
    knees: [0.04, 0.04],
    core: 5.8
  }
];

let activeIndex = Number.parseInt(document.body.dataset.activeChapter || '0', 10);
let targetColor = poses[activeIndex].color.clone();
let pointerX = 0;
let pointerY = 0;
let pointerTargetX = 0;
let pointerTargetY = 0;
let lastScrollY = window.scrollY;
let scrollEnergy = 0;
let isVisible = true;

function damp(current, target, amount) {
  return THREE.MathUtils.lerp(current, target, amount);
}

function dampRotation(group, values, amount) {
  group.rotation.x = damp(group.rotation.x, values[0], amount);
  group.rotation.y = damp(group.rotation.y, values[1], amount);
  group.rotation.z = damp(group.rotation.z, values[2], amount);
}

function setChapter(index) {
  activeIndex = Math.max(0, Math.min(poses.length - 1, index));
  targetColor.copy(poses[activeIndex].color);
}

window.addEventListener('aiden:chapter', (event) => {
  setChapter(event.detail.index);
});

window.addEventListener('pointermove', (event) => {
  pointerTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
});

document.documentElement.addEventListener('mouseleave', () => {
  pointerTargetX = 0;
  pointerTargetY = 0;
});

window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastScrollY);
  scrollEnergy = Math.min(1, scrollEnergy + delta * 0.0035);
  lastScrollY = window.scrollY;
}, { passive: true });

const visibilityObserver = new IntersectionObserver((entries) => {
  isVisible = entries[0].isIntersecting;
}, { rootMargin: '20% 0px' });
visibilityObserver.observe(container);

function resize() {
  const width = Math.max(container.clientWidth, 1);
  const height = Math.max(container.clientHeight, 1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resize).observe(container);
resize();

const clock = new THREE.Clock();
const lookTarget = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  if (!isVisible && !reducedMotion) {
    return;
  }

  const elapsed = clock.getElapsedTime();
  const pose = poses[activeIndex];
  const smoothing = reducedMotion ? 1 : 0.055;
  const idle = reducedMotion ? 0 : Math.sin(elapsed * 1.15) * 0.045;
  const breath = reducedMotion ? 1 : 1 + Math.sin(elapsed * 1.8) * 0.025;
  const storyProgress = window.aidenStoryProgress || 0;
  const storyActive = document.body.classList.contains('is-story-active');
  const narrowScreenOffset = camera.aspect < 0.75 ? 0.72 : 0;

  pointerX = damp(pointerX, pointerTargetX, 0.04);
  pointerY = damp(pointerY, pointerTargetY, 0.04);
  scrollEnergy = damp(scrollEnergy, 0, 0.04);

  desiredCamera.set(
    (storyActive ? pose.camera[0] : 0.08) + pointerX * 0.2,
    (storyActive ? pose.camera[1] : 1.02) - pointerY * 0.14,
    (storyActive ? pose.camera[2] : 5.18) + narrowScreenOffset + scrollEnergy * 0.22
  );
  camera.position.lerp(desiredCamera, smoothing);
  lookTarget.set(pose.look[0], pose.look[1], pose.look[2]);
  camera.lookAt(lookTarget);

  robot.rotation.y = damp(robot.rotation.y, pose.robotRotate + pointerX * 0.17, smoothing);
  robot.rotation.x = damp(robot.rotation.x, pose.bodyTilt + pointerY * 0.065, smoothing);
  robot.rotation.z = damp(robot.rotation.z, pose.bodyLean - pointerX * 0.018, smoothing);
  robotFloat.position.y = damp(robotFloat.position.y, pose.robotY + idle, smoothing);
  robotFloat.rotation.z = damp(robotFloat.rotation.z, Math.sin(elapsed * 0.55) * 0.012, 0.03);

  dampRotation(headPivot, [
    pose.head[0] + pointerY * 0.28 + Math.sin(elapsed * 0.58) * 0.016,
    pose.head[1] + pointerX * 0.42 + Math.sin(elapsed * 0.43) * 0.032,
    pose.head[2] - pointerX * 0.075
  ], smoothing);
  dampRotation(leftArm.shoulder, [
    pose.leftShoulder[0] + pointerY * 0.07,
    pose.leftShoulder[1] + pointerX * 0.055,
    pose.leftShoulder[2]
  ], smoothing);
  dampRotation(rightArm.shoulder, [
    pose.rightShoulder[0] + pointerY * 0.07,
    pose.rightShoulder[1] + pointerX * 0.055,
    pose.rightShoulder[2]
  ], smoothing);
  leftArm.elbow.rotation.x = damp(leftArm.elbow.rotation.x, pose.leftElbow, smoothing);
  rightArm.elbow.rotation.x = damp(rightArm.elbow.rotation.x, pose.rightElbow, smoothing);
  leftArm.hand.rotation.z = damp(leftArm.hand.rotation.z, pointerX * 0.07, smoothing);
  rightArm.hand.rotation.z = damp(rightArm.hand.rotation.z, pointerX * 0.07, smoothing);

  dampRotation(leftLeg.hip, pose.leftHip, smoothing);
  dampRotation(rightLeg.hip, pose.rightHip, smoothing);
  leftLeg.knee.rotation.x = damp(leftLeg.knee.rotation.x, pose.knees[0], smoothing);
  rightLeg.knee.rotation.x = damp(rightLeg.knee.rotation.x, pose.knees[1], smoothing);
  core.scale.setScalar(damp(core.scale.x, breath, 0.08));
  core.scale.z = 0.42;
  torso.scale.x = damp(torso.scale.x, 1.2 + (breath - 1) * 0.34, 0.06);
  torso.scale.y = damp(torso.scale.y, 1 + (breath - 1) * 0.72, 0.06);
  torso.scale.z = 0.58;

  accentMaterial.color.lerp(targetColor, 0.055);
  accentMaterial.emissive.lerp(targetColor, 0.055);
  accentMaterial.emissiveIntensity = damp(accentMaterial.emissiveIntensity, pose.core + scrollEnergy * 2, 0.05);
  accentSoftMaterial.color.lerp(targetColor, 0.055);
  particleMaterial.color.lerp(targetColor, 0.035);
  orbitMaterials.forEach((material) => material.color.lerp(targetColor, 0.055));
  rimLight.color.lerp(targetColor, 0.055);
  rimLight.intensity = damp(rimLight.intensity, 34 + pose.core * 3.2, 0.04);
  rimLight.position.x = damp(rimLight.position.x, 3.2 + pointerX * 1.4, 0.035);
  rimLight.position.y = damp(rimLight.position.y, 1.6 - pointerY * 0.8, 0.035);

  particles.rotation.y = elapsed * 0.018 + storyProgress * 0.4;
  particles.rotation.x = Math.sin(elapsed * 0.12) * 0.04;
  platformGlow.rotation.z = elapsed * 0.08;
  coreHalo.rotation.z = elapsed * 0.28;
  bustHalo.rotation.z = elapsed * 0.045;
  collarGlow.rotation.z = Math.PI + Math.sin(elapsed * 0.9) * 0.08;
  collarGlow.scale.y = 0.42 + Math.sin(elapsed * 1.8) * 0.025;
  eyes.forEach((eye, index) => {
    eye.scale.y = 0.62 + Math.sin(elapsed * 1.7 + index * 0.2) * 0.035;
    eye.position.x = (index === 0 ? -0.19 : 0.19) + pointerX * 0.025;
    eye.position.y = 0.08 - pointerY * 0.018;
  });

  renderer.render(scene, camera);
}

setChapter(activeIndex);
container.classList.add('is-webgl-ready');
animate();
