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
        "1984 is now",
        "Austrian economics",
        "John McAfee didn't kill himself",
        // Cypherpunk quotes with authors (from github.com/swedishfrenchpress/cypherpunk-quotes-bot)
        // Tim May
        "A specter is haunting the modern world,\nthe specter of crypto anarchy.\n— Tim May",
        "The State will of course try to slow or\nhalt the spread of this technology, citing\nnational security concerns.\n— Tim May",
        "Computer technology is on the verge of\nproviding the ability for individuals and\ngroups to communicate and interact in a\ntotally anonymous manner.\n— Tim May",
        "Just as the technology of printing altered\nand reduced the power of medieval guilds\nand the social power structure, so too will\ncryptologic methods fundamentally alter the\nnature of corporations and of government.\n— Tim May",
        "Crypto anarchy is not just about avoiding\nlaws. It's about making certain laws\nunenforceable.\n— Tim May",
        "Strong cryptography can resist an unlimited\namount of violence. No amount of coercive force\nwill ever solve a math problem.\n— Tim May",
        "I can't speak for what Satoshi intended,\nbut I sure don't think it involved\nexchanges and tracking.\n— Tim May",
        "There's a real possibility that all the\nnoise about governance will create\na surveillance state.\n— Tim May",
        "I think the greed and hype and nattering\nabout 'to the Moon!' is the biggest\nhype wagon.\n— Tim May",
        "Be interested in liberty and the freedom to\ntransact and speak to get back to\noriginal motivations.\n— Tim May",
        "Mathematics is not the law.\n— Tim May",
        "Remember, there are a lot tyrants out there.\n— Tim May",
        "Digital pseudonyms, the creation of persistent\nnetwork personas that cannot be forged.\n— Tim May",
        "Digital cash, untraceable and anonymous\n(like real cash), is also coming.\n— Tim May",
        "'Swiss banks in cyberspace' will make economic\ntransactions much more liquid.\n— Tim May",
        "Governments see their powers eroded by these\ntechnologies, and are taking various steps\nto stop them.\n— Tim May",
        "Technology has let the genie out of the bottle.\nCrypto anarchy is liberating individuals.\n— Tim May",
        "A phase change is coming. Virtual communities\nare in their ascendancy.\n— Tim May",
        // Eric Hughes
        "Privacy is necessary for an open\nsociety in the electronic age.\n— Eric Hughes",
        "Cypherpunks write code. We know that someone\nhas to write software to defend privacy.\n— Eric Hughes",
        "Privacy is not secrecy. A private matter is\nsomething one doesn't want the whole world\nto know.\n— Eric Hughes",
        "We cannot expect governments, corporations,\nor other large, faceless organizations to grant\nus privacy out of their beneficence.\n— Eric Hughes",
        "We must defend our own privacy if we\nexpect to have any.\n— Eric Hughes",
        // Julian Assange
        "Capable, generous men do not create victims,\nthey nurture them.\n— Julian Assange",
        "Every time we witness an injustice\nand do not act, we train our character\nto be passive in its presence.\n— Julian Assange",
        "The internet, our greatest tool of emancipation,\nhas been transformed into the most dangerous\nfacilitator of totalitarianism.\n— Julian Assange",
        "Cryptography is the ultimate form\nof non-violent direct action.\n— Julian Assange",
        "That's why our primary defense\nisn't law, but technology.\n— Julian Assange",
        "Courage is contagious. If you demonstrate\nindividuals can leak and live well,\nit's incentivizing.\n— Julian Assange",
        "Intelligence agencies keep things secret because\nthey often violate the rule of law.\n— Julian Assange",
        "Stopping leaks is a new form of censorship.\nAnyone motivated can work around it.\n— Julian Assange",
        "The supply of leaks is very large. It's helpful\nfor us to have more people in industry.\n— Julian Assange",
        // Philip Zimmermann
        "If privacy is outlawed,\nonly outlaws will have privacy.\n— Philip Zimmermann",
        "Pretty Good Privacy empowers people to take\ntheir privacy into their own hands.\n— Philip Zimmermann",
        "There is nothing quite so disempowering as a\ngovernment that can read all your thoughts.\n— Philip Zimmermann",
        "What if everyone believed that law-abiding\ncitizens should use postcards for their mail?\n— Philip Zimmermann",
        "You use envelopes for postal mail.\nThe only way to create the digital\nequivalent is to encrypt.\n— Philip Zimmermann",
        "Most people are unaware of how visible email\nis. It could be intercepted.\n— Philip Zimmermann",
        "In view of the serious implications of such a\nlaw, I abandoned my plans to charge for PGP.\n— Philip Zimmermann",
        "I am active in policy space rather than\nwriting code, doing a lot of public speaking.\n— Philip Zimmermann",
        "I am an engineer, not a mathematician.\nI try to find practical solutions.\n— Philip Zimmermann",
        // David Chaum
        "You can pay for access to a database,\ndownload a program, or have a prescription\nfilled without anyone knowing who you are.\n— David Chaum",
        "I am very concerned that large transaction\nsystems are being designed with no\nregard for privacy.\n— David Chaum",
        "In one direction lies unprecedented scrutiny\nand control of people's lives.\n— David Chaum",
        // Hal Finney
        "I see Bitcoin as ultimately becoming a\nreserve currency for banks.\n— Hal Finney",
        "I'd like to think that decades from now,\npeople will look back and see this time as\nthe dawning of a new era of individual\nempowerment and freedom.\n— Hal Finney",
        "For Bitcoin to succeed and become secure,\nbitcoins must become vastly more expensive.\n— Hal Finney",
        "When Satoshi announced Bitcoin on the\ncryptography mailing list, he got a\nskeptical reception.\n— Hal Finney",
        "Bitcoin seems to be a very promising idea.\nI like the idea of basing security on\ncomputational difficulty.\n— Hal Finney",
        "I would like to die peacefully in my sleep,\nknowing that I helped create a better world.\n— Hal Finney",
        "I've noticed that cryptographic graybeards tend\nto get cynical. I was more idealistic.\n— Hal Finney",
        "I have been working on ideas to display the\ninformation in digital cash in some other way.\n— Hal Finney",
        "If you go into a store today and make a\npurchase with cash, no records are left.\n— Hal Finney",
        "Just as a merchant will accept cash from a\ncustomer without demanding proof of identity.\n— Hal Finney",
        "The goal of electronic cash is to allow these\nsame kinds of private transactions electronically.\n— Hal Finney",
        "Some have predicted that the initial success\nof electronic money may be in technically\nillegal markets.\n— Hal Finney",
        "We are on a path today which, if nothing\nchanges, will lead to greater government power.\n— Hal Finney",
        "Cryptography can make possible a world in\nwhich people have control over information\nabout themselves, not because government has\ngranted them that control, but because only\nthey possess the cryptographic keys.\n— Hal Finney",
        "If you see a proposal for an electronic money\nsystem, check whether it preserves privacy.\n— Hal Finney",
        "The notion that we can just fade into\ncypherspace and ignore political realities\nis unrealistic.\n— Hal Finney",
        "Again, we need to win political, not\ntechnological, victories to protect our privacy.\n— Hal Finney",
        "Fundamentally, I believe we will have the kind\nof society that most people want. If we want\nfreedom and privacy, we must persuade others\nthat these are worth having.\n— Hal Finney",
        "Withdrawing into technology is like pulling the\nblankets over your head. It feels good.\n— Hal Finney",
        // Wei Dai
        "I am fascinated by Tim May's crypto-anarchy.\nUnlike communities traditionally associated with\nthe word 'anarchy', in a crypto-anarchy the\ngovernment is not temporarily destroyed but\npermanently forbidden and permanently unnecessary.\n— Wei Dai",
        "There has never been a government that didn't\nsooner or later try to reduce the freedom\nof its subjects.\n— Wei Dai",
        "Instead of trying to convince our current\ngovernment not to try, we'll develop the\ntechnology to make it impossible.\n— Wei Dai",
        "Efforts to influence the government are\nimportant only in so far as to delay its\nattempted crackdown.\n— Wei Dai",
        "If you have a certain amount of time to spend\non advancing the cause of greater personal\nprivacy, spend it on technology.\n— Wei Dai",
        // Nick Szabo
        "Trusted third parties are security holes.\n— Nick Szabo",
        "A smart contract is a set of promises,\nspecified in digital form, including protocols\nwithin which the parties perform.\n— Nick Szabo",
        "Advances in information technology have made\npossible the rise of a truly international\ncurrency.\n— Nick Szabo",
        "Money, like written language, was one of the\nmost important inventions of civilization.\n— Nick Szabo",
        "Bitcoin is not a list of cryptographic features,\nit's a very complex system of interacting\nmathematics and protocols.\n— Nick Szabo",
        // John Perry Barlow
        "Governments of the Industrial World, you weary\ngiants of flesh and steel, I come from\nCyberspace, the new home of Mind.\n— John Perry Barlow",
        "Cyberspace consists of transactions,\nrelationships, and thought itself, arrayed\nlike a standing wave in the web\nof our communications.\n— John Perry Barlow",
        "You claim there are problems among us that\nyou need to solve. You use this claim as\nan excuse to invade our precincts.\n— John Perry Barlow",
        "We are creating a world where anyone may\nexpress beliefs, no matter how singular.\n— John Perry Barlow",
        // Edward Snowden
        "Arguing that you don't care about privacy\nbecause you have nothing to hide is no different\nthan saying you don't care about free speech\nbecause you have nothing to say.\n— Edward Snowden",
        "I don't want to live in a world where\neverything I do and say is recorded.\n— Edward Snowden",
        "The NSA has built an infrastructure that allows\nit to intercept almost everything.\n— Edward Snowden",
        "Being a patriot doesn't mean prioritizing\nservice to government above all else.\n— Edward Snowden",
        "Encryption works. Properly implemented\nstrong crypto systems are one of the few\nthings that you can rely on.\n— Edward Snowden",
        "Bulk collection, which should become one of\nthe dirtiest phrases in the language.\n— Edward Snowden",
        "It's not data that's being exploited.\nIt's people that are being exploited.\n— Edward Snowden",
        "The scandal isn't how they're breaking the law.\nThe scandal is they don't have to break it.\n— Edward Snowden",
        "They have built a legal paradigm that presumes\nrecords collected about us don't belong to us.\n— Edward Snowden",
        "You can't awaken someone who's\npretending to be asleep.\n— Edward Snowden",
        // Whitfield Diffie
        "The best defense against abusive government is\nan informed and active citizenry.\n— Whitfield Diffie",
        "Public key cryptography is a revolution\nthat puts control of privacy into\nthe hands of the individual.\n— Whitfield Diffie",
        "I had this view of cryptography in which the\ncritical value was you didn't trust others.\n— Whitfield Diffie",
        "If you encrypted your files, then if a court\nwanted them they would have to threaten you.\n— Whitfield Diffie",
        "I never understood the classical notion of a\nkey distribution center, which is a\ntrusted resource.\n— Whitfield Diffie",
        "Cryptography was a technique that did not\nrequire your trusting other people.\n— Whitfield Diffie",
        "You may have protected files, but if a subpoena\nwas served to the system manager...\n— Whitfield Diffie",
        // Martin Hellman
        "What is the greatest unsolved problem in\ncryptography today? Lack of user awareness.\n— Martin Hellman",
        "Building security from day one is much easier\nthan adding it on as an afterthought.\n— Martin Hellman",
        "I have argued that the Internet should have\nhad security built into it from beginning.\n— Martin Hellman",
        "When a company goes to develop a product,\nthey should define it as either\nsecure or insecure.\n— Martin Hellman",
        "The real value in encryption is integrated,\nautomatic encryption that threatens\nintelligence operations.\n— Martin Hellman",
        // Diffie & Hellman
        "WE STAND TODAY on the brink\nof a revolution in cryptography.\n— Diffie & Hellman",
        "The last characteristic in the history of\ncryptography is the division between amateur\nand professional.\n— Diffie & Hellman",
        "We hope this will inspire others to work in\nthis fascinating area.\n— Diffie & Hellman",
        // Ralph Merkle
        "A hash function should be a one-way function —\neasy to compute but difficult to reverse.\n— Ralph Merkle",
        // Adam Back
        "Bitcoin is the most significant computer science\nbreakthrough in the last 20 years.\n— Adam Back",
        // Cody Wilson
        "The age of the printable gun has arrived, and\nthere's nothing anyone can do about it.\n— Cody Wilson",
        // Ross Ulbricht
        "I wanted to empower people to make\ntheir own choices, to pursue\ntheir own happiness.\n— Ross Ulbricht",
        "Every action I took was out of a desire\nto enable people to have freedom.\n— Ross Ulbricht",
        "I believed in the idea of giving people the\nfreedom to buy and sell.\n— Ross Ulbricht",
        // Jacob Appelbaum
        "We live in a golden age for surveillance.\nEverything you do can be captured.\n— Jacob Appelbaum",
        // Richard Stallman
        "Free software is a matter of liberty,\nnot price. Think of 'free' as in\n'free speech,' not as in 'free beer.'\n— Richard Stallman",
        "Proprietary software is an injustice.\nIt denies users freedom and keeps\nthem helpless.\n— Richard Stallman",
        // Linus Torvalds
        "Talk is cheap. Show me the code.\n— Linus Torvalds",
        // Aaron Swartz
        "Information is power. But like all power,\nthere are those who want to keep\nit for themselves.\n— Aaron Swartz",
        "There is no justice in following unjust laws.\nIt's time to come into the light.\n— Aaron Swartz",
        "Those with access to these resources have\nbeen given an enormous privilege.\n— Aaron Swartz",
        // Cory Doctorow
        "Anyone who says they have a system that's\nperfectly secure from attackers is lying.\n— Cory Doctorow",
        // Bruce Schneier
        "Security is a process, not a product.\n— Bruce Schneier",
        "If you think technology can solve your security\nproblems, then you don't understand\nthe problems or the technology.\n— Bruce Schneier",
        "Cryptography is the last defense of liberty\nin a world of total surveillance.\n— Bruce Schneier",
        // Andreas Antonopoulos
        "Bitcoin isn't just money for the internet.\nIt's a new form of money that is\nnative to the internet.\n— Andreas Antonopoulos",
        "Bitcoin is not just a currency.\nIt's a platform for trust.\n— Andreas Antonopoulos",
        // fiatjaf
        "The simplest open protocol that is able to\ncreate a censorship-resistant global\nsocial network.\n— fiatjaf",
        // Moxie Marlinspike
        "The ecosystem is moving towards consolidation\nbecause users don't want to run\ntheir own servers.\n— Moxie Marlinspike",
        "End-to-end encryption should be the default\nfor all communication.\n— Moxie Marlinspike",
        "If the federal government had access to every\nemail and phone call, they could\nfind something on anyone.\n— Moxie Marlinspike",
        "These legal victories would probably not have\nbeen possible without the ability to\nbreak the law.\n— Moxie Marlinspike",
        "If everyone's every action were being monitored,\npunishment becomes purely selective.\n— Moxie Marlinspike",
        "If the federal government can't even count how\nmany laws there are, what chance does\nthe individual have?\n— Moxie Marlinspike",
        "Tracking everyone is no longer inconceivable,\nand is in fact happening all the time.\n— Moxie Marlinspike",
        // Phillip Rogaway
        "Cryptography rearranges power: it configures\nwho can do what, from what. This makes\ncryptography an inherently political tool.\n— Phillip Rogaway",
        "If cryptography's most basic aim is secure\ncommunications, how could it fail when\npeople lack privacy?\n— Phillip Rogaway",
        "That cryptographic work is deeply tied to\npolitics is a claim so obvious.\n— Phillip Rogaway",
        "Technological ideas and technological things\nare not politically neutral.\n— Phillip Rogaway",
        "We need to make cryptography the solution to\nthe problem: 'how do you make\nsurveillance expensive?'\n— Phillip Rogaway",
        "Cypherpunk cryptography has been described as\ncrypto with an attitude. But much more than that.\n— Phillip Rogaway",
        "Since cryptography is a tool for shifting power,\nthe people who know it well\ninherit that power.\n— Phillip Rogaway",
        // Jim Bell
        "How can we translate the freedom afforded by\nthe Internet to ordinary life?\n— Jim Bell",
        "Using modern methods of public-key encryption\nand anonymous 'digital cash,' it would\nbe possible to create new systems.\n— Jim Bell",
        "Somebody had to be the first one to start\nbanging on the Berlin Wall, in 1989.\n— Jim Bell",
        // Chuck Hammill
        "By its very nature, it favors the bright over\nthe dull. It favors the adaptable over\nthe rigid.\n— Chuck Hammill",
        // Jamie Bartlett
        "The cypherpunks were troublemakers:\ncontroversial, radical, unrelenting,\nbut also practical.\n— Jamie Bartlett",
        // David D. Friedman
        "It is tempting to try for the best of both\nworlds — to restrict privacy of bad people.\n— David D. Friedman",
        "Privacy gives each of us more control over\nhis own life — which on average is\na good thing.\n— David D. Friedman",
        "In the long run, the real battle will be the\none fought in defense of privacy-protecting\ntechnologies.\n— David D. Friedman",
        // Amir Taaki
        "The internet is a tool of freedom and\nself-determination. Meddling in its\nmechanics is destructive.\n— Amir Taaki",
        "Bitcoin is a tool of resistance\ngifted to us by Satoshi. The idea\nhas escaped.\n— Amir Taaki",
        "Truth happens. We will succeed.\nDon't wait around for others to take action.\n— Amir Taaki",
        // Andrew Poelstra
        "Because Bitcoin's DMMS is computationally\nexpensive, alternatives have been proposed.\n— Andrew Poelstra",
        "Their non-anonymity also means that a dedicated\nattacker will eventually be able to attack.\n— Andrew Poelstra",
        "It is important to realize that while\ndistributed consensus is a hard problem.\n— Andrew Poelstra",
        // St. Jude (Jude Milhon)
        "The keyboard is the great equalizer —\nbetter than the Glock .45.\n— St. Jude",
        // Jerry Brito
        "A cashless economy is\na surveillance economy.\n— Jerry Brito",
        "Cash is an escape valve in our increasingly\nintermediated and surveilled world.\n— Jerry Brito",
        "In a world without cash, all transactions\nmust be necessarily intermediated.\n— Jerry Brito",
        "Cash is also necessary to retain agency\nand autonomy.\n— Jerry Brito",
        "Cash is more than a method of payment.\nIt is a fundamental tool for privacy.\n— Jerry Brito",
        "Because cash is permissionless,\nit is censorship resistant.\n— Jerry Brito",
        "As we move to an increasingly online world,\nwe must develop electronic cash.\n— Jerry Brito",
        // Peter Valkenburgh
        "Perhaps we never fully understand that balance\nuntil one of those secret rights disappears.\n— Peter Valkenburgh",
        "Cash is also pretty good for privacy because\nthere's no camera that can capture\nevery movement.\n— Peter Valkenburgh",
        // Carissa Véliz
        "Even more than monetary gain, personal data\nbestows power on those who collect it.\n— Carissa Véliz",
        "Google and Facebook are not really in the\nbusiness of data – they are in the\nbusiness of power.\n— Carissa Véliz",
        "There is power in knowing. By protecting our\nprivacy, we prevent others from empowerment.\n— Carissa Véliz",
        "Power over others' privacy is the quintessential\nkind of power in the digital age.\n— Carissa Véliz",
        "When you expose your privacy,\nyou put us all at risk.\n— Carissa Véliz",
        "The tech powers that be are nothing\nwithout our data.\n— Carissa Véliz",
        // Enrico Beltramini
        "The key question at the heart of the cypherpunk\nmovement was not freedom, but the\ncrisis of it.\n— Enrico Beltramini",
        // Patrick D. Anderson
        "The cypherpunk movement provides an intelligible,\nviable, and effective model of data activism.\n— Patrick D. Anderson",
        "By understanding cypherpunk theory and practice,\nit becomes possible to understand resistance.\n— Patrick D. Anderson",
        // Steven Levy
        "The people in this room hope for a world where\nan individual's informational footprints can be\ntracked only if the individual involved\napproves.\n— Steven Levy",
        "The outcome of this struggle may determine the\namount of freedom our society will grant.\n— Steven Levy",
        "Arise, You have nothing to lose but your\nbarbed-wire fences.\n— Steven Levy",
        "The NSA's cryptographic monopoly\nhas evaporated.\n— Steven Levy",
        "There is a war going on between those who\nwould liberate crypto and those who\nwould suppress it.\n— Steven Levy",
        "There is only one way this vision will\nmaterialize, and that is by widespread\nuse of cryptography.\n— Steven Levy",
        "The government used to actually be able to\ncontrol powerful crypto.\n— Steven Levy",
        "By the 1990s, at the NSA at least, they\nfigured out it was impossible to totally\nsnuff out crypto.\n— Steven Levy",
        "The law enforcement folks were stuck longer\nin the hard-core phase.\n— Steven Levy",
        "The Clinton people were ripe for plucking.\nThey didn't want to alienate\nthe hard-liners.\n— Steven Levy",
        // John Gilmore
        "The Net interprets censorship\nas damage and routes around it.\n— John Gilmore",
        "We are not asking to threaten the national\nsecurity. We're asking to discard a\nCold War idea.\n— John Gilmore",
        "They're abridging the freedom and privacy of\nall citizens — to defend us against\na bogeyman.\n— John Gilmore",
        // Zooko Wilcox
        "User-controlled privacy is not a niche;\nit's a fundamental building block\nof healthy society.\n— Zooko Wilcox",
        "Privacy is the foundation that allows freedom\nof speech, thought, and association to thrive.\n— Zooko Wilcox",
        // JStark
        "Live free or fucking die.\n— JStark",
        "I am extremely peaceful.\n— JStark",
        "Come and take it",
        "Pinochet's Helicopter Tours.\nTake the plunge!",
        "\"Diversification\" is a fancy way\nto say \"less bitcoin\".",
        "Lost it all in a boat accident...",
        "Bitcoin is everything people don't\nknow about computers, combined with\neverything they don't understand\nabout money.\n— John Oliver"
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
            // Reduce magnetic strength when compressed to avoid over-pulling
            const k = strength * w * deformAlpha * compressionFactor

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

