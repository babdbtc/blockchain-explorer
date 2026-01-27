"use client"
import { useEffect, useRef } from "react"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let scene: any, camera: any, renderer: any, controls: any
    let frameId: number | null = null

    const initThree = async () => {
      const THREE = await import("three")
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js")

      // Basic setup
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000)
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2))
      renderer.setClearColor(0x000000)

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement)
      }

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableRotate = true
      controls.enableZoom = false // We handle zoom manually for smoothness
      controls.enablePan = false
      controls.maxDistance = 500
      controls.minDistance = 0.1
      controls.enableDamping = true // Enable smooth damping
      controls.dampingFactor = 0.03 // Lower = smoother (0.05 is nice and smooth)
      controls.rotateSpeed = 0.8 // Slightly reduce rotation speed for better control
      controls.zoomSpeed = 0.5 // Slower zoom for smoother experience

      // Camera
      camera.position.z = 15
      camera.position.y = -3

      // --- Custom Smooth Zoom ---
      let targetZoomDistance = 15
      const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        const zoomSensitivity = 0.001
        const zoomFactor = Math.exp(e.deltaY * zoomSensitivity)
        targetZoomDistance *= zoomFactor
        targetZoomDistance = Math.max(controls.minDistance, Math.min(controls.maxDistance, targetZoomDistance))
      }
      renderer.domElement.addEventListener("wheel", onWheel, { passive: false })

      // --- UTIL: Circle texture for point sprites ---
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")!
      ctx.beginPath()
      ctx.arc(16, 16, 16, 0, 2 * Math.PI)
      ctx.fillStyle = "white"
      ctx.fill()
      const circleTexture = new THREE.CanvasTexture(canvas)
      circleTexture.minFilter = THREE.LinearFilter
      circleTexture.magFilter = THREE.LinearFilter
      circleTexture.generateMipmaps = false
      circleTexture.wrapS = THREE.ClampToEdgeWrapping
      circleTexture.wrapT = THREE.ClampToEdgeWrapping
      circleTexture.premultiplyAlpha = true
      circleTexture.needsUpdate = true

      // --- Starfield ---
      const starGeometry = new THREE.BufferGeometry()
      const starVertices: number[] = []
      for (let i = 0; i < 10000; i++) {
        starVertices.push(
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(4000),
        )
      }
      starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        map: circleTexture,
        transparent: true,
        blending: THREE.NormalBlending,
        alphaTest: 0.5,
        depthWrite: false,
      })
      const stars = new THREE.Points(starGeometry, starMaterial)
      scene.add(stars)

      // --- Easter Egg Floating Texts ---
      const easterEggTexts = [
        "stack sats",
        "Don't trust, verify!",
        "Not your keys, not your coins!",
        "Fix the money, Fix the world",
        "21 Million",
        "tick tock, next block",
        "Defund The State",
        "no state is the best state",
        "Open-source everything",
        "21M / ∞",
        "Privacy is not a crime",
        "1 BTC = 1 BTC",
        "#EndTheFed",
        "#EndTheECB",
        "activism.net/cypherpunk/manifesto.html",
        "Run your own node!",
        "Sound money",
        "Inflation is theft",
        "Cantillon was right",
        "Proof of Work",
        "Taxation is armed robbery",
        "The seperation of money and state",
        "DON'T TREAD ON ME",
        "Anarcho-capitalism is inevitable",
        "Read Rothbard",
        "Read Hoppe",
        "Bitcoin fixes this!",
        "Anonymize your coins",
        "Cashu brings Chaumian dreams back",
        "Non-KYC",
        "Black Markets Matter",
        "Practice Agorism",
        "Be the counter-economy",
        "Regulate THIS!",
        "Don't impose democracy on me!",
        "Use blind signatures!",
        // Cypherpunk quotes with authors
        "A specter is haunting the modern world,\nthe specter of crypto anarchy.\n— Tim May",
        "Strong cryptography can resist an unlimited\namount of violence. No amount of coercive force\nwill ever solve a math problem.\n— Tim May",
        "Privacy is necessary for an open\nsociety in the electronic age.\n— Eric Hughes",
        "Cypherpunks write code.\n— Eric Hughes",
        "Privacy is not secrecy. Privacy is the power\nto selectively reveal oneself to the world.\n— Eric Hughes",
        "We cannot expect governments, corporations,\nor other large, faceless organizations to grant\nus privacy out of their beneficence.\n— Eric Hughes",
        "If privacy is outlawed,\nonly outlaws will have privacy.\n— Philip Zimmermann",
        "Trusted third parties are security holes.\n— Nick Szabo",
        "The Net interprets censorship\nas damage and routes around it.\n— John Gilmore",
        "Arguing that you don't care about privacy\nbecause you have nothing to hide is no different\nthan saying you don't care about free speech\nbecause you have nothing to say.\n— Edward Snowden",
        "Encryption works. Properly implemented\nstrong crypto systems are one of the few\nthings that you can rely on.\n— Edward Snowden",
        "Security is a process, not a product.\n— Bruce Schneier",
        "Cryptography is the last defense of liberty\nin a world of total surveillance.\n— Bruce Schneier",
        "I'd like to think that decades from now,\npeople will look back and see this time as\nthe dawning of a new era of individual\nempowerment and freedom.\n— Hal Finney",
        "Bitcoin seems to be a very promising idea.\n— Hal Finney",
        "Talk is cheap. Show me the code.\n— Linus Torvalds",
        "Information is power. But like all power,\nthere are those who want to keep\nit for themselves.\n— Aaron Swartz",
        "Cryptography is the ultimate form\nof non-violent direct action.\n— Julian Assange",
        "Every time we witness an injustice\nand do not act, we train our character\nto be passive in its presence.\n— Julian Assange",
        "I am fascinated by Tim May's crypto-anarchy.\nIn a crypto-anarchy the government is\npermanently forbidden and permanently unnecessary.\n— Wei Dai",
        "Public key cryptography is a revolution\nthat puts control of privacy into\nthe hands of the individual.\n— Whitfield Diffie",
        "WE STAND TODAY on the brink\nof a revolution in cryptography.\n— Diffie & Hellman",
        "A cashless economy is\na surveillance economy.\n— Jerry Brito",
        "Cash is an escape valve in our increasingly\nintermediated and surveilled world.\n— Jerry Brito",
        "The keyboard is the great equalizer.\n— St. Jude",
        "Cryptography rearranges power: it configures\nwho can do what, from what. This makes\ncryptography an inherently political tool.\n— Phillip Rogaway",
        "Bitcoin is a tool of resistance\ngifted to us by Satoshi.\n— Amir Taaki",
        "Fundamentally, I believe we will have the kind\nof society that most people want. If we want\nfreedom and privacy, we must persuade others\nthat these are worth having.\n— Hal Finney",
        "Cryptography can make possible a world in\nwhich people have control over information\nabout themselves, not because government has\ngranted them that control, but because only\nthey possess the cryptographic keys.\n— Hal Finney",
        "I wanted to empower people to make\ntheir own choices, to pursue\ntheir own happiness.\n— Ross Ulbricht",
        "Free software is a matter of liberty,\nnot price. Think of 'free' as in\n'free speech,' not as in 'free beer.'\n— Richard Stallman",
        "Bitcoin isn't just money for the internet.\nIt's a new form of money that is\nnative to the internet.\n— Andreas Antonopoulos"
      ]

      const textSprites: any[] = []

      const createTextSprite = (text: string) => {
        const fontface = "Arial"
        const fontsize = 24
        const lineHeight = fontsize * 1.3
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!

        // Split text into lines
        const lines = text.split("\n")

        // Measure max line width
        context.font = "Bold " + fontsize + "px " + fontface
        let maxWidth = 0
        for (const line of lines) {
          const metrics = context.measureText(line)
          maxWidth = Math.max(maxWidth, metrics.width)
        }

        // Resize canvas to fit all lines
        canvas.width = maxWidth + 40
        canvas.height = lines.length * lineHeight + 20

        // Draw each line
        context.font = "Bold " + fontsize + "px " + fontface
        context.fillStyle = "rgba(255, 255, 255, 0.4)" // Subtle white
        context.textAlign = "center"
        context.textBaseline = "middle"

        const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2
        lines.forEach((line, i) => {
          context.fillText(line, canvas.width / 2, startY + i * lineHeight)
        })

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter

        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })

        const sprite = new THREE.Sprite(spriteMaterial)
        // Scale sprite to maintain aspect ratio but keep it relatively small
        const scale = 10
        const baseScaleX = scale * (canvas.width / canvas.height)
        const baseScaleY = scale
        sprite.scale.set(baseScaleX, baseScaleY, 1)

        // Store base scale and current scale factor for hover animation
        sprite.userData = {
          baseScaleX,
          baseScaleY,
          currentScale: 1,
          targetScale: 1,
          isMultiLine: lines.length > 1,
          text: text
        }

        return sprite
      }

      // Create sprites for each text
      easterEggTexts.forEach(text => {
        const sprite = createTextSprite(text)

        // Random position within starfield bounds
        sprite.position.set(
          THREE.MathUtils.randFloatSpread(1500),
          THREE.MathUtils.randFloatSpread(1500),
          THREE.MathUtils.randFloatSpread(3000)
        )

        scene.add(sprite)
        textSprites.push(sprite)
      })

      // Raycaster for text sprite hover detection
      const textRaycaster = new THREE.Raycaster()
      // Increase the raycaster threshold for sprites
      textRaycaster.params.Sprite = { threshold: 10 }
      let hoveredSprite: any = null

      // Quote modal overlay
      const quoteModal = document.createElement("div")
      quoteModal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 1000;
        cursor: pointer;
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.2s ease;
      `
      const quoteContent = document.createElement("div")
      quoteContent.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        font-family: Arial, sans-serif;
        font-size: clamp(18px, 4vw, 32px);
        text-align: center;
        padding: 40px;
        max-width: 800px;
        line-height: 1.6;
        white-space: pre-line;
      `
      const closeHint = document.createElement("div")
      closeHint.style.cssText = `
        color: rgba(255, 255, 255, 0.3);
        font-family: Arial, sans-serif;
        font-size: 14px;
        margin-top: 40px;
      `
      closeHint.textContent = "click anywhere to close"
      quoteModal.appendChild(quoteContent)
      quoteModal.appendChild(closeHint)
      document.body.appendChild(quoteModal)

      // Modal show/hide helpers
      let modalVisible = false
      const showModal = (text: string) => {
        quoteContent.textContent = text
        quoteModal.style.display = "flex"
        requestAnimationFrame(() => {
          quoteModal.style.opacity = "1"
        })
        modalVisible = true
      }
      const hideModal = () => {
        quoteModal.style.opacity = "0"
        modalVisible = false
        setTimeout(() => {
          if (!modalVisible) quoteModal.style.display = "none"
        }, 200)
      }

      // Close modal on click
      quoteModal.addEventListener("click", hideModal)

      // Close modal on escape key
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") hideModal()
      }
      window.addEventListener("keydown", onKeyDown)

      // Click handler for quote sprites
      const onQuoteClick = (e: MouseEvent) => {
        if (modalVisible) return

        const rect = renderer.domElement.getBoundingClientRect()
        const clickNdc = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        )

        textRaycaster.setFromCamera(clickNdc, camera)
        const intersects = textRaycaster.intersectObjects(textSprites)

        if (intersects.length > 0) {
          const clickedSprite = intersects[0].object as any
          showModal(clickedSprite.userData.text)
        }
      }
      renderer.domElement.addEventListener("click", onQuoteClick)

      // --- Planet (point cloud) ---
      const numParticles = 5000
      const sphereRadius = 5
      const planetGeometry = new THREE.BufferGeometry()
      const positions = new Float32Array(numParticles * 3)
      const colors = new Float32Array(numParticles * 3)
      const baseColors = new Float32Array(numParticles * 3) // Store original colors
      const particleVelocities = new Float32Array(numParticles * 3) // For wobble effect

      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const angleIncrement = Math.PI * 2 * goldenRatio

      for (let i = 0; i < numParticles; i++) {
        const t = i / numParticles
        const inclination = Math.acos(1 - 2 * t)
        const azimuth = angleIncrement * i
        const x = sphereRadius * Math.sin(inclination) * Math.cos(azimuth)
        const y = sphereRadius * Math.sin(inclination) * Math.sin(azimuth)
        const z = sphereRadius * Math.cos(inclination)

        const ix = i * 3
        positions[ix] = x
        positions[ix + 1] = y
        positions[ix + 2] = z

        const intensity = (z / sphereRadius + 1) / 2
        const color = 1.0 - (1 - intensity) * 0.5
        colors[ix] = color
        colors[ix + 1] = color * 0.4
        colors[ix + 2] = 0

        // Store base colors for animation
        baseColors[ix] = color
        baseColors[ix + 1] = color * 0.4
        baseColors[ix + 2] = 0

        // Initialize random velocities for wobble effect
        particleVelocities[ix] = (Math.random() - 0.5) * 2
        particleVelocities[ix + 1] = (Math.random() - 0.5) * 2
        particleVelocities[ix + 2] = (Math.random() - 0.5) * 2
      }

      planetGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      planetGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const planetMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        map: circleTexture,
        transparent: true,
        blending: THREE.NormalBlending,
        alphaTest: 0.5,
        depthWrite: true,
      })

      const initialYaw = 0.18
      const initialPitch = -0.12

      const planet = new THREE.Points(planetGeometry, planetMaterial)
      scene.add(planet)
      planet.rotation.set(initialPitch, initialYaw, 0)

      // --- GLOW sphere ---
      const glowGeometry = new THREE.SphereGeometry(sphereRadius * 1.2, 32, 32)
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          spinFactor: { value: 1.0 },
          cursorProximity: { value: 0.0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float spinFactor;
          uniform float cursorProximity;
          varying vec3 vNormal;
          void main() {
            vec3 n = normalize(vNormal);
            float d = max(0.0, 0.7 - n.z);

            // Pulsing effect only when spinning faster (pressed), but slower
            float pulse = 1.0;
            if (spinFactor > 1.1) {
              pulse = 0.9 + 0.1 * sin(time * 1.5);
            }

            // Cursor proximity brightness (0.5 = far, 1.0 = at center)
            float proximityBoost = cursorProximity;

            // Intensity boost when spinning faster
            float boost = 0.5 + 0.5 * (spinFactor - 1.0);
            float intensity = d * d * pulse * proximityBoost * (1.0 + boost * 0.6);

            // Shift to hotter colors when spinning faster
            float heatShift = (spinFactor - 1.0) * 0.5;
            vec3 glow = vec3(1.0, 0.4 - heatShift * 0.2, 0.0) * intensity;

            gl_FragColor = vec4(glow, intensity * 0.4);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: true,
      })
      const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
      scene.add(glowSphere)
      glowSphere.rotation.set(initialPitch, initialYaw, 0)

      // --- Text group (points + wireframe) ---
      // Helper function to generate high-quality text geometry
      function generateTextGeometry(text: string, fontSize: number, canvasWidth: number, canvasHeight: number, depthLayers: number = 1) {
        const canvas = document.createElement("canvas")
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        const ctx = canvas.getContext("2d")!

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        ctx.fillStyle = "#ff9900"

        // Official Bitcoin logo SVG path data
        const bitcoinPath = "M217.021,167.042c18.631-9.483,30.288-26.184,27.565-54.007c-3.667-38.023-36.526-50.773-78.006-54.404l-0.008-52.741 h-32.139l-0.009,51.354c-8.456,0-17.076,0.166-25.657,0.338L108.76,5.897l-32.11-0.003l-0.006,52.728 c-6.959,0.142-13.793,0.277-20.466,0.277v-0.156l-44.33-0.018l0.006,34.282c0,0,23.734-0.446,23.343-0.013 c13.013,0.009,17.262,7.559,18.484,14.076l0.01,60.083v84.397c-0.573,4.09-2.984,10.625-12.083,10.637 c0.414,0.364-23.379-0.004-23.379-0.004l-6.375,38.335h41.817c7.792,0.009,15.448,0.13,22.959,0.19l0.028,53.338l32.102,0.009 l-0.009-52.779c8.832,0.18,17.357,0.258,25.684,0.247l-0.009,52.532h32.138l0.018-53.249c54.022-3.1,91.842-16.697,96.544-67.385 C266.916,192.612,247.692,174.396,217.021,167.042z M109.535,95.321c18.126,0,75.132-5.767,75.14,32.064 c-0.008,36.269-56.996,32.032-75.14,32.032V95.321z M109.521,262.447l0.014-70.672c21.778-0.006,90.085-6.261,90.094,35.32 C199.638,266.971,131.313,262.431,109.521,262.447z"

        // Handle text with Bitcoin symbol
        if (text.includes("₿")) {
          // For "₿abd" or just "₿"
          const bitcoinIndex = text.indexOf("₿")
          const beforeBitcoin = text.substring(0, bitcoinIndex)
          const afterBitcoin = text.substring(bitcoinIndex + 1)

          ctx.font = `bold ${fontSize}px arial`
          ctx.textBaseline = "middle"

          // Calculate total width for centering
          const beforeWidth = beforeBitcoin ? ctx.measureText(beforeBitcoin).width : 0
          const afterWidth = afterBitcoin ? ctx.measureText(afterBitcoin).width : 0

          // Make Bitcoin B smaller when it's part of text (like "Babd"), larger when standalone
          const isStandalone = !beforeBitcoin && !afterBitcoin
          const bitcoinScale = isStandalone ? 1.0 : 0.82 // Slightly smaller B in "Babd"
          const bitcoinWidth = fontSize * 0.95 * bitcoinScale
          const totalWidth = beforeWidth + bitcoinWidth + afterWidth

          let currentX = centerX - totalWidth / 2

          // Draw text before Bitcoin symbol
          if (beforeBitcoin) {
            ctx.textAlign = "left"
            ctx.fillText(beforeBitcoin, currentX, centerY)
            currentX += beforeWidth
          }

          // Draw Bitcoin logo using SVG path
          ctx.save()
          const path = new Path2D(bitcoinPath)
          const svgSize = 280
          const scale = (fontSize / svgSize) * bitcoinScale
          const pathCenterX = 138.5
          const pathCenterY = isStandalone ? 180 : 185 // Adjusted vertical positioning

          ctx.translate(currentX + (bitcoinWidth / 2) - (pathCenterX * scale), centerY - (pathCenterY * scale))
          ctx.scale(scale, scale)
          ctx.fill(path)
          ctx.restore()

          currentX += bitcoinWidth

          // Draw text after Bitcoin symbol
          if (afterBitcoin) {
            ctx.textAlign = "left"
            ctx.fillText(afterBitcoin, currentX, centerY)
          }
        } else {
          // Use font for other text
          ctx.font = `bold ${fontSize}px arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(text, centerX, centerY)
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const pointsArr: number[] = []
        const lineIndices: number[] = []
        const pointMap = new Map<string, number>()
        const scale = 0.02
        const sampling = 3 // Fine sampling for high quality
        const layerDepth = 0.15

        for (let d = 0; d < depthLayers; d++) {
          const pz = (d - (depthLayers - 1) / 2) * layerDepth

          for (let y = 0; y < canvas.height; y += sampling) {
            for (let x = 0; x < canvas.width; x += sampling) {
              if (imageData[(y * canvas.width + x) * 4 + 3] > 128) {
                const index = pointsArr.length / 3
                pointsArr.push((x - canvas.width / 2) * scale, (canvas.height / 2 - y) * scale, pz)
                pointMap.set(`${x},${y},${d}`, index)
              }
            }
          }
        }

        // Build wireframe connections
        for (let d = 0; d < depthLayers; d++) {
          for (let y = 0; y < canvas.height; y += sampling) {
            for (let x = 0; x < canvas.width; x += sampling) {
              const currentKey = `${x},${y},${d}`
              if (pointMap.has(currentKey)) {
                const currentIndex = pointMap.get(currentKey)!
                const neighbors = [
                  `${x + sampling},${y},${d}`,
                  `${x},${y + sampling},${d}`,
                  `${x + sampling},${y + sampling},${d}`,
                  `${x - sampling},${y + sampling},${d}`,
                ]
                for (const neighborKey of neighbors) {
                  if (pointMap.has(neighborKey)) {
                    lineIndices.push(currentIndex, pointMap.get(neighborKey)!)
                  }
                }
                // Connect depth layers
                if (d < depthLayers - 1) {
                  const nextLayerKey = `${x},${y},${d + 1}`
                  if (pointMap.has(nextLayerKey)) {
                    lineIndices.push(currentIndex, pointMap.get(nextLayerKey)!)
                  }
                }
              }
            }
          }
        }

        return { positions: new Float32Array(pointsArr), lineIndices }
      }

      // Generate both text variants with proper quality
      const babdGeom = generateTextGeometry("₿abd", 70, 512, 128, 3)
      const bitcoinGeom = generateTextGeometry("₿", 160, 512, 512, 3)

      // Create unified geometry that can hold both
      const maxPoints = Math.max(babdGeom.positions.length / 3, bitcoinGeom.positions.length / 3)
      const textPositions = new Float32Array(maxPoints * 3)
      const textColors = new Float32Array(maxPoints * 3)
      const textOpacities = new Float32Array(maxPoints)

      // Initialize with Babd positions
      for (let i = 0; i < babdGeom.positions.length; i++) {
        textPositions[i] = babdGeom.positions[i]
      }

      // Initialize colors with gradient
      for (let i = 0; i < maxPoints; i++) {
        const i3 = i * 3
        // Default orange color
        textColors[i3] = 1.0     // R
        textColors[i3 + 1] = 0.6 // G
        textColors[i3 + 2] = 0.0 // B
        textOpacities[i] = i < babdGeom.positions.length / 3 ? 1.0 : 0.0
      }

      const textGeometry = new THREE.BufferGeometry()
      textGeometry.setAttribute("position", new THREE.BufferAttribute(textPositions, 3))
      textGeometry.setAttribute("color", new THREE.BufferAttribute(textColors, 3))
      textGeometry.setAttribute("opacity", new THREE.BufferAttribute(textOpacities, 1))
      textGeometry.setIndex(babdGeom.lineIndices)

      const pointsMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        map: circleTexture,
        transparent: true,
        blending: THREE.NormalBlending,
        opacity: 1.0,
        depthWrite: true,
      })
      const textPoints = new THREE.Points(textGeometry, pointsMaterial)

      const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0 })
      const textLines = new THREE.LineSegments(textGeometry, lineMaterial)

      const textGroup = new THREE.Group()
      textGroup.add(textPoints)
      textGroup.add(textLines)
      scene.add(textGroup)
      textGroup.rotation.set(initialPitch, initialYaw, 0)

      // Store particle velocities for physics effect
      const textParticleVelocities = new Float32Array(maxPoints * 3)
      for (let i = 0; i < maxPoints * 3; i++) {
        textParticleVelocities[i] = (Math.random() - 0.5) * 0.15
      }

      // Track text morph state
      let textMorphFactor = 0

      // --- Reusable objects ---
      const _tmpAxis = new THREE.Vector3()
      const _tmpQuat = new THREE.Quaternion()

      // =============================
      // Magnetic bend (continuous outside→surface)
      // + Press-to-compress (SMOOTH)
      // =============================
      const basePositions = positions.slice(0) // immutable local-space base

      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2()
      let pointerActive = false
      let globalCursorX = 0
      let globalCursorY = 0
      let hasCursorMoved = false

      // Tunables
      const influenceRadius = 4.0
      const strength = 0.32
      const hoverReach = 40.0       // how far outside still influences (world)
      const maxOutward = 2.2        // max outward offset (world)
      const tentSharpness = 1.0     // triangular peak sharpness

      // Press-to-compress tunables
      const compressionScaleActive = 0.72 // target radius while pressed
      const compressionEasePress = 0.25   // approach rate toward compressed
      const compressionEaseRelease = 0.18 // approach rate back to normal
      const spinBoostTarget = 2.2         // ↓ reduced spin multiplier while pressed
      const spinEase = 0.18               // easing for spin factor

      let deformAlpha = 0
      const magnetLocal = new THREE.Vector3(0, 0, sphereRadius)
      const magnetWorldTarget = new THREE.Vector3()
      let magnetActive = false

      // Smooth “outward intensity” that peaks outside and goes to ~0 at the surface
      let outwardAlpha = 0

      // Press-to-compress state
      let compressionActive = false
      let wasCompressed = false         // Track previous compression state for ripple
      let compressionFactor = 1.0       // animated radius scale (smooth)
      let spinSpeedFactor = 1.0         // animated spin multiplier (smooth)
      let rippleTime = -999             // Time when ripple started
      const rippleDuration = 1.5        // Ripple wave duration in seconds

      // Planet physics drag state
      let isDraggingPlanet = false
      let lastPointerX = 0
      let lastPointerY = 0
      let dragVelocityX = 0
      let dragVelocityY = 0
      let angularVelocity = new THREE.Vector3(0, 0, 0) // Current rotational velocity
      const dampingFactor = 0.975 // How quickly rotation slows down (closer to 1 = slower dampening)

      // Reusable vectors
      const vCenterW = new THREE.Vector3()
      const vO = new THREE.Vector3()
      const vD = new THREE.Vector3()
      const vOC = new THREE.Vector3()
      const vClosest = new THREE.Vector3()
      const vDir = new THREE.Vector3()
      const vHit = new THREE.Vector3()
      const vSurface = new THREE.Vector3()

      let lastMouseMoveTime = 0

      function onGlobalPointerMove(e: PointerEvent) {
        globalCursorX = e.clientX
        globalCursorY = e.clientY
        hasCursorMoved = true
        lastMouseMoveTime = performance.now()

        if (renderer && renderer.domElement) {
          const rect = renderer.domElement.getBoundingClientRect()
          ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
          ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
          pointerActive = true
        }

        // Track drag velocity if dragging the planet
        if (isDraggingPlanet) {
          dragVelocityX = e.clientX - lastPointerX
          dragVelocityY = e.clientY - lastPointerY
          lastPointerX = e.clientX
          lastPointerY = e.clientY
        }
      }
      function onPointerLeave() {
        pointerActive = false
        magnetActive = false
        compressionActive = false
        isDraggingPlanet = false
        controls.enabled = true // Re-enable camera controls
      }

      function onMouseOut(e: MouseEvent) {
        if (!e.relatedTarget) {
          onPointerLeave()
        }
      }

      // PRESS-TO-COMPRESS: enable only if clicking the sphere surface
      function onPointerDown(e: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect()
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(ndc, camera)

        vCenterW.setFromMatrixPosition(planet.matrixWorld)
        const sphere = new THREE.Sphere(vCenterW, sphereRadius)
        const hit = raycaster.ray.intersectSphere(sphere, vHit)
        if (hit) {
          compressionActive = true
          isDraggingPlanet = true
          lastPointerX = e.clientX
          lastPointerY = e.clientY
          dragVelocityX = 0
          dragVelocityY = 0
          controls.enabled = false // Disable camera controls when dragging planet
        }
      }
      function onPointerUp() {
        compressionActive = false

        if (isDraggingPlanet) {
          // Apply drag velocity as angular velocity
          const sensitivity = 0.005 // How much drag affects rotation
          angularVelocity.set(
            -dragVelocityY * sensitivity,
            dragVelocityX * sensitivity,
            0
          )
          isDraggingPlanet = false
          controls.enabled = true // Re-enable camera controls
        }
      }

      window.addEventListener("pointermove", onGlobalPointerMove)
      document.addEventListener("pointerleave", onPointerLeave)
      document.addEventListener("mouseout", onMouseOut)
      renderer.domElement.addEventListener("pointerdown", onPointerDown)
      window.addEventListener("pointerup", onPointerUp)

      // Triangular "tent" curve with peak at u=0.5, zero at u=0 and u=1
      function tent01(u: number) {
        const x = Math.max(0, Math.min(1, u))
        const t = 1 - 2 * Math.abs(x - 0.5) // 0..1..0
        return Math.pow(t, tentSharpness)
      }

      function updateMagnetFromRay() {
        const isAfk = (performance.now() - lastMouseMoveTime) > 3000

        if (!pointerActive || isAfk) {
          magnetActive = false
          outwardAlpha += (0 - outwardAlpha) * 0.15
          return
        }

        raycaster.setFromCamera(ndc, camera)
        vCenterW.setFromMatrixPosition(planet.matrixWorld)
        const sphere = new THREE.Sphere(vCenterW, sphereRadius)

        // Compute closest point on the ray to the sphere center
        vO.copy(raycaster.ray.origin)
        vD.copy(raycaster.ray.direction)
        vOC.subVectors(vCenterW, vO)
        const t = Math.max(vOC.dot(vD), 0)             // forward along the ray
        vClosest.copy(vO).addScaledVector(vD, t)
        let d = vClosest.distanceTo(vCenterW)          // distance from center at closest approach

        // Detect if we actually hit the sphere
        const hit = raycaster.ray.intersectSphere(sphere, vHit) ?? null

        // Direction from center
        if (hit) {
          vDir.copy(vHit).sub(vCenterW).normalize()
          vSurface.copy(vHit)
          d = sphereRadius // enforce continuity
        } else {
          vDir.subVectors(vClosest, vCenterW)
          const len = vDir.length()
          if (len > 1e-6) vDir.multiplyScalar(1 / len)
          else vDir.set(0, 0, 1).applyQuaternion(planet.getWorldQuaternion(new THREE.Quaternion())).normalize()
          vSurface.copy(vCenterW).addScaledVector(vDir, sphereRadius)
        }

        const withinHover = d <= sphereRadius + 2000.0 // Active over whole site
        magnetActive = withinHover || !!hit

        const u = Math.max(0, Math.min(1, (d - sphereRadius) / hoverReach))
        const targetOutward = tent01(u)
        outwardAlpha += (targetOutward - outwardAlpha) * 0.25

        const outward = maxOutward * outwardAlpha
        magnetWorldTarget.copy(vSurface).addScaledVector(vDir, outward)
      }

      // --- Animation loop ---
      function animate() {
        frameId = requestAnimationFrame(animate)
        const t = performance.now() * 0.001

        // Update sticky target (continuous outside → surface)
        updateMagnetFromRay()

        // Calculate cursor proximity to planet center for glow intensity
        let cursorProximity = 0.5 // Default minimum glow (50%)
        if (hasCursorMoved) {
          // Get planet center in screen space
          vCenterW.setFromMatrixPosition(planet.matrixWorld)
          const planetScreenPos = vCenterW.clone().project(camera)

          // Convert planet screen position from NDC to pixel coordinates
          const planetScreenX = (planetScreenPos.x * 0.5 + 0.5) * window.innerWidth
          const planetScreenY = (-planetScreenPos.y * 0.5 + 0.5) * window.innerHeight

          // Calculate distance from global cursor to planet center in pixels
          const dx = globalCursorX - planetScreenX
          const dy = globalCursorY - planetScreenY
          const distFromCenter = Math.sqrt(dx * dx + dy * dy)

          // Convert to proximity: 1 at center, 0.5 at far distance
          // Use screen diagonal as max distance
          const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
          const normalizedDist = Math.min(distFromCenter / maxDist, 1)

          // Map from [0, 1] distance to [1.0, 0.5] proximity (inverted, with 50% minimum)
          cursorProximity = 1.0 - normalizedDist * 0.5
        }

        // Update glow shader uniform
        ; (glowMaterial.uniforms as any).cursorProximity.value = cursorProximity

        // Ease compression factor toward target
        const targetCompression = compressionActive ? compressionScaleActive : 1.0
        const compEase = compressionActive ? compressionEasePress : compressionEaseRelease
        compressionFactor += (targetCompression - compressionFactor) * compEase

        // Ease spin speed toward target
        const targetSpin = compressionActive ? spinBoostTarget : 1.0
        spinSpeedFactor += (targetSpin - spinSpeedFactor) * spinEase

        // Apply physics-based rotation from drag
        if (isDraggingPlanet) {
          // Apply rotation based on current drag velocity (immediate feedback)
          if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
            const sensitivity = 0.01
            _tmpAxis.set(-dragVelocityY, dragVelocityX, 0).normalize()
            const dragAngle = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY) * sensitivity
            _tmpQuat.setFromAxisAngle(_tmpAxis, dragAngle)
            planet.quaternion.multiply(_tmpQuat)
          }
        } else if (angularVelocity.lengthSq() > 0.00001) {
          // Apply momentum-based rotation after release
          const angle = angularVelocity.length()
          _tmpAxis.copy(angularVelocity).normalize()
          _tmpQuat.setFromAxisAngle(_tmpAxis, angle)
          planet.quaternion.multiply(_tmpQuat)

          // Apply damping to slow down rotation
          angularVelocity.multiplyScalar(dampingFactor)
        } else {
          // Default precession when no manual rotation
          const precessAx = 0.25 * Math.sin(t * 0.25)
          const precessAz = 0.25 * Math.cos(t * 0.2)
          _tmpAxis.set(precessAx, 1.0, precessAz).normalize()
          const baseDelta = 0.0015
          const deltaAngle = baseDelta * spinSpeedFactor
          _tmpQuat.setFromAxisAngle(_tmpAxis, deltaAngle)
          planet.quaternion.multiply(_tmpQuat)
        }

        // Text morphing and physics animation
        const textPosAttr = textGeometry.getAttribute("position") as THREE.BufferAttribute
        const textColorAttr = textGeometry.getAttribute("color") as THREE.BufferAttribute
        const textArr = textPosAttr.array as Float32Array
        const textColorArr = textColorAttr.array as Float32Array

        // Smooth transition factor (0 = Babd, 1 = Bitcoin)
        const morphSpeed = compressionActive ? 0.1 : 0.08
        const textMorphTarget = compressionActive ? 0.0 : 1.0
        textMorphFactor += (textMorphTarget - textMorphFactor) * morphSpeed

        // Physics effects intensity during transition (peaks in the middle)
        const transitionIntensity = 1.0 - Math.abs(textMorphFactor * 2 - 1.0)
        const spinEffect = transitionIntensity * 0.4
        const scatterEffect = transitionIntensity * 0.3

        const numBabdPoints = babdGeom.positions.length / 3
        const numBitcoinPoints = bitcoinGeom.positions.length / 3

        // Update geometry index to match current morph state
        if (textMorphFactor < 0.5) {
          textGeometry.setIndex(babdGeom.lineIndices)
        } else {
          textGeometry.setIndex(bitcoinGeom.lineIndices)
        }

        for (let i = 0; i < maxPoints; i++) {
          const i3 = i * 3

          // Determine source and target positions
          let sourceX = 0, sourceY = 0, sourceZ = 0
          let targetX = 0, targetY = 0, targetZ = 0
          let particleVisible = true

          if (i < numBabdPoints) {
            sourceX = babdGeom.positions[i3]
            sourceY = babdGeom.positions[i3 + 1]
            sourceZ = babdGeom.positions[i3 + 2]
          } else {
            particleVisible = false
          }

          if (i < numBitcoinPoints) {
            targetX = bitcoinGeom.positions[i3]
            targetY = bitcoinGeom.positions[i3 + 1]
            targetZ = bitcoinGeom.positions[i3 + 2]
          } else {
            // Scatter away
            const angle = (i / maxPoints) * Math.PI * 2
            const radius = 10
            targetX = Math.cos(angle) * radius
            targetY = Math.sin(angle) * radius
            targetZ = 0
          }

          // Fade particles in/out based on visibility in each shape
          let fadeIn = 1.0
          let fadeOut = 1.0

          if (i >= numBabdPoints) {
            // This particle only exists in Bitcoin shape
            fadeIn = textMorphFactor
          }
          if (i >= numBitcoinPoints) {
            // This particle only exists in Babd shape
            fadeOut = 1.0 - textMorphFactor
          }

          const particleOpacity = Math.min(fadeIn, fadeOut)

          // Interpolate position
          const lerpX = sourceX + (targetX - sourceX) * textMorphFactor
          const lerpY = sourceY + (targetY - sourceY) * textMorphFactor
          const lerpZ = sourceZ + (targetZ - sourceZ) * textMorphFactor

          // Add physics effects during transition
          const angle = Math.atan2(sourceY, sourceX)
          const radius = Math.sqrt(sourceX * sourceX + sourceY * sourceY)
          const spinAngle = angle + spinEffect * Math.sin(t * 4 + i * 0.1)
          const spinX = Math.cos(spinAngle) * radius
          const spinY = Math.sin(spinAngle) * radius

          // Scatter/wobble effect
          const wobbleX = textParticleVelocities[i3] * scatterEffect * Math.sin(t * 3 + i * 0.05)
          const wobbleY = textParticleVelocities[i3 + 1] * scatterEffect * Math.sin(t * 3.2 + i * 0.07)
          const wobbleZ = textParticleVelocities[i3 + 2] * scatterEffect * Math.sin(t * 2.8 + i * 0.06)

          // Combine all effects
          const finalX = lerpX + (spinX - lerpX) * transitionIntensity + wobbleX
          const finalY = lerpY + (spinY - lerpY) * transitionIntensity + wobbleY
          const finalZ = lerpZ + wobbleZ

          textArr[i3] = finalX
          textArr[i3 + 1] = finalY
          textArr[i3 + 2] = finalZ * particleOpacity // Use Z to fade particles

          // Animated gradient based on position and time
          // Create a wave that moves across the text
          const gradientPhase = (finalY * 0.8 + finalX * 0.5 + t * 0.8) % (Math.PI * 2)
          const gradientValue = Math.sin(gradientPhase) * 0.5 + 0.5

          // Dark color: darker red-orange (#dd5500)
          const darkR = 0.87
          const darkG = 0.33
          const darkB = 0.0

          // Bright color: standard orange (#ff9900)
          const brightR = 1.0
          const brightG = 0.6
          const brightB = 0.0

          // Interpolate between dark and bright based on gradient
          const r = darkR + (brightR - darkR) * gradientValue
          const g = darkG + (brightG - darkG) * gradientValue
          const b = darkB + (brightB - darkB) * gradientValue

          textColorArr[i3] = r
          textColorArr[i3 + 1] = g
          textColorArr[i3 + 2] = b
        }
        textPosAttr.needsUpdate = true
        textColorAttr.needsUpdate = true

        // Text gentle drift (slightly boosted too)
        const driftBoost = 0.8 + 0.2 * spinSpeedFactor
        textGroup.rotation.y = initialYaw + 0.015 * driftBoost * Math.sin(t * 0.6 + 1.2)
        textGroup.rotation.x = initialPitch + 0.012 * driftBoost * Math.cos(t * 0.8)

        // Keep glow aligned with planet & scale with compression
        glowSphere.quaternion.copy(planet.quaternion)
        glowSphere.scale.setScalar(compressionFactor)

        // Smooth activation & magnet interpolation
        deformAlpha += ((magnetActive ? 1 : 0) - deformAlpha) * 0.12
        if (magnetActive) {
          const targetLocal = planet.worldToLocal(magnetWorldTarget.clone())
          magnetLocal.lerp(targetLocal, 0.18)
        }

        // Detect release for ripple effect
        if (wasCompressed && !compressionActive) {
          rippleTime = t // Start ripple
        }
        wasCompressed = compressionActive

        // Calculate ripple effect
        let rippleProgress = (t - rippleTime) / rippleDuration
        rippleProgress = Math.max(0, Math.min(1, rippleProgress))
        const rippleActive = rippleProgress < 1

        // --- Deform + (SMOOTH) Compression + Wobble + Ripple ---
        const posAttr = planetGeometry.getAttribute("position") as THREE.BufferAttribute
        const colorAttr = planetGeometry.getAttribute("color") as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array
        const colorArr = colorAttr.array as Float32Array
        const sigma = influenceRadius
        const twoSigma2 = 2 * sigma * sigma

        // Particle scatter intensity (peaks during compression)
        const scatterIntensity = (1.0 - compressionFactor) * 0.4

        // Color heat shift (more red/orange when compressed)
        const heatFactor = 1.0 - compressionFactor

        if (deformAlpha > 0.001 || Math.abs(compressionFactor - 1.0) > 1e-4 || rippleActive || scatterIntensity > 0.001) {
          for (let i = 0; i < numParticles; i++) {
            const ix = i * 3

            // Compressed base
            const bx = basePositions[ix] * compressionFactor
            const by = basePositions[ix + 1] * compressionFactor
            const bz = basePositions[ix + 2] * compressionFactor

            // Particle scatter effect - push particles outward during compression
            const baseLen = Math.sqrt(bx * bx + by * by + bz * bz)
            const normX = baseLen > 0.001 ? bx / baseLen : 0
            const normY = baseLen > 0.001 ? by / baseLen : 0
            const normZ = baseLen > 0.001 ? bz / baseLen : 0

            // Wobble effect using particle velocities
            const wobbleAmount = scatterIntensity * 0.8
            const wobbleX = particleVelocities[ix] * wobbleAmount * Math.sin(t * 3 + i * 0.1)
            const wobbleY = particleVelocities[ix + 1] * wobbleAmount * Math.sin(t * 3.2 + i * 0.15)
            const wobbleZ = particleVelocities[ix + 2] * wobbleAmount * Math.sin(t * 2.8 + i * 0.12)

            // Scatter outward
            const scatterDist = scatterIntensity * 1.5
            const scatterX = normX * scatterDist
            const scatterY = normY * scatterDist
            const scatterZ = normZ * scatterDist

            // Ripple wave effect on release
            let rippleOffset = 0
            if (rippleActive) {
              // Calculate angle from particle to create wave pattern
              const angle = Math.atan2(by, bx)
              const wavePhase = angle * 2 + rippleProgress * Math.PI * 4
              const rippleWave = Math.sin(wavePhase) * Math.exp(-rippleProgress * 3)
              rippleOffset = rippleWave * 0.3
            }

            // Magnet displacement around compressed base
            const dx = magnetLocal.x - bx
            const dy = magnetLocal.y - by
            const dz = magnetLocal.z - bz
            const dist2 = dx * dx + dy * dy + dz * dz

            const w = Math.exp(-dist2 / twoSigma2)
            const k = strength * w * deformAlpha

            // Combine all effects
            arr[ix] = bx + dx * k + scatterX + wobbleX + normX * rippleOffset
            arr[ix + 1] = by + dy * k + scatterY + wobbleY + normY * rippleOffset
            arr[ix + 2] = bz + dz * k + scatterZ + wobbleZ + normZ * rippleOffset

            // Color shift to hotter colors during compression
            const baseR = baseColors[ix]
            const baseG = baseColors[ix + 1]
            const baseB = baseColors[ix + 2]

            // Shift toward red/orange (reduce green, increase red)
            const hotR = baseR * (1.0 + heatFactor * 0.3)
            const hotG = baseG * (1.0 - heatFactor * 0.3)
            const hotB = baseB + heatFactor * 0.15

            colorArr[ix] = hotR
            colorArr[ix + 1] = hotG
            colorArr[ix + 2] = hotB
          }
          posAttr.needsUpdate = true
          colorAttr.needsUpdate = true
        } else {
          // Fully relaxed, write true base
          for (let i = 0; i < basePositions.length; i++) {
            arr[i] = basePositions[i]
            colorArr[i] = baseColors[i]
          }
          posAttr.needsUpdate = true
          colorAttr.needsUpdate = true
        }

        // Starfield drift - synced with planet rotation speed
        const starPositions = starGeometry.attributes.position as THREE.BufferAttribute
        const starSpeed = 0.5 * spinSpeedFactor // Stars move faster when planet spins faster
        for (let i = 0; i < starPositions.count; i++) {
          let z = starPositions.getZ(i)
          z += starSpeed
          if (z > 2000) z -= 4000
          starPositions.setZ(i, z)
        }
        starPositions.needsUpdate = true

        // Detect hovered text sprite
        if (pointerActive && !isDraggingPlanet) {
          textRaycaster.setFromCamera(ndc, camera)
          const intersects = textRaycaster.intersectObjects(textSprites)

          // Reset previous hover
          if (hoveredSprite && (!intersects.length || intersects[0].object !== hoveredSprite)) {
            hoveredSprite.userData.targetScale = 1
            hoveredSprite = null
          }

          // Set new hover
          if (intersects.length > 0) {
            const hit = intersects[0].object as any
            if (hit !== hoveredSprite) {
              hoveredSprite = hit
              // Larger scale for multi-line quotes to make them readable
              hoveredSprite.userData.targetScale = hoveredSprite.userData.isMultiLine ? 3 : 2
            }
          }
        } else if (hoveredSprite) {
          hoveredSprite.userData.targetScale = 1
          hoveredSprite = null
        }

        // Animate easter egg texts (drift with stars + hover scale)
        textSprites.forEach(sprite => {
          sprite.position.z += starSpeed
          if (sprite.position.z > 2000) {
            sprite.position.z -= 4000
            // Randomize X/Y again when wrapping for variety
            sprite.position.x = THREE.MathUtils.randFloatSpread(1500)
            sprite.position.y = THREE.MathUtils.randFloatSpread(1500)
          }

          // Smooth scale animation for hover effect
          const ud = sprite.userData
          const scaleLerp = 0.1
          ud.currentScale += (ud.targetScale - ud.currentScale) * scaleLerp
          sprite.scale.set(
            ud.baseScaleX * ud.currentScale,
            ud.baseScaleY * ud.currentScale,
            1
          )

          // Also increase opacity when hovered
          const targetOpacity = ud.currentScale > 1.1 ? 0.9 : 0.6
          const mat = sprite.material as THREE.SpriteMaterial
          mat.opacity += (targetOpacity - mat.opacity) * scaleLerp
        })

        // Change cursor when hovering a quote
        renderer.domElement.style.cursor = hoveredSprite ? "pointer" : "default"

        renderer.render(scene, camera)

        // Smooth zoom interpolation
        const currentDist = camera.position.distanceTo(controls.target)
        if (Math.abs(currentDist - targetZoomDistance) > 0.001) {
          const smoothFactor = 0.1
          const newDist = THREE.MathUtils.lerp(currentDist, targetZoomDistance, smoothFactor)
          const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize()
          camera.position.copy(controls.target).add(direction.multiplyScalar(newDist))
        }

        controls.update()
          ; (glowMaterial.uniforms as any).time.value += 0.01
          ; (glowMaterial.uniforms as any).spinFactor.value = spinSpeedFactor
      }

      frameId = requestAnimationFrame(animate)

      // Resize
      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
      window.addEventListener("resize", handleResize)

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("pointermove", onGlobalPointerMove)
        document.removeEventListener("pointerleave", onPointerLeave)
        document.removeEventListener("mouseout", onMouseOut)
        renderer.domElement.removeEventListener("pointerdown", onPointerDown)
        window.removeEventListener("pointerup", onPointerUp)
        window.removeEventListener("keydown", onKeyDown)
        renderer.domElement.removeEventListener("click", onQuoteClick)
        renderer.domElement.removeEventListener("wheel", onWheel)
        if (quoteModal.parentElement) {
          quoteModal.parentElement.removeChild(quoteModal)
        }
        if (frameId) cancelAnimationFrame(frameId)
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement)
        }
        starGeometry.dispose()
        starMaterial.dispose()
        planetGeometry.dispose()
        planetMaterial.dispose()
        textGeometry.dispose()
        pointsMaterial.dispose()
        lineMaterial.dispose()
        glowGeometry.dispose()
        glowMaterial.dispose()
        renderer.dispose()
      }
    }

    let cleanup: (() => void) | undefined
    initThree().then((fn) => {
      if (typeof fn === "function") cleanup = fn
    })

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}

