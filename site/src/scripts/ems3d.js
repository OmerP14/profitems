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
  ['zayiflama incelme',   'Hips',         -0.05,  1.05,  1, .065, .08],   // belly: on the front of the hip shell, below the waist gap
  ['zayiflama incelme',   'Hips',          0.05,  1.05,  1, .065, .08],
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
  ['incelme agri',        'Spine',        -0.06,  1.04, -1, .075, .055],
  ['incelme agri',        'Spine',         0.06,  1.04, -1, .075, .055],
  ['sikilasma zayiflama', 'Hips',         -0.08,  0.972, -1, .09, .065],   // on the back of the hip shell (0.94–1.10), not the thigh
  ['sikilasma zayiflama', 'Hips',          0.08,  0.972, -1, .09, .065],
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
  // each pad is a thin patch that follows the body's curve: a 5×5 grid of points, every one cast onto the skin
  // in the rest pose and re-seated on its own skinned triangle every frame, so the whole pad lies flush
  const G = 5, TOP = .0085, BOTTOM = .0012;
  const P = new THREE.Vector3(), N = new THREE.Vector3(), T = new THREE.Vector3(), X = new THREE.Vector3(), M = new THREE.Matrix4();
  const UP = new THREE.Vector3(0, 1, 0), Q = new THREE.Vector3(), Cn = new THREE.Vector3(), tmp = new THREE.Vector3();
  const seatOf = (mesh, face, point, outward) => {
    skinned(mesh, face, A, Bv, C);
    const bary = new THREE.Triangle(A, Bv, C).getBarycoord(point, new THREE.Vector3());
    const n = new THREE.Vector3().subVectors(Bv, A).cross(new THREE.Vector3().subVectors(C, A));
    return { mesh, f: face, bary, flip: n.dot(outward) < 0 ? -1 : 1 };
  };
  // where a seat is now, and which way the skin faces there
  const place = (seat, outP, outN) => {
    skinned(seat.mesh, seat.f, A, Bv, C);
    outP.set(0, 0, 0).addScaledVector(A, seat.bary.x).addScaledVector(Bv, seat.bary.y).addScaledVector(C, seat.bary.z);
    outN.subVectors(Bv, A).cross(tmp.subVectors(C, A)).normalize().multiplyScalar(seat.flip);
  };
  // pad stays upright along the body; on a limb "up" is the bone itself (shoulder→elbow, hip→knee), so the pad
  // runs along the arm or thigh in any pose (the model is built in a T-pose, where world-up crosses the arm)
  const AX = new THREE.Vector3(), B1 = new THREE.Vector3(), B2 = new THREE.Vector3();
  const upFor = bone => CHILD[bone]
    ? AX.subVectors(bones[bone].getWorldPosition(B1), bones[CHILD[bone]].getWorldPosition(B2)).normalize()
    : UP;
  const frameAt = (n, outX, outT, up = UP) => {
    outT.copy(up).addScaledVector(n, -up.dot(n));
    if (outT.lengthSq() < 1e-4) outT.set(0, 0, 1).addScaledVector(n, -n.z);
    outT.normalize();
    outX.crossVectors(outT, n);
  };
  // one patch geometry: a top skin, a bottom skin resting on the body, and a thin rim joining them
  const patchGeometry = () => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(G * G * 2 * 3), 3));
    const ix = [], t = (i, j) => i * G + j, b = (i, j) => G * G + i * G + j;
    for (let i = 0; i < G - 1; i++) for (let j = 0; j < G - 1; j++) ix.push(t(i, j), t(i + 1, j), t(i, j + 1), t(i, j + 1), t(i + 1, j), t(i + 1, j + 1));
    const ring = [];
    for (let j = 0; j < G; j++) ring.push([0, j]);
    for (let i = 1; i < G; i++) ring.push([i, G - 1]);
    for (let j = G - 2; j >= 0; j--) ring.push([G - 1, j]);
    for (let i = G - 2; i > 0; i--) ring.push([i, 0]);
    ring.forEach(([i, j], k) => { const [i2, j2] = ring[(k + 1) % ring.length]; ix.push(t(i, j), b(i, j), t(i2, j2), t(i2, j2), b(i, j), b(i2, j2)); });
    geo.setIndex(ix);
    return geo;
  };

  const pads = PADS.map(([zones, bone, x, y, side, w, h], i) => {
    const hit = findHit(x, y, side, bone);
    const mat = new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 0, roughness: .35, side: THREE.DoubleSide });
    const geo = patchGeometry();
    const pad = new THREE.Mesh(geo, mat);
    pad.castShadow = true;
    pad.frustumCulled = false;                                  // its vertices move every frame
    scene.add(pad);
    let seats = null, center = null;
    if (hit) {
      center = seatOf(hit.object, hit.face, hit.point, new THREE.Vector3(0, 0, side));
      const home = boneOf(hit.object, hit.face.a);
      place(center, P, N);
      frameAt(N, X, T, upFor(bone));
      seats = [];
      for (let gi = 0; gi < G; gi++) for (let gj = 0; gj < G; gj++) {
        const u = gj / (G - 1) - .5, v = .5 - gi / (G - 1);
        Q.copy(P).addScaledVector(X, u * w).addScaledVector(T, v * h);
        ray.set(Cn.copy(Q).addScaledVector(N, .05), tmp.copy(N).negate());
        ray.far = .12;
        const g = ray.intersectObjects(meshes, false)[0];
        // a point only sits on the pad's own body part, and only where the skin is near the pad's plane;
        // over a gap or another part (an arm pad's edge reaching the chest) it stays flat on the pad's plane
        const ok = g && boneOf(g.object, g.face.a) === home && g.distance > .025 && g.distance < .075;
        seats.push(ok ? seatOf(g.object, g.face, g.point, N) : { fallback: true, u, v });
      }
      ray.far = Infinity;
    }
    return { pad, geo, mat, seats, center, bone, w, h, x, y, side, zones: zones.split(' '), back: side < 0, i };
  });

  const SP = new THREE.Vector3(), SN = new THREE.Vector3(), CP = new THREE.Vector3();
  function seatPad(d, k) {
    const pos = d.geo.attributes.position;
    if (!d.seats) {                                             // no skin found: a small flat card where it was asked for
      for (let n = 0; n < G * G; n++) {
        const u = (n % G) / (G - 1) - .5, v = .5 - Math.floor(n / G) / (G - 1);
        pos.setXYZ(n, d.x + u * d.w * k, d.y + v * d.h * k, (.12 + TOP) * d.side);
        pos.setXYZ(G * G + n, d.x + u * d.w * k, d.y + v * d.h * k, .12 * d.side);
      }
    } else {
      place(d.center, P, N);
      frameAt(N, X, T, upFor(d.bone));
      CP.copy(P).addScaledVector(N, TOP);
      d.seats.forEach((s, n) => {
        if (s.fallback) { SP.copy(P).addScaledVector(X, s.u * d.w).addScaledVector(T, s.v * d.h); SN.copy(N); }
        else place(s, SP, SN);
        // pop in from the centre: k < 1 draws every point toward the middle of the pad
        tmp.copy(SP).addScaledVector(SN, TOP).sub(CP).multiplyScalar(k).add(CP);
        pos.setXYZ(n, tmp.x, tmp.y, tmp.z);
        tmp.copy(SP).addScaledVector(SN, BOTTOM).sub(CP).multiplyScalar(k).add(CP);
        pos.setXYZ(G * G + n, tmp.x, tmp.y, tmp.z);
      });
    }
    pos.needsUpdate = true;
    d.geo.computeVertexNormals();
  }

  // the idle clip keeps the body breathing; our pose is layered on top each frame
  // every frame starts from the rest pose, so offsets added on top never pile up
  // (bones the idle clip does not animate, like the fingers, would otherwise keep turning)
  const rest = Object.values(bones).map(b => [b, b.position.clone(), b.quaternion.clone()]);
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
  // curl every finger joint so the hands read as fists
  const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
  // curl the fingers: the raised hand a loose fist with the fingers still visible,
  // the hand on the hip nearly open so the fingers rest on the waist
  function fist(w) {
    const curl = { Right: .85, Left: .2 };
    for (const side of ['Left', 'Right']) {
      const m = side === 'Right' ? -1 : 1;   // the left hand is a mirror image
      const c = curl[side] * w;
      for (const f of FINGERS) for (let k = 1; k <= 3; k++) {
        const b = bones[`${side}Hand${f}${k}`];
        if (b) b.rotation.y += m * (k === 1 ? 1.1 : 1.35) * c;
      }
      for (let k = 1; k <= 3; k++) {
        const b = bones[`${side}HandThumb${k}`];
        if (b) b.rotation.y += m * .4 * c;
      }
    }
  }
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
    // final pose, facing the viewer: right arm flexed with the fist by the head, left hand on the hip, both hands closed
    if (a > .001) {
      model.updateMatrixWorld(true);
      const W = v => new THREE.Vector3(...v).applyQuaternion(model.quaternion).normalize();
      aim(B.RightArm, B.RightForeArm, W([-1, .3, .15]), a);
      aim(B.RightForeArm, B.RightHand, W([.25, 1, .15]), a);
      aim(B.LeftArm, B.LeftForeArm, W([.8, -.5, -.3]), a);
      aim(B.LeftForeArm, B.LeftHand, W([-.5, -.8, .25]), a);
      fist(a);
      // turn the raised fist so its fingers face the viewer, and lay the other hand flat on the hip
      if (B.RightHand) B.RightHand.rotation.x -= 1.5 * a;
      if (B.LeftHand) B.LeftHand.rotation.y -= .9 * a;
    }
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), .05);
    const t = clock.elapsedTime;
    for (const [b, p0, q0] of rest) { b.position.copy(p0); b.quaternion.copy(q0); }
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
