// EMS mannequin in 3D: suit, electrode pads stuck to the body, turn, squat and flex, all driven by one progress value (0–1)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const RED = new THREE.Color('#e8173f');
const SKIN = new THREE.Color('#c7ccd1');
const SUIT = new THREE.Color('#121316');

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// pads are found by casting a ray at the body in its bind pose: [zones, bone, x, y, from front (1) or back (-1), w, h]
const PADS = [
  ['agri',                'Spine2',       -0.085, 1.43,  1, .07, .035],
  ['agri',                'Spine2',        0.085, 1.43,  1, .07, .035],
  ['sikilasma',           'Spine2',       -0.075, 1.33,  1, .085, .06],
  ['sikilasma',           'Spine2',        0.075, 1.33,  1, .085, .06],
  ['zayiflama incelme',   'Spine1',       -0.05,  1.17,  1, .065, .08],
  ['zayiflama incelme',   'Spine1',        0.05,  1.17,  1, .065, .08],
  ['incelme agri',        'Spine',        -0.115, 1.04,  1, .055, .085],
  ['incelme agri',        'Spine',         0.115, 1.04,  1, .055, .085],
  ['sikilasma',           'LeftArm',       0.235, 1.24,  1, .05, .075],
  ['sikilasma',           'RightArm',     -0.235, 1.24,  1, .05, .075],
  ['zayiflama sikilasma', 'LeftUpLeg',     0.10,  0.72,  1, .07, .1],
  ['zayiflama sikilasma', 'RightUpLeg',   -0.10,  0.72,  1, .07, .1],
  // back
  ['agri',                'Spine2',       -0.08,  1.36, -1, .08, .07],
  ['agri',                'Spine2',        0.08,  1.36, -1, .08, .07],
  ['sikilasma',           'Spine1',       -0.10,  1.20, -1, .07, .08],
  ['sikilasma',           'Spine1',        0.10,  1.20, -1, .07, .08],
  ['incelme agri',        'Spine',        -0.06,  1.05, -1, .075, .06],
  ['incelme agri',        'Spine',         0.06,  1.05, -1, .075, .06],
  ['sikilasma zayiflama', 'Hips',         -0.08,  0.90, -1, .09, .075],
  ['sikilasma zayiflama', 'Hips',          0.08,  0.90, -1, .09, .075],
  ['zayiflama sikilasma', 'LeftUpLeg',     0.10,  0.68, -1, .065, .09],
  ['zayiflama sikilasma', 'RightUpLeg',   -0.10,  0.68, -1, .065, .09],
];

export async function createEms3D(container, { modelUrl }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, .1, 50);
  camera.position.set(0, 1.05, 5.4);
  camera.lookAt(0, .92, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b7077, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(2.5, 4, 3.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -1.5; key.shadow.camera.right = 1.5;
  key.shadow.camera.top = 2.5; key.shadow.camera.bottom = -.5;
  key.shadow.bias = -.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff3355, 1.4);   // brand-red rim from behind
  rim.position.set(-3, 2.5, -3);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.ShadowMaterial({ opacity: .16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(modelUrl);
  const model = gltf.scene;
  scene.add(model);

  const bones = {};
  const meshes = [];
  let surfaceMat, jointMat;
  model.traverse(o => {
    if (o.isBone) bones[o.name.replace(/^mixamorig:?/, '')] = o;
    if (o.isMesh) {
      o.castShadow = true;
      o.frustumCulled = false;
      meshes.push(o);
      const isJoint = /Joints/i.test(o.material.name);
      const m = new THREE.MeshStandardMaterial({ color: isJoint ? SKIN.clone() : SKIN.clone(), roughness: isJoint ? .55 : .42, metalness: .05 });
      o.material = m;
      if (isJoint) jointMat = m; else surfaceMat = m;
    }
  });

  // the suit: every surface vertex driven mostly by a torso/hip/thigh bone gets painted, top to bottom
  const SUIT_BONES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'LeftShoulder', 'RightShoulder', 'LeftArm', 'RightArm', 'LeftUpLeg', 'RightUpLeg'];   // EMS suits carry upper-arm cuffs too
  const suitPaint = [];
  for (const mesh of meshes) {
    if (!mesh.isSkinnedMesh || mesh.material !== surfaceMat) continue;
    const g = mesh.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
    const names = mesh.skeleton.bones.map(b => b.name.replace(/^mixamorig:?/, ''));
    const col = new Float32Array(pos.count * 3);
    const mask = new Uint8Array(pos.count), ys = new Float32Array(pos.count);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      let best = 0, bi = 0;
      for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > best) { best = w; bi = si.getComponent(i, k); } }
      mask[i] = SUIT_BONES.includes(names[bi]) ? 1 : 0;
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      ys[i] = v.y;
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 1;
    }
    let lo = Infinity, hi = -Infinity;
    for (const y of ys) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
    for (let i = 0; i < ys.length; i++) ys[i] = (ys[i] - lo) / (hi - lo);   // 0 = feet, 1 = top of head
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    suitPaint.push({ col, mask, ys, attr: g.attributes.color });
  }
  surfaceMat.vertexColors = true;
  surfaceMat.needsUpdate = true;
  let paintedAt = -1;
  const paintSuit = t => {
    const line = .86 - t * .6;             // the hem moves from the shoulders down past the thighs
    const sr = SUIT.r / SKIN.r, sg = SUIT.g / SKIN.g, sb = SUIT.b / SKIN.b;
    for (const { col, mask, ys, attr } of suitPaint) {
      for (let i = 0; i < mask.length; i++) {
        const on = mask[i] && ys[i] > line;
        col[i * 3] = on ? sr : 1; col[i * 3 + 1] = on ? sg : 1; col[i * 3 + 2] = on ? sb : 1;
      }
      attr.needsUpdate = true;
    }
  };

  // pads ride on the skin itself: each one remembers the triangle it was cast onto in the rest pose
  // and is re-seated on that (skinned) triangle every frame, so it never sinks in or floats off
  model.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const padGeo = new THREE.BoxGeometry(1, 1, 1);
  const A = new THREE.Vector3(), Bv = new THREE.Vector3(), C = new THREE.Vector3();
  const skinned = (mesh, f, a, b, c) => {
    mesh.getVertexPosition(f.a, a).applyMatrix4(mesh.matrixWorld);
    mesh.getVertexPosition(f.b, b).applyMatrix4(mesh.matrixWorld);
    mesh.getVertexPosition(f.c, c).applyMatrix4(mesh.matrixWorld);
  };
  const boneOf = (mesh, v) => {
    const si = mesh.geometry.attributes.skinIndex, sw = mesh.geometry.attributes.skinWeight;
    let best = 0, bi = 0;
    for (let k = 0; k < 4; k++) { const w = sw.getComponent(v, k); if (w > best) { best = w; bi = si.getComponent(v, k); } }
    return mesh.skeleton.bones[bi].name.replace(/^mixamorig:?/, '');
  };
  const cast = (x, y, side, bone) => {
    ray.set(new THREE.Vector3(x, y, 2 * side), new THREE.Vector3(0, 0, -side));
    const hit = ray.intersectObjects(meshes, false)[0];
    return hit && (!bone || boneOf(hit.object, hit.face.a) === bone) ? hit : null;
  };
  const CHILD = { LeftArm: 'LeftForeArm', RightArm: 'RightForeArm', LeftUpLeg: 'LeftLeg', RightUpLeg: 'RightLeg' };
  // limbs (and anything a ray misses): pick the skin triangle on that bone that faces the right way
  // and sits closest to the bone's middle
  const searchFace = (bone, side, x, y) => {
    const child = CHILD[bone];
    const target = child
      ? bones[bone].getWorldPosition(new THREE.Vector3()).lerp(bones[child].getWorldPosition(new THREE.Vector3()), .45)
      : new THREE.Vector3(x, y, 0);
    let best = null, bestScore = -Infinity;
    const cen = new THREE.Vector3(), nrm = new THREE.Vector3(), e = new THREE.Vector3();
    for (const mesh of meshes) {
      if (mesh.material !== surfaceMat) continue;
      const idx = mesh.geometry.index;
      for (let f = 0; f < idx.count; f += 3) {
        const face = { a: idx.getX(f), b: idx.getX(f + 1), c: idx.getX(f + 2) };
        if (boneOf(mesh, face.a) !== bone) continue;
        skinned(mesh, face, A, Bv, C);
        nrm.subVectors(Bv, A).cross(e.subVectors(C, A)).normalize();
        cen.copy(A).add(Bv).add(C).multiplyScalar(1 / 3);
        const facing = nrm.z * side;
        const dist = child ? cen.distanceTo(target) : Math.hypot(cen.x - target.x, cen.y - target.y);
        const score = facing - 6 * dist - (child ? 0 : 2 * Math.max(0, -cen.z * side));
        if (score > bestScore) { bestScore = score; best = { object: mesh, face, point: cen.clone() }; }
      }
    }
    return best;
  };
  const findHit = (x, y, side, bone) => {
    const limb = !!CHILD[bone];
    return (!limb && cast(x, y, side, null)) || searchFace(bone, side, x, y);
  };
  const pads = PADS.map(([zones, bone, x, y, side, w, h], i) => {
    const hit = findHit(x, y, side, bone);
    const mat = new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 0, roughness: .35 });
    const pad = new THREE.Mesh(padGeo, mat);
    pad.castShadow = true;
    scene.add(pad);
    let seat = null;
    if (hit) {
      const mesh = hit.object, f = hit.face;
      skinned(mesh, f, A, Bv, C);
      const bary = new THREE.Triangle(A, Bv, C).getBarycoord(hit.point, new THREE.Vector3());
      const n = new THREE.Vector3().subVectors(Bv, A).cross(new THREE.Vector3().subVectors(C, A));
      const flip = n.z * side < 0 ? -1 : 1;           // make the normal point out of the body
      seat = { mesh, f, bary, flip };
    }
    return { pad, mat, seat, w, h, x, y, side, zones: zones.split(' '), back: side < 0, i };
  });
  const P = new THREE.Vector3(), N = new THREE.Vector3(), T = new THREE.Vector3(), M = new THREE.Matrix4();
  const UP = new THREE.Vector3(0, 1, 0);
  function seatPad(d, k) {
    const { pad, seat } = d;
    if (!seat) { pad.position.set(d.x, d.y, .12 * d.side); pad.scale.set(d.w * k, d.h * k, .012); return; }
    skinned(seat.mesh, seat.f, A, Bv, C);
    P.set(0, 0, 0).addScaledVector(A, seat.bary.x).addScaledVector(Bv, seat.bary.y).addScaledVector(C, seat.bary.z);
    N.subVectors(Bv, A).cross(T.subVectors(C, A)).normalize().multiplyScalar(seat.flip);
    // keep the pad upright along the body: up = world up flattened onto the skin
    T.copy(UP).addScaledVector(N, -UP.dot(N));
    if (T.lengthSq() < 1e-4) T.set(0, 0, 1).addScaledVector(N, -N.z);
    T.normalize();
    const X = new THREE.Vector3().crossVectors(T, N);
    M.makeBasis(X, T, N);
    pad.quaternion.setFromRotationMatrix(M);
    pad.position.copy(P).addScaledVector(N, .006);
    pad.scale.set(d.w * k, d.h * k, .012 * Math.max(k, .001));
  }

  // the idle clip keeps the body breathing; our pose is layered on top each frame
  const mixer = new THREE.AnimationMixer(model);
  const idle = gltf.animations.find(a => a.name === 'idle') || gltf.animations[0];
  if (idle) mixer.clipAction(idle).play();
  const clock = new THREE.Clock();

  let progress = 0, goal = null, impulse = 0, active = true, looping = false;

  function size() {
    const r = container.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(r.height, 1);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(size).observe(container);
  size();

  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), qc = new THREE.Quaternion(), va = new THREE.Vector3();
  // turn a bone so that it points along a world direction (mixamo bones point along +Y)
  const vb = new THREE.Vector3();
  function aim(bone, child, dir, w) {
    if (!bone || !child || w <= 0) return;
    const world = bone.getWorldQuaternion(qa);
    const cur = child.getWorldPosition(va).sub(bone.getWorldPosition(vb)).normalize();
    const target = qb.setFromUnitVectors(cur, dir).multiply(world);
    const local = bone.parent.getWorldQuaternion(qc).invert().multiply(target);
    bone.quaternion.slerp(local, w);
    bone.updateMatrixWorld(true);
  }
  const fwd = new THREE.Vector3();
  function pose(p, t) {
    // the turn, front -> back -> front
    const deg = p < .64 ? Math.PI * ease(seg(p, .5, .6)) : Math.PI - Math.PI * ease(seg(p, .68, .76));
    const quarter = .5 * ease(seg(p, .76, .8)) * (1 - ease(seg(p, .92, .96)));   // three-quarter view while squatting
    model.rotation.y = deg + quarter + Math.sin(t * .5) * .04 * (1 - seg(p, .45, .5));
    const s = (1 - Math.cos(seg(p, .78, .93) * Math.PI * 4)) / 2;     // two squats
    const a = ease(seg(p, .93, .99));                                   // final flex
    const B = bones;
    if (B.Hips) B.Hips.position.y -= 24 * s;
    for (const side of ['Left', 'Right']) {
      const sign = side === 'Left' ? 1 : -1;
      if (B[side + 'UpLeg']) { B[side + 'UpLeg'].rotation.x -= 1.05 * s; B[side + 'UpLeg'].rotation.z += .22 * s * sign; }
      if (B[side + 'Leg']) B[side + 'Leg'].rotation.x += 1.55 * s;
      if (B[side + 'Foot']) B[side + 'Foot'].rotation.x -= .5 * s;
      // flex: upper arm out to the side, forearm up
      // arms forward a little for balance during the squat
    }
    if (B.Spine) B.Spine.rotation.x += .22 * s;
    // arms reach straight forward while squatting
    if (s > .001) {
      model.updateMatrixWorld(true);
      fwd.set(0, -.08, 1).applyQuaternion(model.quaternion).normalize();
      for (const side of ['Left', 'Right']) { aim(B[side + 'Arm'], B[side + 'ForeArm'], fwd, s); aim(B[side + 'ForeArm'], B[side + 'Hand'], fwd, s); }
    }
    // final flex, facing the viewer: upper arms out to the sides, forearms straight up
    if (a > .001) {
      model.updateMatrixWorld(true);
      for (const side of ['Left', 'Right']) {
        const out = new THREE.Vector3(side === 'Left' ? 1 : -1, .1, .18).applyQuaternion(model.quaternion).normalize();
        const up = new THREE.Vector3(0, 1, .12).applyQuaternion(model.quaternion).normalize();
        aim(B[side + 'Arm'], B[side + 'ForeArm'], out, a);
        aim(B[side + 'ForeArm'], B[side + 'Hand'], up, a);
      }
    }
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), .05);
    const t = clock.elapsedTime;
    mixer.update(dt);
    const p = progress;
    pose(p, t);
    model.updateMatrixWorld(true);

    // suit goes on: the joint shell darkens first, then the surface
    const suit = ease(seg(p, .02, .13));
    jointMat.color.copy(SKIN).lerp(SUIT, suit);
    const q = Math.round(suit * 60) / 60;
    if (q !== paintedAt) { paintSuit(q); paintedAt = q; }

    const live = p > .31;
    impulse = Math.max(0, impulse - dt * 2.5);
    const frontT = seg(p, .16, .3) * 12;
    const backT = seg(p, .56, .66) * 10;
    for (const d of pads) {
      const k = d.back ? ease(clamp(backT - (d.i - 12))) : ease(clamp(frontT - d.i));
      d.pad.visible = k > .001;
      if (d.pad.visible) seatPad(d, k);
      const on = !goal || d.zones.includes(goal);
      const pulse = live ? (.5 + .5 * Math.sin(t * 7 - d.i * .7)) : 0;
      d.mat.emissiveIntensity = on ? (pulse * .9 + impulse * 1.2) : 0;
      d.mat.color.copy(RED).multiplyScalar(on ? 1 : .32);
    }
    renderer.render(scene, camera);
    if (active) requestAnimationFrame(frame); else looping = false;
  }
  const start = () => { if (!looping) { looping = true; clock.getDelta(); requestAnimationFrame(frame); } };
  start();

  return {
    setProgress(p) { progress = p; },
    setGoal(g) { goal = g; impulse = g ? 1 : 0; },
    setActive(on) { active = on; if (on) start(); },
  };
}
