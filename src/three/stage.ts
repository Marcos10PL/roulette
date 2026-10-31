import * as THREE from 'three'
import { CAMERA } from './constants'

const PHONE_WIDTH = 640
const PARTICLE_COUNT = 50
const MIN_FULL_WHEEL_ASPECT = 0.93

const profileFor = (width: number) =>
  width < PHONE_WIDTH ? CAMERA.MOBILE : CAMERA.DESKTOP

export const createStage = (container: HTMLElement) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

  let profile = profileFor(container.clientWidth || window.innerWidth)

  camera.position.set(0, 10, profile.REST)
  camera.lookAt(0, profile.LOOK_Y, 0)

  // point light
  const pointLight = new THREE.PointLight(0xffffff, 1500)
  pointLight.position.set(0, 5, 40)
  scene.add(pointLight)

  // particles
  const particleGeometry = new THREE.SphereGeometry(0.06, 8, 8)
  const particleMaterial = new THREE.MeshPhongMaterial({ color: 0xfefefe })
  const particles: THREE.Mesh[] = []

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial)

    particle.position.x = (Math.random() - 0.5) * 100
    particle.position.y = (Math.random() - 0.5) * 100
    particle.position.z = (Math.random() - 0.5) * 35

    scene.add(particle)
    particles.push(particle)
  }

  const resize = () => {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return

    const next = profileFor(clientWidth)
    if (camera.position.z === profile.REST) camera.position.z = next.REST
    profile = next
    camera.lookAt(0, profile.LOOK_Y, 0)

    camera.aspect = clientWidth / clientHeight
    camera.zoom = Math.min(1, camera.aspect / MIN_FULL_WHEEL_ASPECT)
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera)

    particles.forEach((particle) => {
      particle.position.y += 0.02
      if (particle.position.y > 40) particle.position.y = -30
    })
  })

  const dispose = () => {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()

    particleGeometry.dispose()
    particleMaterial.dispose()

    renderer.dispose()
    renderer.domElement.remove()
  }

  return { scene, camera, getProfile: () => profile, dispose }
}
