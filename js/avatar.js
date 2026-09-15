// =====================================================================
// Jeanne en 3D : chargement de l'avatar et animations (respiration,
// mouvements de tête, clignements, salut de la main, lèvres).
// Formats acceptés :
//   - .vrm (VRoid Studio)
//   - .glb Avaturn (type T2 pour l'animation du visage) ou squelette Mixamo
// =====================================================================
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";

const FRAMING = {
  // Hauteur visible (en mètres) autour de la tête, et décalage vertical du cadre.
  hero: { height: 1.05, lift: -0.42 },
  docked: { height: 0.52, lift: -0.12 }
};

const WAVE_SECONDS = 2.6;
const GLANCE_SECONDS = 2.8;
// « Bonjour » en langue des signes française : main plate, bout des doigts
// près du menton, paume vers soi, puis la main part vers l'avant et vers le bas.
// L'expression du visage (sourire) fait partie du signe.
const SIGN_SECONDS = 3.4;

// Positions clés réglées à l'écran (rotations des os du bras droit, en radians).
// « bonjour » : main plate près du menton, paume vers le visage, puis vers l'avant et le bas.
// « merci » : main plate qui part des lèvres et avance vers l'interlocuteur, paume vers le haut,
// avec un léger hochement de tête.
const SIGNS = {
  bonjour: {
    nod: 0,
    stops: [
      { at: 0, upperZ: null, upperX: 0, upperY: 0, lowerZ: 0.12, lowerY: 0 },
      { at: 0.75, upperZ: 1.3, upperX: -0.15, upperY: 1.05, lowerZ: -1.95, lowerY: -1.4 },
      { at: 1.15, upperZ: 1.32, upperX: -0.18, upperY: 1.05, lowerZ: -1.98, lowerY: -1.4 },
      { at: 2.1, upperZ: 1.0, upperX: -0.8, upperY: 0.6, lowerZ: -1.0, lowerY: 0.4 },
      { at: SIGN_SECONDS, upperZ: null, upperX: 0, upperY: 0, lowerZ: 0.12, lowerY: 0 }
    ]
  },
  merci: {
    nod: 0.12,
    stops: [
      { at: 0, upperZ: null, upperX: 0, upperY: 0, lowerZ: 0.12, lowerY: 0 },
      { at: 0.7, upperZ: 1.25, upperX: -0.2, upperY: 1.15, lowerZ: -2.15, lowerY: -1.2 },
      { at: 1.0, upperZ: 1.25, upperX: -0.22, upperY: 1.15, lowerZ: -2.18, lowerY: -1.2 },
      { at: 2.0, upperZ: 0.95, upperX: -0.95, upperY: 0.5, lowerZ: -0.85, lowerY: 0.9 },
      { at: SIGN_SECONDS, upperZ: null, upperX: 0, upperY: 0, lowerZ: 0.12, lowerY: 0 }
    ]
  }
};
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

export async function createAvatar(canvas, url, options = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 20);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(0.8, 1.6, 2.2);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.9));

  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  const gltf = await loader.loadAsync(url);

  let rig;
  if (gltf.userData.vrm) {
    rig = createVrmRig(gltf);
    if (options.look) applyLook(rig.root, options.look);
  } else {
    // Rendu réaliste (peau, tissus) pour les avatars .glb.
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.15;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 1.15;
    key.intensity = 2.2;
    // Lumière d'appoint froide côté opposé : évite les teintes verdâtres
    // sur les cheveux et adoucit les ombres du visage.
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.9);
    fill.position.set(-1.2, 0.8, 1.4);
    scene.add(fill);
    rig = createGlbRig(gltf);
  }
  scene.add(rig.root);
  if (options.shirtLogo) addShirtLogo(rig, options.shirtLogo).catch(() => { /* logo facultatif */ });

  const headWorld = rig.headWorld;
  let framing = "hero";
  let reduced = !!options.reducedMotion;

  // zoom : 1 = cadrage normal, > 1 = caméra reculée (pour voir les mains pendant un signe).
  let zoom = 1;

  function placeCamera() {
    const f = FRAMING[framing];
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    // Garantit que la largeur des épaules (≈ 0,5 m) reste visible sur un cadre étroit.
    const visible = Math.max(f.height, 0.52 / camera.aspect) * zoom;
    const dist = visible / 2 / Math.tan(vFov / 2);
    const y = headWorld.y + f.lift * (visible / f.height) * 0.5;
    camera.position.set(headWorld.x, y + 0.02, headWorld.z + dist);
    camera.lookAt(headWorld.x, y, headWorld.z);
    camera.updateProjectionMatrix();
    lookBase.copy(camera.position);
  }

  function frame() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    placeCamera();
  }
  const lookBase = new THREE.Vector3();
  const lookPoint = new THREE.Vector3();
  const observer = new ResizeObserver(frame);
  observer.observe(canvas);
  frame();

  // --- État d'animation ---
  const timer = new THREE.Timer();
  let speaking = false;
  let mouth = 0;
  let mouthKick = 0;
  let vowel = "aa";
  let nextBlink = 1.5;
  let blinkStart = -1;
  let waveStart = -10;
  let glanceStart = -10;
  let signStart = -10;
  let signName = "bonjour";
  let override = null; // réglage manuel du bras droit (mise au point des signes)
  let happy = 0;
  let happyTarget = 0.25;
  // Volume du son quand la voix neuronale parle (null = bouche animée toute seule).
  let level = null;

  function tick() {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();
    const amp = reduced ? 0.35 : 1;

    const w = t - waveStart;
    const waveProgress = !reduced && w >= 0 && w < WAVE_SECONDS ? w : -1;
    const s = t - signStart;
    const signProgress = s >= 0 && s < SIGN_SECONDS ? s : -1;
    const sign = signProgress >= 0 ? { name: signName, at: signProgress } : null;
    // Regard vers le plan (à droite de l'écran) : montée rapide, maintien, retour doux.
    const g = t - glanceStart;
    const glanceRaw = g < 0 || g > GLANCE_SECONDS ? 0 : Math.min(1, g / 0.35, (GLANCE_SECONDS - g) / 0.6);
    const glance = glanceRaw * glanceRaw * (3 - 2 * glanceRaw) * (reduced ? 0.5 : 1);
    // Pendant le signe, la caméra recule pour montrer la main.
    const targetZoom = sign || override ? 1.7 : 1;
    if (Math.abs(zoom - targetZoom) > 0.002) {
      zoom = THREE.MathUtils.lerp(zoom, targetZoom, 1 - Math.exp(-dt * 3.5));
      placeCamera();
    }
    rig.pose({ t, amp, speaking, wave: waveProgress, glance, sign, override });
    rig.lookAt(lookPoint.copy(lookBase).addScaledVector(X, glance * 1.6));

    if (t > nextBlink && blinkStart < 0) blinkStart = t;
    let blink = 0;
    if (blinkStart >= 0) {
      const b = (t - blinkStart) / 0.16;
      blink = b < 0.5 ? b * 2 : Math.max(0, 2 - b * 2);
      if (b >= 1) { blinkStart = -1; nextBlink = t + 2.2 + Math.random() * 3.2; }
    }

    mouthKick = Math.max(0, mouthKick - dt * 5);
    const target = level !== null ? Math.min(0.85, level * 0.95) : speaking ? 0.18 + 0.5 * Math.abs(Math.sin(t * 17)) * (0.6 + 0.4 * Math.sin(t * 5.3)) + mouthKick * 0.3 : 0;
    mouth = THREE.MathUtils.lerp(mouth, Math.min(target, 0.85), 1 - Math.exp(-dt * 22));
    happy = THREE.MathUtils.lerp(happy, happyTarget, 1 - Math.exp(-dt * 3));

    rig.face({ blink, mouth, vowel, happy });
    rig.update(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  let raf = requestAnimationFrame(tick);

  return {
    setSpeaking(on) {
      speaking = on;
      happyTarget = on ? 0.18 : 0.25;
    },
    setLevel(value) {
      level = value;
    },
    pulse() {
      mouthKick = 1;
      vowel = ["aa", "oh", "ee", "aa"][Math.floor(Math.random() * 4)];
    },
    glance() {
      glanceStart = timer.getElapsed();
    },
    // Signe en langue des signes française (avatars VRM uniquement).
    // Renvoie la durée du geste en millisecondes, ou 0 si l'avatar ne peut pas signer.
    sign(name = "bonjour") {
      if (!rig.canSign || !SIGNS[name]) return 0;
      signName = name;
      signStart = timer.getElapsed();
      happyTarget = 0.55;
      setTimeout(() => { happyTarget = 0.25; }, SIGN_SECONDS * 1000);
      return SIGN_SECONDS * 1000;
    },
    wave() {
      waveStart = timer.getElapsed();
      happyTarget = 0.45;
      setTimeout(() => { happyTarget = 0.25; }, WAVE_SECONDS * 1000);
    },
    setFraming(mode) {
      framing = mode;
      frame();
    },
    setReducedMotion(on) { reduced = on; },
    // Mise au point des gestes (borne ouverte avec ?debug).
    setOverride(values) { override = values; },
    debugState() {
      const r = (b) => b ? [b.rotation.x, b.rotation.y, b.rotation.z].map((v) => Math.round(v * 100) / 100) : null;
      return {
        morphs: rig.readMorphs ? rig.readMorphs(["jawOpen", "eyeBlinkLeft", "mouthSmileLeft", "mouthPucker"]) : null,
        sign: signName,
        signProgress: Math.round((timer.getElapsed() - signStart) * 100) / 100,
        canSign: rig.canSign,
        upperArm: r(rig.bones && (rig.bones.rUpperArm || rig.bones.rArm)),
        lowerArm: r(rig.bones && (rig.bones.rLowerArm || rig.bones.rFore))
      };
    },
    refresh: frame,
    dispose() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.dispose();
    }
  };
}

const waveEase = (w) => {
  const inOut = Math.min(1, w / 0.45, (WAVE_SECONDS - w) / 0.45);
  return inOut * inOut * (3 - 2 * inOut);
};

// =====================================================================
// Avatar VRM (VRoid Studio)
// =====================================================================
function createVrmRig(gltf) {
  const vrm = gltf.userData.vrm;
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  if (VRMUtils.combineSkeletons) VRMUtils.combineSkeletons(gltf.scene);
  VRMUtils.rotateVRM0(vrm);
  vrm.scene.traverse((obj) => { obj.frustumCulled = false; });

  const bone = (name) => vrm.humanoid.getNormalizedBoneNode(name);
  const bones = {
    spine: bone("spine"), chest: bone("chest") || bone("upperChest"), neck: bone("neck"),
    lUpperArm: bone("leftUpperArm"), rUpperArm: bone("rightUpperArm"),
    lLowerArm: bone("leftLowerArm"), rLowerArm: bone("rightLowerArm"), rHand: bone("rightHand")
  };
  const ARM = 1.4;

  const rest = () => {
    if (bones.lUpperArm) bones.lUpperArm.rotation.set(0, 0, -ARM);
    if (bones.rUpperArm) bones.rUpperArm.rotation.set(0, 0, ARM);
    if (bones.lLowerArm) bones.lLowerArm.rotation.set(0, 0, -0.12);
    if (bones.rLowerArm) bones.rLowerArm.rotation.set(0, 0, 0.12);
    if (bones.rHand) bones.rHand.rotation.set(0, 0, 0);
  };
  rest();
  vrm.update(0);

  const headWorld = new THREE.Vector3();
  vrm.humanoid.getRawBoneNode("head").getWorldPosition(headWorld);

  const lookTarget = new THREE.Object3D();
  vrm.scene.add(lookTarget);
  if (vrm.lookAt) vrm.lookAt.target = lookTarget;

  const em = vrm.expressionManager;
  const setExpr = (name, value) => { if (em && em.getExpression(name)) em.setValue(name, value); };

  const raw = (name) => vrm.humanoid.getRawBoneNode(name);
  const meshes = [];
  vrm.scene.traverse((obj) => { if (obj.isMesh) meshes.push(obj); });

  return {
    root: vrm.scene,
    bones,
    anchor: { chest: raw("upperChest") || raw("chest"), neck: raw("neck") },
    meshes,
    headWorld,
    lookAt(position) { lookTarget.position.copy(position); },
    canSign: true,
    pose({ t, amp, speaking, wave, glance = 0, sign = null, override = null }) {
      rest();
      if (override) {
        const o = override;
        bones.rUpperArm.rotation.set(o.upperX || 0, o.upperY || 0, o.upperZ ?? ARM);
        bones.rLowerArm.rotation.set(o.lowerX || 0, o.lowerY || 0, o.lowerZ ?? 0.12);
        if (bones.rHand) bones.rHand.rotation.set(o.handX || 0, o.handY || 0, o.handZ || 0);
        return;
      }
      const breath = Math.sin(t * 1.55);
      if (bones.spine) bones.spine.rotation.set(breath * 0.012 * amp, Math.sin(t * 0.21) * 0.03 * amp + glance * 0.12, 0);
      if (bones.chest) bones.chest.rotation.set(breath * 0.018 * amp, 0, Math.sin(t * 0.33) * 0.012 * amp);
      if (bones.neck) bones.neck.rotation.set(
        (Math.sin(t * 0.47) * 0.03 + (speaking ? Math.sin(t * 3.1) * 0.012 : 0)) * amp,
        (Math.sin(t * 0.31) * 0.07 + Math.sin(t * 0.87) * 0.02) * amp * (1 - glance) + glance * 0.45,
        Math.sin(t * 0.27) * 0.03 * amp
      );
      if (bones.lUpperArm) bones.lUpperArm.rotation.z = -ARM + breath * 0.012 * amp;
      if (bones.rUpperArm) bones.rUpperArm.rotation.z = ARM - breath * 0.012 * amp;

      if (sign && bones.rUpperArm && bones.rLowerArm) {
        const { stops, nod } = SIGNS[sign.name];
        let k = 1;
        while (k < stops.length - 1 && sign.at > stops[k].at) k++;
        const from = stops[k - 1];
        const to = stops[k];
        const raw = Math.min(1, Math.max(0, (sign.at - from.at) / (to.at - from.at)));
        const e = raw * raw * (3 - 2 * raw);
        const mix = (a, b) => THREE.MathUtils.lerp(a === null ? ARM : a, b === null ? ARM : b, e);
        bones.rUpperArm.rotation.set(mix(from.upperX, to.upperX), mix(from.upperY, to.upperY), mix(from.upperZ, to.upperZ));
        bones.rLowerArm.rotation.set(0, mix(from.lowerY, to.lowerY), mix(from.lowerZ, to.lowerZ));
        // Hochement de tête (le visage fait partie du signe).
        if (nod && bones.neck) bones.neck.rotation.x += nod * Math.sin(Math.min(1, sign.at / SIGN_SECONDS) * Math.PI);
      } else if (wave >= 0 && bones.rUpperArm && bones.rLowerArm) {
        const ease = waveEase(wave);
        bones.rUpperArm.rotation.z = THREE.MathUtils.lerp(ARM, 0.95, ease);
        bones.rUpperArm.rotation.x = THREE.MathUtils.lerp(0, -0.35, ease);
        bones.rLowerArm.rotation.z = THREE.MathUtils.lerp(0.12, 2.25, ease);
        bones.rLowerArm.rotation.y = Math.sin(wave * 10) * 0.28 * ease;
        if (bones.rHand) bones.rHand.rotation.z = Math.sin(wave * 10 + 0.6) * 0.2 * ease;
      }
    },
    face({ blink, mouth, vowel, happy }) {
      setExpr("blink", blink);
      for (const v of ["aa", "oh", "ee"]) setExpr(v, v === vowel ? mouth : 0);
      setExpr("happy", happy);
    },
    update(dt) { vrm.update(dt); }
  };
}

// Signes pour les avatars .glb : direction du bras et de l'avant-bras
// dans l'espace du monde (le personnage fait face à la caméra, +Z).
const GLB_SIGNS = {
  bonjour: {
    nod: 0,
    stops: [
      { at: 0, arm: null, fore: null },
      { at: 0.75, arm: [-0.30, -0.80, 0.30], fore: [0.30, 0.85, 0.42] },
      { at: 1.15, arm: [-0.32, -0.80, 0.32], fore: [0.32, 0.84, 0.44] },
      { at: 2.1, arm: [-0.45, -0.75, 0.45], fore: [0.10, 0.25, 0.96] },
      { at: SIGN_SECONDS, arm: null, fore: null }
    ]
  },
  merci: {
    nod: 0.12,
    stops: [
      { at: 0, arm: null, fore: null },
      { at: 0.7, arm: [-0.26, -0.85, 0.28], fore: [0.34, 0.80, 0.50] },
      { at: 1.0, arm: [-0.28, -0.85, 0.30], fore: [0.34, 0.78, 0.52] },
      { at: 2.0, arm: [-0.42, -0.70, 0.55], fore: [0.05, 0.10, 0.99] },
      { at: SIGN_SECONDS, arm: null, fore: null }
    ]
  }
};

// =====================================================================
// Avatar GLB (Avaturn, MetaPerson, squelette de type Mixamo)
// Les rotations sont calculées dans l'espace du monde : elles ne dépendent
// pas de l'orientation propre à chaque os.
// =====================================================================
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _q3 = new THREE.Quaternion();

function rotateWorld(bone, axis, angle) {
  if (!bone || !angle) return;
  bone.parent.getWorldQuaternion(_q1);
  _q2.setFromAxisAngle(axis, angle);
  _q3.copy(_q1).invert().multiply(_q2).multiply(_q1);
  bone.quaternion.premultiply(_q3);
  bone.updateMatrixWorld(true);
}

// Rotation locale qui oriente l'os (vers son enfant) dans la direction voulue.
function aimQuaternion(bone, child, direction, out) {
  bone.updateMatrixWorld(true);
  const from = child.getWorldPosition(_v2).sub(bone.getWorldPosition(_v1)).normalize();
  _q2.setFromUnitVectors(from, _v3.copy(direction).normalize());
  bone.parent.getWorldQuaternion(_q1);
  return out.copy(_q1).invert().multiply(_q2).multiply(_q1).multiply(bone.quaternion);
}

function createGlbRig(gltf) {
  const root = gltf.scene;
  const find = (name) => root.getObjectByName(name) || root.getObjectByName("mixamorig" + name) || root.getObjectByName("mixamorig:" + name);
  const bones = {
    hips: find("Hips"),
    spine: find("Spine1") || find("Spine"), chest: find("Spine2") || find("Spine1"), neck: find("Neck"), head: find("Head"),
    lShoulder: find("LeftShoulder"), rShoulder: find("RightShoulder"),
    lArm: find("LeftArm"), lFore: find("LeftForeArm"), lHand: find("LeftHand"),
    rArm: find("RightArm"), rFore: find("RightForeArm"), rHand: find("RightHand"),
    lEye: find("LeftEye"), rEye: find("RightEye")
  };
  // Premières phalanges : elles suffisent à faire vivre les mains.
  const fingers = ["Index1", "Middle1", "Ring1", "Pinky1", "Thumb1"]
    .flatMap((f) => [find("LeftHand" + f), find("RightHand" + f)])
    .filter(Boolean);
  if (!bones.head || !bones.neck) throw new Error("Squelette de l'avatar non reconnu.");

  const meshes = [];
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.frustumCulled = false;
    meshes.push(obj);
  });
  root.updateMatrixWorld(true);

  // Face à la caméra : le bras gauche du personnage doit être à droite de l'écran (+X).
  if (bones.lArm && bones.rArm && bones.lArm.getWorldPosition(_v1).x < bones.rArm.getWorldPosition(_v2).x) {
    root.rotation.y = Math.PI;
    root.updateMatrixWorld(true);
  }

  // Pose de repos : bras le long du corps, avant-bras légèrement en avant.
  const q = new THREE.Quaternion();
  const arm = (upper, fore, hand, side) => {
    if (!upper || !fore || !hand) return;
    upper.quaternion.copy(aimQuaternion(upper, fore, new THREE.Vector3(0.16 * side, -1, 0.04), q));
    upper.updateMatrixWorld(true);
    fore.quaternion.copy(aimQuaternion(fore, hand, new THREE.Vector3(0.08 * side, -1, 0.14), q));
    fore.updateMatrixWorld(true);
  };
  arm(bones.lArm, bones.lFore, bones.lHand, 1);
  arm(bones.rArm, bones.rFore, bones.rHand, -1);

  const animated = [...Object.values(bones).filter(Boolean), ...fingers];
  const rest = new Map(animated.map((b) => [b, b.quaternion.clone()]));
  const restore = () => { for (const [b, quat] of rest) b.quaternion.copy(quat); root.updateMatrixWorld(true); };

  // Centre du visage : entre l'os de la tête et le haut du crâne (boîte englobante des maillages).
  const headWorld = bones.head.getWorldPosition(new THREE.Vector3());
  const bounds = new THREE.Box3();
  for (const m of meshes) bounds.expandByObject(m, true);
  if (Number.isFinite(bounds.max.y) && bounds.max.y > headWorld.y) headWorld.y = (headWorld.y + bounds.max.y) / 2;

  // Visage : formes ARKit / visèmes des avatars Avaturn T2 (ignorées si absentes).
  const morphMeshes = meshes.filter((m) => m.morphTargetDictionary && m.morphTargetInfluences);
  const setMorph = (name, value) => {
    for (const m of morphMeshes) {
      const index = m.morphTargetDictionary[name];
      if (index !== undefined) m.morphTargetInfluences[index] = value;
    }
  };
  const VISEMES = { aa: "viseme_aa", oh: "viseme_O", ee: "viseme_E" };
  // Lecture des formes du visage (mise au point avec ?debug).
  const readMorphs = (names) => Object.fromEntries(names.map((name) => {
    for (const m of morphMeshes) {
      const index = m.morphTargetDictionary[name];
      if (index !== undefined) return [name, Math.round(m.morphTargetInfluences[index] * 100) / 100];
    }
    return [name, null];
  }));

  const aimed = new THREE.Quaternion();
  const gaze = { x: 0, y: 0, cx: 0, cy: 0, until: 0 };
  return {
    root,
    readMorphs,
    anchor: { chest: bones.chest, neck: bones.neck },
    meshes,
    headWorld,
    lookAt() { /* regard fixe vers l'avant : l'avatar fait face à la caméra */ },
    canSign: true,
    pose({ t, amp, speaking, wave, glance = 0, sign = null }) {
      restore();
      const breath = Math.sin(t * 1.55);
      // Appui sur une jambe puis sur l'autre, très lent : c'est ce qui enlève
      // l'effet mannequin. Le buste compense en sens inverse.
      const sway = Math.sin(t * 0.33);
      const sway2 = Math.sin(t * 0.21 + 1.1);
      rotateWorld(bones.hips, Z, sway * 0.035 * amp);
      rotateWorld(bones.hips, Y, sway2 * 0.03 * amp);
      rotateWorld(bones.spine, Z, -sway * 0.02 * amp);
      rotateWorld(bones.spine, X, breath * 0.01 * amp);
      rotateWorld(bones.spine, Y, Math.sin(t * 0.21) * 0.025 * amp + glance * 0.12);
      // Épaules : respiration et balancement
      rotateWorld(bones.lShoulder, Z, (breath * 0.02 + sway * 0.015) * amp);
      rotateWorld(bones.rShoulder, Z, (-breath * 0.02 + sway * 0.015) * amp);
      // Bras et avant-bras : oscillations lentes et désynchronisées
      rotateWorld(bones.lArm, X, Math.sin(t * 0.47) * 0.05 * amp);
      rotateWorld(bones.lArm, Z, (sway * 0.05 + 0.02) * amp);
      rotateWorld(bones.rArm, X, Math.sin(t * 0.41 + 2.1) * 0.05 * amp);
      rotateWorld(bones.rArm, Z, (sway * 0.05 - 0.02) * amp);
      rotateWorld(bones.lFore, X, Math.sin(t * 0.63 + 0.7) * 0.04 * amp);
      rotateWorld(bones.rFore, X, Math.sin(t * 0.57 + 1.9) * 0.04 * amp);
      rotateWorld(bones.lHand, Z, Math.sin(t * 0.8) * 0.05 * amp);
      rotateWorld(bones.rHand, Z, Math.sin(t * 0.73 + 1.2) * 0.05 * amp);
      // Mains : les doigts se referment et se relâchent doucement
      fingers.forEach((f, i) => rotateWorld(f, Z, (0.05 + Math.sin(t * 0.6 + i * 0.7) * 0.05) * amp));
      rotateWorld(bones.chest, Z, Math.sin(t * 0.33) * 0.01 * amp);
      rotateWorld(bones.neck, X, (Math.sin(t * 0.47) * 0.03 + (speaking ? Math.sin(t * 3.1) * 0.015 : 0)) * amp);
      rotateWorld(bones.neck, Y, (Math.sin(t * 0.31) * 0.07 + Math.sin(t * 0.87) * 0.02) * amp * (1 - glance) + glance * 0.45);
      rotateWorld(bones.neck, Z, Math.sin(t * 0.27) * 0.03 * amp);
      // Regard : petites saccades, comme quelqu'un qui observe la pièce
      if (t > gaze.until) {
        gaze.until = t + 1.2 + Math.random() * 2.6;
        gaze.x = (Math.random() - 0.5) * 0.28;
        gaze.y = (Math.random() - 0.5) * 0.14;
      }
      gaze.cx += (gaze.x - gaze.cx) * 0.12;
      gaze.cy += (gaze.y - gaze.cy) * 0.12;
      rotateWorld(bones.lEye, Y, gaze.cx + glance * 0.35);
      rotateWorld(bones.rEye, Y, gaze.cx + glance * 0.35);
      rotateWorld(bones.lEye, X, gaze.cy);
      rotateWorld(bones.rEye, X, gaze.cy);

      if (sign && GLB_SIGNS[sign.name] && bones.rArm && bones.rFore && bones.rHand) {
        const { stops, nod } = GLB_SIGNS[sign.name];
        let k = 1;
        while (k < stops.length - 1 && sign.at > stops[k].at) k++;
        const from = stops[k - 1];
        const to = stops[k];
        const raw = Math.min(1, Math.max(0, (sign.at - from.at) / (to.at - from.at)));
        const e = raw * raw * (3 - 2 * raw);
        // Direction de repos du bras droit, quand une étape ne la précise pas.
        const restArm = [-0.16, -1, 0.04];
        const restFore = [-0.08, -1, 0.14];
        const mixDir = (a, b, fallbackA, fallbackB) => {
          const x = a || fallbackA;
          const y = b || fallbackB;
          return new THREE.Vector3(
            THREE.MathUtils.lerp(x[0], y[0], e),
            THREE.MathUtils.lerp(x[1], y[1], e),
            THREE.MathUtils.lerp(x[2], y[2], e)
          );
        };
        aimQuaternion(bones.rArm, bones.rFore, mixDir(from.arm, to.arm, restArm, restArm), aimed);
        bones.rArm.quaternion.copy(aimed);
        bones.rArm.updateMatrixWorld(true);
        aimQuaternion(bones.rFore, bones.rHand, mixDir(from.fore, to.fore, restFore, restFore), aimed);
        bones.rFore.quaternion.copy(aimed);
        bones.rFore.updateMatrixWorld(true);
        if (nod && bones.neck) rotateWorld(bones.neck, X, nod * Math.sin(Math.min(1, sign.at / SIGN_SECONDS) * Math.PI));
      } else if (wave >= 0 && bones.rArm && bones.rFore && bones.rHand) {
        const ease = waveEase(wave);
        aimQuaternion(bones.rArm, bones.rFore, new THREE.Vector3(-0.8, -0.45, 0.35), aimed);
        bones.rArm.quaternion.slerp(aimed, ease);
        bones.rArm.updateMatrixWorld(true);
        aimQuaternion(bones.rFore, bones.rHand, new THREE.Vector3(-0.2 + Math.sin(wave * 10) * 0.35, 1, 0.3), aimed);
        bones.rFore.quaternion.slerp(aimed, ease);
        bones.rFore.updateMatrixWorld(true);
      }
    },
    face({ blink, mouth, vowel, happy }) {
      setMorph("eyeBlinkLeft", blink);
      setMorph("eyeBlinkRight", blink);
      // Bouche : ouverture de la mâchoire, plus une forme selon la voyelle.
      setMorph("jawOpen", Math.min(0.8, mouth * 1.35));
      setMorph("mouthPucker", vowel === "oh" ? mouth * 0.6 : 0);
      setMorph("mouthFunnel", vowel === "oh" ? mouth * 0.3 : 0);
      const smile = happy * 0.6 + (vowel === "ee" ? mouth * 0.35 : 0);
      setMorph("mouthSmileLeft", Math.min(1, smile));
      setMorph("mouthSmileRight", Math.min(1, smile));
      // Visèmes payants : utilisés s'ils existent, ignorés sinon.
      for (const [key, name] of Object.entries(VISEMES)) setMorph(name, key === vowel ? mouth : 0);
    },
    update() { /* pas de physique à mettre à jour */ }
  };
}

// =====================================================================
// Logo Fnac imprimé sur le T-shirt (avatars .glb)
// =====================================================================
async function addShirtLogo(rig, logoUrl) {
  const { anchor, meshes, root } = rig;
  const chest = anchor.chest;
  if (!chest || !anchor.neck) return;

  const image = new Image();
  image.src = logoUrl;
  await image.decode();
  const size = 512;
  const ratio = 515 / 499;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round(size * ratio);
  const ctx = canvas.getContext("2d");
  // Le fichier du logo est un carré jaune aux lettres évidées : un fond noir fait apparaître « fnac ».
  const inset = size * 0.06;
  ctx.fillStyle = "#121212";
  ctx.fillRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  root.updateMatrixWorld(true);
  const chestPos = chest.getWorldPosition(new THREE.Vector3());
  const neckPos = anchor.neck.getWorldPosition(new THREE.Vector3());
  const y = chestPos.y + (neckPos.y - chestPos.y) * 0.3;

  // Cherche la surface du vêtement devant la poitrine.
  const clothes = meshes.filter((m) => /look|top|shirt|cloth|outfit/i.test(m.name + " " + (m.material && m.material.name)));
  const targets = clothes.length ? clothes : meshes;
  const raycaster = new THREE.Raycaster(new THREE.Vector3(chestPos.x, y, chestPos.z + 1), new THREE.Vector3(0, 0, -1));
  const hit = raycaster.intersectObjects(targets, false)[0];
  const point = hit ? hit.point : new THREE.Vector3(chestPos.x, y, chestPos.z + 0.13);
  const normal = hit && hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 0, 1);
  if (normal.z < 0.3) normal.set(0, 0, 1);

  const width = 0.07;
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, width * ratio),
    new THREE.MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false })
  );
  logo.name = "fnac-logo";
  logo.position.copy(point).addScaledVector(normal, 0.006);
  logo.lookAt(_v1.copy(logo.position).add(normal));
  logo.renderOrder = 2;
  root.add(logo);
  chest.attach(logo);
}

// =====================================================================
// Retouches de couleur d'un avatar VRM (cheveux, sourcils, iris)
// Les zones sont reconnues par le nom des matériaux VRoid (…_HAIR, FaceBrow…, EyeIris…).
// Les nuances d'origine (reflets, ombres) sont conservées : seule la teinte change.
// =====================================================================
// gamma < 1 : éclaircit l'ensemble (utile quand la texture d'origine est foncée).
const PALETTES = {
  golden: { gamma: 0.55, stops: [[0, "#8A5E22"], [0.35, "#C99845"], [0.7, "#E9C77A"], [1, "#FCEEC6"]] },
  goldenBrow: { gamma: 0.8, stops: [[0, "#6B4A1E"], [1, "#B98C4C"]] },
  blue: { gamma: 1, stops: [[0, "#0B2240"], [0.5, "#2C69AE"], [1, "#B3D8F5"]] }
};

function applyLook(root, look) {
  const cache = new Map();
  const rules = [];
  if (look.hair) {
    rules.push({ test: /_HAIR/i, palette: PALETTES[look.hair] });
    rules.push({ test: /FaceBrow/i, palette: PALETTES[look.hair + "Brow"] || PALETTES[look.hair] });
  }
  if (look.eyes) rules.push({ test: /EyeIris/i, palette: PALETTES[look.eyes] });

  root.traverse((obj) => {
    if (!obj.isMesh) return;
    for (const material of Array.isArray(obj.material) ? obj.material : [obj.material]) {
      const rule = rules.find((r) => r.palette && r.test.test(material.name));
      if (!rule) continue;
      for (const slot of ["map", "shadeMultiplyTexture"]) {
        if (material[slot]) material[slot] = recolorTexture(material[slot], rule.palette, cache);
      }
      if (material.shadeColorFactor) material.shadeColorFactor.set(rule.palette.stops[1][1]).lerp(new THREE.Color(1, 1, 1), 0.35);
      material.needsUpdate = true;
    }
  });
}

function recolorTexture(texture, palette, cache) {
  const image = texture.image;
  if (!image || !image.width) return texture;
  const cacheKey = image;
  if (!cache.has(cacheKey)) cache.set(cacheKey, new Map());
  const byPalette = cache.get(cacheKey);
  if (byPalette.has(palette)) return byPalette.get(palette);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = pixels.data;

  // Plage de luminosité des pixels visibles (on ignore les extrêmes).
  const samples = [];
  for (let i = 0; i < px.length; i += 4 * 7) {
    if (px[i + 3] > 40) samples.push((0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255);
  }
  samples.sort((a, b) => a - b);
  const lo = samples.length ? samples[Math.floor(samples.length * 0.03)] : 0;
  const hi = samples.length ? samples[Math.floor(samples.length * 0.98)] : 1;
  const range = Math.max(hi - lo, 0.05);

  const stops = palette.stops.map(([at, hex]) => [at, new THREE.Color(hex)]);
  const lut = new Uint8ClampedArray(256 * 3);
  const c = new THREE.Color();
  for (let k = 0; k < 256; k++) {
    const t = Math.pow(k / 255, palette.gamma || 1);
    let j = 1;
    while (j < stops.length - 1 && t > stops[j][0]) j++;
    const [a0, c0] = stops[j - 1];
    const [a1, c1] = stops[j];
    c.copy(c0).lerp(c1, Math.min(1, Math.max(0, (t - a0) / (a1 - a0 || 1))));
    lut[k * 3] = c.r * 255; lut[k * 3 + 1] = c.g * 255; lut[k * 3 + 2] = c.b * 255;
  }

  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    const l = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
    const k = Math.round(Math.min(1, Math.max(0, (l - lo) / range)) * 255) * 3;
    px[i] = lut[k]; px[i + 1] = lut[k + 1]; px[i + 2] = lut[k + 2];
  }
  ctx.putImageData(pixels, 0, 0);

  const result = new THREE.CanvasTexture(canvas);
  result.flipY = texture.flipY;
  result.colorSpace = texture.colorSpace;
  result.wrapS = texture.wrapS;
  result.wrapT = texture.wrapT;
  result.channel = texture.channel;
  result.offset.copy(texture.offset);
  result.repeat.copy(texture.repeat);
  result.needsUpdate = true;
  byPalette.set(palette, result);
  return result;
}
