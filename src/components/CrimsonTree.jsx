import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CONFIG = {
  tree: {
    heightScale: 0.86,
    widthScale: 1.5,
    trunkHeight: 0.95,
    trunkRadius: 0.15,
    majorLimbs: 5,
    branchDensity: 1.15,
    childCounts: [3, 3, 3, 2],
    maxDepth: 4,
    taper: 0.6,
    lengthFalloff: 0.74,
    leftBias: 0.46,
    rightShare: 0.22,
    rightPetalBoost: 3,
    leftPetalBoost: 1.9,
    midBand: [-0.55, 0.25],
    midThinning: 0.75,
    bareBelowY: -0.75,
    canopyClearance: 0.35,
    flatten: 0.018,
    depthSpread: 1.0,
    barkColor: 0x7e614d,
    soilColor: 0x5d4231,
    barkShadeVariation: 0.42,
    barkRoughness: 0.92,
    seed: 20260729,
  },

  petal: {
    baseColor: '#dd2419',
    hueJitter: 0.022,
    satJitter: 0.13,
    lightJitter: 0.15,
    size: 0.1,
    sizeJitter: 0.55,
    glow: 0.16,
    occlusion: 0.55,
    opacity: 0.94,
    sheen: 0.32,
  },

  canopy: {
    attachedCount: 2880,
    petalsPerFlower: 5,
    flowerSplay: 0.045,
    clusterRadius: 0.36,
    outerBias: 2.0,
    shimmerSpeed: 1.5,
    shimmerAmount: 0.16,
    swayAmount: 0.02,
    swaySpeed: 0.42,
  },

  fall: {
    maxFalling: 900,
    spawnPerSecond: 3,
    fallSpeedPx: 82,
    fallSpeedJitter: 0.55,
    windLeftPx: 20,
    windJitter: 1.05,
    gustPx: 16,
    gustPeriod: 9,
    swaySpeedPx: 60,
    swayFrequency: 0.35,
    tumbleSpeed: 1.8,
    thinStartFraction: 0.55,
    thinStartMinPx: 700,
    thinBias: 0.22,
    fadePx: 90,
    exitMarginPx: 60,
    warmUpStep: 0.4,
  },

  burst: {
    count: 20,
    spread: 0.22,
    outSpeed: 0.55,
    upKick: 0.3,
  },

  layout: {
    treeWidthFraction: 0.5,
    trunkInsetX: 0.055,
    bigViewport: 1280,
    bigViewportShiftPx: 16,
    groundSelector: '[data-tree-ground]',
    groundSelectorSmall: '[data-tree-ground-sm]',
    groundFallback: 0.66,
    groundOffsetPx: 12,
    overhang: 0.7,
    windRefWidth: 1280,
    windScaleClamp: [0.45, 1.4],
    smallViewport: 768,
    smallQuality: 0.5,
  },

  camera: {
    fov: 46.4,
    driftAmount: 0.035,
    driftSpeed: 0.12,
  },

  light: {
    ambient: 0.42,
    ambientColor: 0xffe9ec,
    directional: 1.15,
    directionalColor: 0xfff4e8,
    direction: [-0.6, 1.0, 0.8],
    hemisphere: 0.7,
    skyColor: 0xdfe9ff,
    groundColor: 0x6b3a2a,
  },
}

function makeRng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _quat = new THREE.Quaternion()
const _color = new THREE.Color()
const _obj = new THREE.Object3D()
const _pointer = new THREE.Vector2()

function makePetalGeometry() {
  const g = new THREE.PlaneGeometry(1, 1.25, 7, 9)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const v = (y + 0.625) / 1.25
    let width = Math.sin(Math.PI * Math.min(1, Math.max(0, v)) ** 0.75)
    if (v > 0.86) width *= 1 - 0.55 * ((v - 0.86) / 0.14)
    pos.setX(i, x * width)
    const curl = 0.34 * Math.pow(Math.max(0, v - 0.35), 2)
    pos.setZ(i, 0.2 * Math.sin(Math.PI * v) - 0.55 * x * x + curl)
    pos.setY(i, y - curl * 0.35)
  }
  const cols = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const v = (pos.getY(i) + 0.625) / 1.25
    const ax = Math.abs(pos.getX(i))
    const vein = 0.94 + 0.06 * Math.cos(pos.getX(i) * 26)
    const k = (0.68 + 0.55 * v + 0.35 * ax) * vein
    cols[i * 3] = Math.min(1.35, k)
    cols[i * 3 + 1] = k * (0.72 + 0.3 * v + 0.2 * ax)
    cols[i * 3 + 2] = k * (0.7 + 0.3 * v + 0.25 * ax)
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3))
  g.computeVertexNormals()
  g.translate(0, 0.45, 0)
  return g
}

function buildSkeleton(cfg, outerBias) {
  const rng = makeRng(cfg.seed)
  const segments = []
  const anchors = []

  const grow = (start, dir, length, radius, depth) => {
    const steps = depth === 0 ? 4 : 2
    const p = start.clone()
    const d = dir.clone().normalize()
    let r = radius

    for (let i = 0; i < steps; i++) {
      const end = p.clone().addScaledVector(d, length / steps)
      const nr = r * (depth === 0 ? 0.88 : 0.74)
      segments.push({ a: p.clone(), b: end, r0: r, r1: nr })
      p.copy(end)
      r = nr
      d.x -= (0.04 + 0.07 * rng()) * cfg.leftBias
      d.y += depth === 0 ? 0.02 : (0.03 - cfg.flatten * depth) * (0.5 + rng())
      d.z += (rng() - 0.5) * 0.22 * cfg.depthSpread
      d.normalize()
      const rightBoost = p.x > -0.25 ? cfg.rightPetalBoost : cfg.leftPetalBoost
      const inBand = p.y > cfg.midBand[0] && p.y < cfg.midBand[1]
      const mid = inBand && p.x < -0.25 ? cfg.midThinning : 1
      const bareT = THREE.MathUtils.clamp((p.y - cfg.bareBelowY) / cfg.canopyClearance, 0, 1)
      const bare = bareT * bareT * (3 - 2 * bareT)
      const clump =
        0.35 +
        1.3 *
          Math.abs(Math.sin(p.x * 2.3 + p.y * 1.7) * Math.cos(p.z * 2.9 - p.x * 1.1))
      anchors.push({
        pos: p.clone(),
        weight: Math.pow(depth + 1, outerBias) * rightBoost * mid * bare * clump,
      })
    }

    if (depth >= cfg.maxDepth || length < 0.14) return

    const base =
      depth === 0 ? cfg.majorLimbs : cfg.childCounts[Math.min(depth - 1, cfg.childCounts.length - 1)]
    const children = Math.max(2, Math.round(base * cfg.branchDensity))

    for (let c = 0; c < children; c++) {
      const perp = _v1.set(0, 1, 0).cross(d)
      if (perp.lengthSq() < 1e-5) perp.set(1, 0, 0)
      const axis = perp
        .normalize()
        .applyAxisAngle(d, (c / children) * Math.PI * 2 + rng() * 1.2)
        .clone()
      const spread = (depth === 0 ? 0.9 : 0.62) * (0.55 + 0.8 * rng())
      const nd = d.clone().applyAxisAngle(axis, spread)

      nd.x -= cfg.leftBias * (0.3 + 0.5 * rng())
      nd.y = Math.max(nd.y, depth === 0 ? 0.35 : 0.02)
      nd.z *= cfg.depthSpread
      if (nd.x > 0 && rng() > cfg.rightShare) nd.x *= -0.2
      nd.normalize()

      grow(
        p,
        nd,
        length * cfg.lengthFalloff * (0.75 + 0.5 * rng()),
        r * cfg.taper * (0.85 + 0.25 * rng()),
        depth + 1
      )
    }
  }

  segments.push({
    a: new THREE.Vector3(0, -1.24, 0),
    b: new THREE.Vector3(0, -1.05, 0),
    r0: cfg.trunkRadius * 1.85,
    r1: cfg.trunkRadius * 1.12,
  })

  grow(
    new THREE.Vector3(0, -1.15, 0),
    new THREE.Vector3(-0.12, 1, 0),
    cfg.trunkHeight,
    cfg.trunkRadius,
    0
  )

  return { segments, anchors }
}

function buildBranchGeometry(segments, cfg) {
  const rng = makeRng(cfg.seed + 7)
  const parts = []
  let vertexTotal = 0

  for (const s of segments) {
    const len = s.a.distanceTo(s.b)
    if (len < 1e-4) continue
    const radial = s.r0 > 0.1 ? 10 : 6
    const geo = new THREE.CylinderGeometry(s.r1, s.r0, len, radial, 1, false).toNonIndexed()
    _v1.copy(s.b).sub(s.a).normalize()
    _quat.setFromUnitVectors(_up, _v1)
    _v2.copy(s.a).add(s.b).multiplyScalar(0.5)
    const m = new THREE.Matrix4().compose(_v2, _quat, _v1.set(1, 1, 1))
    geo.applyMatrix4(m)
    parts.push(geo)
    vertexTotal += geo.attributes.position.count
  }

  const position = new Float32Array(vertexTotal * 3)
  const normal = new Float32Array(vertexTotal * 3)
  const color = new Float32Array(vertexTotal * 3)
  let o = 0
  for (const geo of parts) {
    const p = geo.attributes.position.array
    const n = geo.attributes.normal.array
    position.set(p, o * 3)
    normal.set(n, o * 3)
    const count = geo.attributes.position.count
    for (let i = 0; i < count; i += 3) {
      const shade = 1 - cfg.barkShadeVariation * rng()
      for (let k = 0; k < 3; k++) {
        color[(o + i + k) * 3] = shade
        color[(o + i + k) * 3 + 1] = shade * 0.98
        color[(o + i + k) * 3 + 2] = shade * 0.95
      }
    }
    o += count
    geo.dispose()
  }

  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.BufferAttribute(position, 3))
  merged.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  merged.setAttribute('color', new THREE.BufferAttribute(color, 3))
  merged.computeBoundingBox()
  merged.computeBoundingSphere()
  return merged
}

export default function CrimsonTree({
  style,
  className,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  paused = false,
  leavesPaused = false,
  interactive = true,
  preserveDrawingBuffer = false,
}) {
  const hostRef = useRef(null)
  const optsRef = useRef({ scale, offsetX, offsetY, paused, leavesPaused })
  optsRef.current = { scale, offsetX, offsetY, paused, leavesPaused }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const cfg = CONFIG
    const L = cfg.layout
    const disposables = []
    const geometries = []

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer,
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setClearAlpha(0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.touchAction = 'manipulation'
    renderer.domElement.style.pointerEvents = 'none'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(cfg.camera.fov, 1, 0.1, 100)

    const ambient = new THREE.AmbientLight(cfg.light.ambientColor, cfg.light.ambient)
    const dir = new THREE.DirectionalLight(cfg.light.directionalColor, cfg.light.directional)
    dir.position.set(...cfg.light.direction).multiplyScalar(6)
    const hemi = new THREE.HemisphereLight(
      cfg.light.skyColor,
      cfg.light.groundColor,
      cfg.light.hemisphere
    )
    scene.add(ambient, dir, hemi)

    const root = new THREE.Group()
    root.name = 'crimsonTree'
    const world = new THREE.Group()
    world.add(root)
    scene.add(world)

    const barkMat = new THREE.MeshStandardMaterial({
      color: cfg.tree.barkColor,
      roughness: cfg.tree.barkRoughness,
      metalness: 0.02,
      vertexColors: true,
      flatShading: true,
    })
    barkMat.name = 'bark'
    disposables.push(barkMat)

    const isSmallViewport = window.innerWidth < L.smallViewport
    const skeletonCfg = isSmallViewport
      ? { ...cfg.tree, rightPetalBoost: cfg.tree.rightPetalBoost * 1.3 }
      : cfg.tree
    const { segments, anchors } = buildSkeleton(skeletonCfg, cfg.canopy.outerBias)
    const branchGeo = buildBranchGeometry(segments, cfg.tree)
    geometries.push(branchGeo)
    const branches = new THREE.Mesh(branchGeo, barkMat)
    branches.name = 'branches'
    root.add(branches)

    const soilMat = new THREE.MeshStandardMaterial({
      color: cfg.tree.soilColor,
      roughness: 1,
      metalness: 0,
      vertexColors: true,
      flatShading: true,
    })
    soilMat.name = 'soil'
    disposables.push(soilMat)

    const soilRng = makeRng(cfg.tree.seed + 31)
    const makeEarth = (radius, height, segs, squashZ) => {
      const g = new THREE.SphereGeometry(
        radius,
        segs,
        Math.max(6, segs >> 1),
        0,
        Math.PI * 2,
        0,
        Math.PI
      )
      g.scale(1, height / radius, squashZ)
      const p = g.attributes.position
      const cols = new Float32Array(p.count * 3)
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i),
          y = p.getY(i),
          z = p.getZ(i)
        const rim = 1 - Math.max(-1, Math.min(1, y / (height * 0.9)))
        const n =
          Math.sin(x * 5.7 + z * 3.1) * 0.5 +
          Math.sin(x * 11.3 - z * 9.7) * 0.28 +
          Math.sin(x * 23.1 + z * 19.3) * 0.14 +
          (soilRng() - 0.5) * 0.16
        p.setX(i, x * (1 + n * 0.14 * rim))
        p.setZ(i, z * (1 + n * 0.14 * rim))
        p.setY(i, y + n * height * 0.3 * (1 - rim * 0.7))
        const toTrunk = 1 - Math.min(1, Math.hypot(x, z) / radius)
        const shade = (0.62 + 0.42 * rim) * (1 - 0.3 * toTrunk) - soilRng() * 0.16
        cols[i * 3] = shade
        cols[i * 3 + 1] = shade * 0.96
        cols[i * 3 + 2] = shade * 0.9
      }
      g.setAttribute('color', new THREE.BufferAttribute(cols, 3))
      g.computeVertexNormals()
      geometries.push(g)
      return g
    }

    const soil = new THREE.Group()
    soil.name = 'soil'
    const mound = new THREE.Mesh(makeEarth(0.78, 0.1, 40, 0.62), soilMat)
    mound.position.set(0.02, -1.2, 0)
    soil.add(mound)
    for (let i = 0; i < 5; i++) {
      const r = 0.13 + soilRng() * 0.16
      const clod = new THREE.Mesh(makeEarth(r, r * 0.5, 18, 0.7), soilMat)
      const a = Math.PI * (0.45 + soilRng() * 1.1)
      const d = 0.42 + soilRng() * 0.42
      clod.position.set(Math.cos(a) * d - 0.1, -1.2, Math.sin(a) * d * 0.55)
      clod.rotation.y = soilRng() * Math.PI
      soil.add(clod)
    }
    root.add(soil)

    const petalGeo = makePetalGeometry()
    geometries.push(petalGeo)

    const makePetalMaterial = (name) => {
      const m = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1 - cfg.petal.sheen,
        metalness: 0.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: cfg.petal.opacity,
        depthWrite: false,
      })
      m.name = name
      disposables.push(m)
      return m
    }

    const attachedMat = makePetalMaterial('petalAttached')
    const fallingMat = makePetalMaterial('petalFalling')

    fallingMat.onBeforeCompile = (shader) => {
      shader.vertexShader =
        'attribute float aAlpha;\nvarying float vAlpha;\n' +
        shader.vertexShader.replace('void main() {', 'void main() {\n  vAlpha = aAlpha;')
      shader.fragmentShader =
        'varying float vAlpha;\n' +
        shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          '#include <dithering_fragment>\n  gl_FragColor.a *= vAlpha;'
        )
    }

    const rng = makeRng(cfg.tree.seed + 99)
    const quality = window.innerWidth < L.smallViewport ? L.smallQuality : 1
    const N = Math.round(cfg.canopy.attachedCount * quality)
    const attached = new THREE.InstancedMesh(petalGeo, attachedMat, N)
    attached.name = 'canopyPetals'
    attached.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    attached.frustumCulled = false
    root.add(attached)

    const cum = new Float32Array(anchors.length)
    let total = 0
    for (let i = 0; i < anchors.length; i++) {
      total += anchors[i].weight
      cum[i] = total
    }
    const pickAnchor = () => {
      const r = rng() * total
      let lo = 0,
        hi = cum.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (cum[mid] < r) lo = mid + 1
        else hi = mid
      }
      return anchors[lo]
    }

    const aBase = new Float32Array(N * 3)
    const aRot = new Float32Array(N * 3)
    const aSize = new Float32Array(N)
    const aPhase = new Float32Array(N)

    const tintInstance = (mesh, i) => {
      _color.set(cfg.petal.baseColor)
      const hsl = { h: 0, s: 0, l: 0 }
      _color.getHSL(hsl)
      _color.setHSL(
        (hsl.h + (rng() - 0.5) * cfg.petal.hueJitter + 1) % 1,
        THREE.MathUtils.clamp(hsl.s + (rng() - 0.5) * cfg.petal.satJitter, 0, 1),
        THREE.MathUtils.clamp(hsl.l + (rng() - 0.5) * cfg.petal.lightJitter + 0.06, 0.18, 0.78)
      )
      mesh.setColorAt(i, _color)
    }

    for (let i = 0; i < N; i++) {
      const tip = pickAnchor()
      const clusterRadius = tip.pos.x > -0.25 ? cfg.canopy.clusterRadius * 0.4 : cfg.canopy.clusterRadius
      const rad = clusterRadius * Math.cbrt(rng())
      const th = rng() * Math.PI * 2
      const ph = Math.acos(2 * rng() - 1)
      aBase[i * 3] = tip.pos.x + rad * Math.sin(ph) * Math.cos(th)
      aBase[i * 3 + 1] = tip.pos.y + rad * Math.cos(ph) * 0.8
      aBase[i * 3 + 2] = tip.pos.z + rad * Math.sin(ph) * Math.sin(th)
      aRot[i * 3] = rng() * Math.PI * 2
      aRot[i * 3 + 1] = rng() * Math.PI * 2
      aRot[i * 3 + 2] = rng() * Math.PI * 2
      aSize[i] = cfg.petal.size * (1 + (rng() - 0.5) * cfg.petal.sizeJitter)
      aPhase[i] = rng() * Math.PI * 2
      tintInstance(attached, i)
    }

    const nearestSq = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      let best = Infinity
      const xi = aBase[i * 3],
        yi = aBase[i * 3 + 1],
        zi = aBase[i * 3 + 2]
      for (let j = 0; j < N; j++) {
        if (j === i) continue
        const dx = xi - aBase[j * 3]
        const dy = yi - aBase[j * 3 + 1]
        const dz = zi - aBase[j * 3 + 2]
        const d = dx * dx + dy * dy + dz * dz
        if (d < best) best = d
      }
      nearestSq[i] = best
    }
    const sortedNearest = Array.from(nearestSq).sort((a, b) => a - b)
    const medianNearest = Math.sqrt(sortedNearest[Math.floor(N / 2)])
    for (let i = 0; i < N; i++) {
      if (Math.sqrt(nearestSq[i]) > medianNearest * 2.2) aSize[i] = 0
    }

    if (attached.instanceColor) attached.instanceColor.needsUpdate = true

    const M = Math.round(cfg.fall.maxFalling * quality)
    const fallGeo = petalGeo.clone()
    geometries.push(fallGeo)
    const alphaAttr = new THREE.InstancedBufferAttribute(new Float32Array(M), 1)
    alphaAttr.setUsage(THREE.DynamicDrawUsage)
    fallGeo.setAttribute('aAlpha', alphaAttr)

    const falling = new THREE.InstancedMesh(fallGeo, fallingMat, M)
    falling.name = 'fallingPetals'
    falling.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    falling.frustumCulled = false
    world.add(falling)

    const fPos = new Float32Array(M * 3)
    const fVel = new Float32Array(M * 3)
    const fRot = new Float32Array(M * 3)
    const fSpin = new Float32Array(M * 3)
    const fSize = new Float32Array(M)
    const fPhase = new Float32Array(M)
    const fSpeed = new Float32Array(M)
    const fWind = new Float32Array(M)
    const fLife = new Float32Array(M)
    const fStopY = new Float32Array(M)
    const fMax = new Float32Array(M)
    const fActive = new Uint8Array(M)
    let cursor = 0

    for (let i = 0; i < M; i++) {
      tintInstance(falling, i)
      _obj.position.set(0, 9999, 0)
      _obj.scale.setScalar(0.0001)
      _obj.updateMatrix()
      falling.setMatrixAt(i, _obj.matrix)
    }
    if (falling.instanceColor) falling.instanceColor.needsUpdate = true
    falling.instanceMatrix.needsUpdate = true

    const dyn = {
      unitsPerPx: 0.01,
      pageTopY: 0,
      bottomY: -5,
      thinStartY: -1,
      leftX: -14,
      fallSpeed: 0.8,
      windLeft: 0.1,
      gust: 0.05,
      gustW: 0.74,
      swaySpeed: 0.6,
      fadeUnits: 0.9,
    }

    let spawnAcc = 0
    const clearFalling = () => {
      for (let i = 0; i < M; i++) {
        fActive[i] = 0
        alphaAttr.array[i] = 0
        _obj.position.set(0, 9999, 0)
        _obj.scale.setScalar(0.0001)
        _obj.updateMatrix()
        falling.setMatrixAt(i, _obj.matrix)
      }
      falling.instanceMatrix.needsUpdate = true
      alphaAttr.needsUpdate = true
      spawnAcc = 0
    }

    const spawn = (x, y, z, vx = 0, vy = 0, vz = 0, size) => {
      let idx = -1
      for (let k = 0; k < M; k++) {
        const c = (cursor + k) % M
        if (!fActive[c]) {
          idx = c
          break
        }
      }
      if (idx === -1) {
        idx = cursor % M
      }
      cursor = (idx + 1) % M

      fPos[idx * 3] = x
      fPos[idx * 3 + 1] = y
      fPos[idx * 3 + 2] = z
      fVel[idx * 3] = vx
      fVel[idx * 3 + 1] = vy
      fVel[idx * 3 + 2] = vz
      fRot[idx * 3] = rng() * Math.PI * 2
      fRot[idx * 3 + 1] = rng() * Math.PI * 2
      fRot[idx * 3 + 2] = rng() * Math.PI * 2
      const t = cfg.fall.tumbleSpeed
      fSpin[idx * 3] = (rng() - 0.5) * t
      fSpin[idx * 3 + 1] = (rng() - 0.5) * t * 1.4
      fSpin[idx * 3 + 2] = (rng() - 0.5) * t
      fSize[idx] = size ?? cfg.petal.size * (1 + (rng() - 0.5) * cfg.petal.sizeJitter)
      fPhase[idx] = rng() * Math.PI * 2
      fSpeed[idx] = dyn.fallSpeed * (1 + (rng() - 0.5) * cfg.fall.fallSpeedJitter)
      fWind[idx] = 1 + (rng() - 0.5) * 2 * cfg.fall.windJitter
      fLife[idx] = 0
      fStopY[idx] =
        dyn.thinStartY + (dyn.bottomY - dyn.thinStartY) * Math.pow(rng(), cfg.fall.thinBias)
      fMax[idx] = 5 + (1.8 * Math.max(0, y - fStopY[idx])) / Math.max(1e-4, fSpeed[idx])
      fActive[idx] = 1
    }

    const fSizeFrom = (i) => aSize[i] * (0.85 + 0.3 * rng())

    const shedAmbient = () => {
      const i = (rng() * N) | 0
      _v1.set(aBase[i * 3], aBase[i * 3 + 1], aBase[i * 3 + 2]).applyMatrix4(root.matrix)
      spawn(_v1.x, _v1.y, _v1.z, -0.05 * rng(), -0.02, 0, fSizeFrom(i))
    }

    const raycaster = new THREE.Raycaster()
    raycaster.params.Mesh = { threshold: 0 }
    const canvas = renderer.domElement

    const burstAt = (point) => {
      for (let b = 0; b < cfg.burst.count; b++) {
        const s = cfg.burst.spread
        const ox = (rng() - 0.5) * s
        const oy = (rng() - 0.5) * s
        const oz = (rng() - 0.5) * s
        const speed = cfg.burst.outSpeed * (0.4 + rng())
        spawn(
          point.x + ox,
          point.y + oy,
          point.z + oz,
          ox * speed * 3 - 0.1,
          oy * speed * 2 + cfg.burst.upKick * rng(),
          oz * speed * 3
        )
      }
    }

    const onPointerDown = (e) => {
      const rect = canvas.getBoundingClientRect()
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      camera.updateMatrixWorld()
      raycaster.setFromCamera(_pointer, camera)
      const hits = raycaster.intersectObject(attached, false)
      if (hits.length) burstAt(hits[0].point)
    }
    if (interactive) document.addEventListener('pointerdown', onPointerDown, { passive: true })

    const treeBounds = new THREE.Box3()
    const soilBounds = new THREE.Box3()
    const baseCam = new THREE.Vector3()

    const scrollTop = () => window.scrollY || document.documentElement.scrollTop || 0

    const groundPx = (viewportW, viewportH) => {
      if (viewportW < L.smallViewport) {
        const el = document.querySelector(L.groundSelectorSmall)
        if (el) return el.getBoundingClientRect().bottom + scrollTop()
      }
      const el = document.querySelector(L.groundSelector)
      if (el) return el.getBoundingClientRect().top + scrollTop() + L.groundOffsetPx
      return viewportH * L.groundFallback
    }

    let sized = false
    let warmed = false
    let warmedPageH = 0
    const layout = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (w < 2 || h < 2) return
      sized = true
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3))
      renderer.setSize(w, h, false)

      const o = optsRef.current
      root.scale.set(
        cfg.tree.widthScale * o.scale,
        cfg.tree.heightScale * o.scale,
        cfg.tree.widthScale * 0.8 * o.scale
      )
      root.updateMatrixWorld(true)
      treeBounds.setFromObject(branches)
      const treeW = Math.max(0.001, treeBounds.max.x - treeBounds.min.x + L.overhang)
      soilBounds.setFromObject(soil)
      treeBounds.union(soilBounds)

      camera.aspect = w / h
      const hFov = THREE.MathUtils.degToRad(cfg.camera.fov)

      const visW = treeW / L.treeWidthFraction
      const dist = visW / 2 / Math.tan(hFov / 2)
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hFov / 2) / camera.aspect))
      const visH = visW / camera.aspect
      dyn.unitsPerPx = visW / w

      const bigScreenShift = w >= L.bigViewport ? L.bigViewportShiftPx * dyn.unitsPerPx : 0
      const cx = -visW * (0.5 - L.trunkInsetX) + o.offsetX - bigScreenShift
      const cy = treeBounds.min.y - visH / 2 + groundPx(w, h) * dyn.unitsPerPx + o.offsetY

      camera.position.set(cx, cy, dist)
      camera.updateProjectionMatrix()
      baseCam.set(cx, cy, dist)

      const pageH = Math.max(h, document.documentElement.scrollHeight)
      if (pageH > warmedPageH + 80) {
        warmed = false
        warmedPageH = pageH
        if (sized) clearFalling()
      }
      dyn.pageTopY = cy + visH / 2
      dyn.bottomY = dyn.pageTopY - (pageH + cfg.fall.exitMarginPx) * dyn.unitsPerPx
      dyn.thinStartY =
        dyn.pageTopY -
        Math.max(cfg.fall.thinStartMinPx, pageH * cfg.fall.thinStartFraction) * dyn.unitsPerPx
      dyn.leftX = cx - visW / 2 - cfg.fall.exitMarginPx * dyn.unitsPerPx
      const windScale = THREE.MathUtils.clamp(
        w / L.windRefWidth,
        L.windScaleClamp[0],
        L.windScaleClamp[1]
      )
      dyn.fallSpeed = cfg.fall.fallSpeedPx * dyn.unitsPerPx
      dyn.windLeft = cfg.fall.windLeftPx * windScale * dyn.unitsPerPx
      dyn.gust = cfg.fall.gustPx * windScale * dyn.unitsPerPx
      dyn.gustW = (Math.PI * 2) / cfg.fall.gustPeriod
      dyn.swaySpeed = cfg.fall.swaySpeedPx * windScale * dyn.unitsPerPx
      dyn.fadeUnits = cfg.fall.fadePx * dyn.unitsPerPx
    }

    const stepFalling = (dt, t) => {
      const alphas = alphaAttr.array
      const swayW = cfg.fall.swayFrequency * Math.PI * 2
      const wind = dyn.windLeft + dyn.gust * Math.sin(t * dyn.gustW)
      for (let i = 0; i < M; i++) {
        if (!fActive[i]) continue
        fLife[i] += dt
        const life = fLife[i]

        const damp = Math.exp(-dt * 2.2)
        fVel[i * 3] *= damp
        fVel[i * 3 + 1] *= damp
        fVel[i * 3 + 2] *= damp

        const sway = Math.sin(life * swayW + fPhase[i])
        const vx = fVel[i * 3] - wind * fWind[i] + sway * dyn.swaySpeed
        const vy = fVel[i * 3 + 1] - fSpeed[i] * (1 + 0.18 * sway)
        const vz = fVel[i * 3 + 2] + Math.cos(life * swayW * 1.7 + fPhase[i]) * 0.12

        fPos[i * 3] += vx * dt
        fPos[i * 3 + 1] += vy * dt
        fPos[i * 3 + 2] += vz * dt

        fRot[i * 3] += fSpin[i * 3] * dt
        fRot[i * 3 + 1] += fSpin[i * 3 + 1] * dt
        fRot[i * 3 + 2] += fSpin[i * 3 + 2] * dt

        let a = Math.min(1, life * 4)
        a *= THREE.MathUtils.clamp((fPos[i * 3 + 1] - fStopY[i]) / dyn.fadeUnits, 0, 1)
        if (life > fMax[i]) a = 0

        if (a <= 0.001 || fPos[i * 3] < dyn.leftX) {
          fActive[i] = 0
          alphas[i] = 0
          _obj.position.set(0, 9999, 0)
          _obj.scale.setScalar(0.0001)
          _obj.updateMatrix()
          falling.setMatrixAt(i, _obj.matrix)
          continue
        }

        alphas[i] = a
        _obj.position.set(fPos[i * 3], fPos[i * 3 + 1], fPos[i * 3 + 2])
        _obj.rotation.set(fRot[i * 3], fRot[i * 3 + 1], fRot[i * 3 + 2])
        _obj.scale.setScalar(fSize[i])
        _obj.updateMatrix()
        falling.setMatrixAt(i, _obj.matrix)
      }
    }

    const shedFor = (dt) => {
      spawnAcc += dt * cfg.fall.spawnPerSecond
      while (spawnAcc >= 1) {
        spawnAcc -= 1
        shedAmbient()
      }
    }

    const warmUp = () => {
      if (warmed || !sized || optsRef.current.paused || optsRef.current.leavesPaused) return
      warmed = true
      const step = cfg.fall.warmUpStep
      const travel = (dyn.pageTopY - dyn.bottomY) / Math.max(1e-4, dyn.fallSpeed)
      const steps = Math.min(800, Math.ceil(travel / step))
      for (let i = 0; i < steps; i++) {
        shedFor(step)
        stepFalling(step, (i - steps) * step)
      }
      falling.instanceMatrix.needsUpdate = true
      alphaAttr.needsUpdate = true
    }

    const ro = new ResizeObserver(layout)
    ro.observe(host)
    ro.observe(document.body)
    const onWinResize = () => layout()
    window.addEventListener('resize', onWinResize)
    layout()
    warmUp()

    const onSettled = () => {
      layout()
      warmUp()
    }
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onSettled)
    }
    document.fonts?.ready?.then(onSettled)
    const settleTimers = [setTimeout(onSettled, 1000), setTimeout(onSettled, 3000)]

    const timer = new THREE.Timer()
    timer.connect(document)
    let raf = 0
    let running = true
    let wasFallIdle = false

    const tick = () => {
      if (!running) return
      raf = requestAnimationFrame(tick)
      timer.update()
      const dt = Math.min(0.05, timer.getDelta())
      const t = timer.getElapsed()
      const idle = optsRef.current.paused
      const fallIdle = idle || optsRef.current.leavesPaused
      if (!sized) return

      if (fallIdle && !wasFallIdle) {
        clearFalling()
      }
      if (!fallIdle && wasFallIdle) {
        warmed = false
        spawnAcc = 0
      }
      wasFallIdle = fallIdle
      warmUp()

      if (!idle) {
        root.rotation.z = Math.sin(t * cfg.canopy.swaySpeed) * cfg.canopy.swayAmount
        root.rotation.x =
          Math.sin(t * cfg.canopy.swaySpeed * 0.7 + 1.3) * cfg.canopy.swayAmount * 0.5
        root.updateMatrixWorld(true)

        const sa = cfg.canopy.shimmerAmount
        for (let i = 0; i < N; i++) {
          const p = aPhase[i] + t * cfg.canopy.shimmerSpeed
          const s = Math.sin(p)
          _obj.position.set(
            aBase[i * 3] + s * 0.008,
            aBase[i * 3 + 1] + Math.cos(p * 0.8) * 0.006,
            aBase[i * 3 + 2] + Math.cos(p) * 0.008
          )
          _obj.rotation.set(
            aRot[i * 3] + s * sa,
            aRot[i * 3 + 1] + Math.cos(p * 1.3) * sa,
            aRot[i * 3 + 2] + s * sa * 0.6
          )
          _obj.scale.setScalar(aSize[i] * (1 + s * 0.07))
          _obj.updateMatrix()
          attached.setMatrixAt(i, _obj.matrix)
        }
        attached.instanceMatrix.needsUpdate = true
      }

      if (!fallIdle) {
        shedFor(dt)
        stepFalling(dt, t)
        falling.instanceMatrix.needsUpdate = true
        alphaAttr.needsUpdate = true
      }

      const drift = idle ? 0 : cfg.camera.driftAmount
      camera.position.set(
        baseCam.x + Math.sin(t * cfg.camera.driftSpeed) * drift,
        baseCam.y -
          scrollTop() * dyn.unitsPerPx +
          Math.cos(t * cfg.camera.driftSpeed * 0.8) * drift * 0.6,
        baseCam.z
      )

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      timer.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', onWinResize)
      window.removeEventListener('load', onSettled)
      settleTimers.forEach(clearTimeout)
      document.removeEventListener('pointerdown', onPointerDown)

      attached.dispose()
      falling.dispose()
      scene.traverse((o) => {
        if (o.isMesh || o.isInstancedMesh) {
          if (o.geometry) o.geometry.dispose()
        }
      })
      geometries.forEach((g) => g.dispose())
      disposables.forEach((d) => d.dispose && d.dispose())
      renderer.dispose()
      renderer.forceContextLoss?.()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [interactive, preserveDrawingBuffer])

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        background: 'none',
        overflow: 'hidden',
        ...style,
      }}
    />
  )
}
