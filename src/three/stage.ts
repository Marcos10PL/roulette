import * as THREE from 'three'

const PARTICLE_COUNT = 250
const MIN_FULL_WHEEL_ASPECT = 0.93

export const createStage = (container: HTMLElement) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.set(0, 10, 40)
  camera.lookAt(0, 0, 0)

  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshPhongMaterial({ color: '#f53333', side: THREE.DoubleSide }),
  )
  floor.rotation.x = Math.PI / 2
  floor.position.y = -4
  scene.add(floor)

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
    particle.position.z = (Math.random() - 0.5) * 40

    scene.add(particle)
    particles.push(particle)
  }

  const resize = () => {
    const { clientWidth, clientHeight } = container
    if (!clientWidth || !clientHeight) return

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

    floor.geometry.dispose()
    floor.material.dispose()
    particleGeometry.dispose()
    particleMaterial.dispose()

    renderer.dispose()
    renderer.domElement.remove()
  }

  return { scene, camera, dispose }
}
