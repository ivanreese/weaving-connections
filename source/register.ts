export {}

// schedule slots
// if you imagine the schedule for the weekend is a series of "slots"…
// eg: Friday AM, Friday PM, Saturday AM, etc
// …then the scheduleSlots is an array of numbers that tell which slots the workshop occupies.
// eg: Friday AM => [0]
//     Friday PM => [1]
//     Friday All Day => [0, 1]
//     Friday & Saturday => [0, 1, 2, 3]
//     Saturday All Day => [2, 3]
//     Sunday AM => [4]
//     Sunday PM => [5]
//     Friday PM and Sunday AM => [1, 4]

const formStructure: FormStructure = {
  Workshops: {
    driedFloralWreath: {
      image: "1.jpg",
      description:
        "Great for beginners. Make various sizes of wreath base with native willow species, then adorn them with an array of locally-grown dried flowers and cattail cordage.",
      title: "Dried Floral Wreath",
      sessions: 1,
      materialCost: 40,
      totalCost: 80,
      instructionCost: 40,
      classSize: "Minimum 5, maximum 10",
      limit: 10,
      tools: "Shears",
      teacher: "Josephine Junas-Grant ",
      scheduleSlots: [0],
      scheduleDesc: "Fri AM",
      hours: "2 hours"
    },
    willowSwedishStars: {
      image: "2.jpg",
      description:
        "Create an elegant Swedish Star from foraged willow. The design can be scaled large or small, and you can bring decorative yarn, cordage, or fabric to adorn your star.",
      title: "Willow Swedish Stars",
      sessions: 1,
      materialCost: 30,
      totalCost: 70,
      instructionCost: 40,
      classSize: "Minimum 5; maximum 10",
      limit: 10,
      tools: "Sharp hand held pruners, sharp locking blade, measuring tape.",
      teacher: "Karla Powell",
      scheduleSlots: [0],
      scheduleDesc: "Fri AM",
      hours: "3 hours"
    },
    catalanTray: {
      image: "3.jpg",
      description:
        "These woven tension trays from Spanish design are both functional and decorative. Students will work with foraged willow and learn hoop making and simple weaving technique as well as twining to create their own Catalan Tray.",
      title: "Catalan Tray",
      sessions: 1,
      materialCost: 30,
      totalCost: 70,
      instructionCost: 40,
      classSize: "minumum 5, maximum 10",
      limit: 10,
      tools: "Sharp pruners, sharp locking blade",
      teacher: "Karla Powell",
      scheduleSlots: [0],
      scheduleDesc: "Fri AM",
      hours: "1 hour"
    },
    randomWeaveWillowBasket: {
      image: "4.jpg",
      description:
        "Try the random weave technique. Instructor Karla Powell loves how this weave allows for a lot of creativity in basket design. Students will be able to decide on their own form, and create a functional or sculptural (or both) basket that will be uniquely their own.",
      title: "Random Weave Willow Basket",
      sessions: 2,
      materialCost: 50,
      totalCost: 130,
      instructionCost: 80,
      classSize: "5 minumum, 8 maximum",
      limit: 8,
      tools: "Sharp hand held pruners; sharp locking blade",
      teacher: "Karla Powell",
      scheduleSlots: [1],
      scheduleDesc: "Fri PM",
      hours: "3 hours"
    },
    coveredWaterBottle: {
      image: "5.jpg",
      description:
        "Keep your favourite beverages hot or cold with the covered bottle that uses willow, birch and red cedar barks, cattail, dyed jute cord, artificial sinew and waxed linen.  Participants are encouraged to bring their own danglers to personalize their bottle.\n\nWeaves will include twining, plating and 3 rod wale.  \n\nPrice includes an aluminium water bottle\n\nDimensions: 9” h x 4” w \n\nExperience:  All levels\n\n",
      title: "Covered Water Bottle",
      sessions: 2,
      materialCost: 70,
      totalCost: 150,
      instructionCost: 80,
      classSize: "5 to 10",
      limit: 10,
      tools: "sharp scissors, large eye needle",
      teacher: "Cathie Harper",
      scheduleSlots: [1],
      scheduleDesc: "Fri PM",
      hours: "2 hours"
    },
    willowGardenTrugAndWallBasket: {
      image: "6.jpg",
      description:
        "Garden Trug\nNeed something to bring the bounty in from the garden?\nThe oval base is one that I learned years ago and find to be an easier base.\n\nWeaves will include twining and 3 rod wale.  The 3-1 rim will be used.  A built-in handle will finish the basket with a fancy weave partly up the rim.\n\nDimensions: 5” h x 10” w x 15” l\nClass size:  8\nClass Fee:  $120 (12 hours)\nMaterials:  $70\nTools: \nExperience:  All levels\nWall Basket\nThis round willow basket is designed to hang on the wall to store ‘stuff’\n\nIt uses the stake and strand method to create a round base and then the uprights are used to help make a pocket, the 3 -1 border finishes the complete basket.  A rope handle is used to hang the basket\n\nWeaves will include twining, 3 rod wale and packing weave.  \n\nDimensions: 13”d x 4 =” deep\n\nExperience:  All levels",
      title: "Willow Garden Trug and Wall Basket",
      sessions: 4,
      materialCost: "$70 + $40",
      totalCost: 270,
      instructionCost: "$120 + $40",
      classSize: "5 to 10",
      limit: 10,
      tools: " Garden shears, locking knife, awl, rapping iron",
      teacher: "Cathie Harper",
      scheduleSlots: [0, 1],
      scheduleDesc: "Fri All Day",
      hours: "8 hours"
    },
    pineNeedleBasket: {
      image: "7.jpg",
      description:
        "This workshop is intended for beginners. Learn how to harvest, clean and prepare pine needles for basketry. You will create a small basket with a semi precious cabochon centre of your choice and learn two different stitches. ",
      title: "Pine Needle Basket ",
      sessions: 1,
      materialCost: 35,
      totalCost: 75,
      instructionCost: 40,
      classSize: "Minimum 4 Maximum 10",
      limit: 10,
      tools: "None",
      teacher: "Tania Kristensen ",
      scheduleSlots: [0, 1],
      scheduleDesc: "Fri All Day",
      hours: "6 hours"
    },
    pineNeedleSunCatcher: {
      image: "8.jpg",
      description:
        "This class is intended for those that have completed the Beginner Pine Needle Basket workshop. Learn the Wrapped, Diamond and Candle in the Window stitches with a wire wrapped agate slice (sizes and colours vary) of your choice. ",
      title: "Pine Needle Sun Catcher ",
      sessions: 1,
      materialCost: 35,
      totalCost: 75,
      instructionCost: 40,
      classSize: "Minimum 4 Maximum 6",
      limit: 6,
      tools: "None",
      teacher: "Tania Kristensen ",
      scheduleSlots: [2],
      scheduleDesc: "Sat AM",
      hours: "4 hours"
    },
    smallRushPouch: {
      image: "9.jpg",
      description:
        "Make a small pouch from a locally harvested rush. Learn the basics of weaving with soft materials on a wooden form. Skills learned will include pairing, waling, and checkered board or twill weave with a twisted rope border.\n\nWe will also discuss how to harvest and prepare rush for weaving.",
      title: "Small Rush Pouch",
      sessions: 2,
      materialCost: 30,
      totalCost: 110,
      instructionCost: 80,
      classSize: "Min 4 Max 10",
      limit: 10,
      tools: "None",
      teacher: "Freyja Ulveland",
      scheduleSlots: [2],
      scheduleDesc: "Sat AM",
      hours: "3 hours"
    },
    texturedBowl: {
      image: "10.jpg",
      description:
        'Learn to weave a textured bowl using the "rope coiling" technique. The base will be constructed of a 3x3 slath. From there we will 4 rod drop down whale to create a bit of a foot on out basket. From there we will move up the sides using a rope coil weave.   before This weave moves fast once you get the hang of it. While this is not a diffcult weave to master some previous weaving experience would be beneficial. ',
      title: "Textured Bowl",
      sessions: 4,
      materialCost: 40,
      totalCost: 120,
      instructionCost: 80,
      classSize: "Max 6",
      limit: 6,
      tools: "Awl, shears, rapping iron, locking knife. (Instructor will have extras on hand if needed)",
      teacher: "Freyja Ulveland",
      scheduleSlots: [3],
      scheduleDesc: "Sat PM",
      hours: "2 hours"
    },
    tinyBasket: {
      image: "11.jpg",
      description:
        'Learn to make a tiny basket! Perfect for toothpicks, Q-tips or anything else tiny! Learn to work with some unusual materials on a small scale. Willow bark spokes, dandelion, banana, rhubarb, or corn husks "weavers". You can also make some tiny cordage to weave in as well. Learn to work with some unusual materials on a small scale. Class is OK for beginners.',
      title: "Tiny Basket",
      sessions: 1,
      materialCost: 15,
      totalCost: 55,
      instructionCost: 40,
      classSize: "5 - 10",
      limit: 10,
      tools:
        "Small pointed sharp scissors and a spray bottle (to keep the materials and basket moist during the weaving)",
      teacher: "Sarah Graham",
      scheduleSlots: [3],
      scheduleDesc: "Sat PM",
      hours: "3 hours"
    },
    figure8Basket: {
      image: "12.jpg",
      description:
        "Use a wood cookie base to weave a double basket (perfect for holding a couple wine bottles or spoons/flippers) Learn how to secure through a wood cookie and start with a three rod wale, then us randing to build up the basket, finish off with another 3 rod wale and a simple border. We will also add a handle if wanted. Class is ok for beginners.",
      title: "Figure 8 Basket",
      sessions: 1,
      materialCost: 40,
      totalCost: 80,
      instructionCost: 40,
      classSize: "5-10",
      limit: 10,
      tools: "Sharp Pruning shears\nAwl\nOptional : rapping iron",
      teacher: "Sarah Graham",
      scheduleSlots: [2, 3],
      scheduleDesc: "Sat All Day",
      hours: "8 hours"
    },
    artBasket: {
      image: "13.jpg",
      description:
        'We will start with a round willow base, add uprights and secure with a three rod wale. We will continue with randing willow. This should be a basket full of "you". Bring items to weave in such as different fibers, bells, shells, buttons, beads, yarn, leather or jewelry to incorporate into your basket. ',
      title: "Art Basket",
      sessions: 1,
      materialCost: 30,
      totalCost: 70,
      instructionCost: 40,
      classSize: "5-10",
      limit: 10,
      tools:
        "Items to weave in that have meaning to the weaver\nSharp pruning shears\nSharp knife\nScissors\nWeight (antique iron, heavy round rock)\nOptional: Rapping iron",
      teacher: "Sarah Graham",
      scheduleSlots: [1, 2],
      scheduleDesc: "Fri PM / Sat AM",
      hours: "6 hours"
    },
    rusticWillowChair: {
      image: "14.jpg",
      description:
        "Create your own unique rustic chair using locally sourced native willow. You will learn how to harvest willow legally and respectfully. You will also learn construction techniques and willow furniture proportions. ",
      title: "Rustic Willow Chair ",
      sessions: 2,
      materialCost: 60,
      totalCost: 140,
      instructionCost: 80,
      classSize: "3 to 5",
      limit: 5,
      tools:
        "A hammer, pruners, small knife, bush saw and a marker.  You will need a cordless drill ( with extra batteries) and an assortment of drill bits -1/16 x3, 3/32x2,  7/64 x2, 1/8 inches, as you will break some. All other materials supplied. ",
      teacher: "Laura Forbes ",
      scheduleSlots: [0, 1, 2, 3, 4, 5],
      scheduleDesc: "All Weekend",
      hours: "14 hours"
    },
    "wildHarvesting&Stewardship": {
      image: "15.jpg",
      description:
        "Learn how to identify & coppice wild willow, weave a multipurpose hanging garlic/suet/orchid holder from a jig with the willow we harvest! ",
      title: "Wild Harvesting & Stewardship",
      sessions: 1,
      materialCost: 10,
      totalCost: 50,
      instructionCost: 40,
      classSize: "2 to 10",
      limit: 10,
      tools:
        "Secateurs/nippers/shears, eye protection, waterproof warm gloves, sturdy soled warm boots, durable winter wear! ",
      teacher: "Betty Attwood ",
      scheduleSlots: [4],
      scheduleDesc: "Sun AM",
      hours: "2 hours"
    },
    willowBackPack: {
      image: "16.jpg",
      description:
        "Create a ditch Willow backpack.\nI haven't decided yet whether we'll do an oval base or a Catalan base. Will do three broad whale at the bottom and zigzag weave for our Rand followed by a three rod whale at the top. \n\nNote: students will be responsible for getting straps on their backpacks.  I will offer some design ideas. \n\n(If we go ahead with this one, I will write a more accurate description before posting).",
      title: "willow back pack",
      sessions: 3,
      materialCost: 50,
      totalCost: 150,
      instructionCost: 100,
      classSize: "3-6",
      limit: 6,
      tools: "Sharp knife clippers ",
      teacher: "Mia",
      scheduleSlots: [4],
      scheduleDesc: "Sun AM",
      hours: "2 hours"
    },
    melonBasket: {
      image: "17.jpg",
      description: "Melon Basket",
      title: "Melon Basket",
      sessions: 1,
      materialCost: "will need to check with Candice",
      totalCost: 1000,
      instructionCost: "will need to check with Candice",
      classSize: "will need to check with Candice",
      limit: 10,
      tools: "Teacher will supply",
      teacher: "Candice Cullum",
      scheduleSlots: [3, 4],
      scheduleDesc: "Sat PM / Sun AM",
      hours: "4 hours"
    },
    mushroomBasket: {
      image: "18.jpg",
      description: "Same as last year",
      title: "Mushroom Basket",
      sessions: 1,
      materialCost: "check with Candice",
      totalCost: 1000,
      instructionCost: "check with Candice",
      classSize: "check with Candice",
      limit: 10,
      tools: "teacher will supply",
      teacher: "Candice Cullum",
      scheduleSlots: [5],
      scheduleDesc: "Sun PM",
      hours: "2 hours"
    },
    "broomWorkshop-Cobwebber": {
      image: "1.jpg",
      description:
        "Learn to make a cobwebber style broom made from broomcorn using traditional broom making techniques. ",
      title: " Broom workshop - Cobwebber",
      sessions: 1,
      materialCost: 120,
      totalCost: 150,
      instructionCost: 30,
      classSize: "Min 4 - Max 8",
      limit: 8,
      tools: "All tools and materials will be provided. ",
      teacher: "Kayla Yearwood",
      scheduleSlots: [5],
      scheduleDesc: "Sun PM",
      hours: "2 hours"
    }
  },
  Basics: {
    fullName: { type: "text", label: "Full Name" },
    preferredName: { type: "text", label: "What would you like us to call you?" },
    pronouns: { type: "text", label: "Preferred Pronouns" },
    email: { type: "email", label: "Email" },
    phone: { type: "tel", label: "Phone" },
    firstAider: {
      type: "radio",
      label: "Are you a first aider?",
      options: { yes: "Yes", no: "No" }
    },
    emergencyContact: { type: "text", label: "Emergency Contact" }
  },
  Meals: {
    meals: {
      type: "checkbox",
      label: "Which days are you having a meal?",
      options: {
        fridayLunch: "Friday Lunch",
        fridaySupper: "Friday Supper",
        saturdayLunch: "Saturday Lunch",
        saturdaySupper: "Saturday Supper",
        sundayLunch: "Sunday Lunch",
        sundaySupper: "Sunday Supper"
      }
    },
    foodAllergies: {
      type: "text",
      label: "Do you have any food allergies?"
    }
  },
  Accommodations: {
    accommodation: {
      type: "radio",
      label: "Accommodation",
      options: {
        tenting: "Tenting (this has a cost)",
        billeting: "Billeting",
        townhouse: "Townhouse"
      }
    }
  },
  "Just a few more questions...": {
    attendingAGM: {
      type: "radio",
      label: "Are you attending the AGM?",
      options: { yes: "Yes", no: "No" }
    },
    attendingCelebration: {
      type: "radio",
      label: "Are you attending the celebration of life for Maryann?",
      options: { yes: "Yes", no: "No" }
    },
    specialNotes: {
      type: "textarea",
      label: "Special Notes / Anything we should know?"
    },
    financialAssistance: {
      type: "radio",
      label: "Would you like to request financial assistance?",
      options: { yes: "Yes", no: "No" }
    },
    payExtra: {
      type: "radio",
      label: "Would you be able to pay a little extra?",
      options: { yes: "Yes", no: "No" }
    }
  }
}

type FormStructure = Record<SectionName, SectionFields | Workshops>
type SectionName = string

type SectionFields = Record<FieldName, Field>
type FieldName = string // MUST BE UNIQUE ACROSS ALL SECTIONS — this is the key we use to store the data

type Field = TextyField | CheckboxField | RadioField
type TextyField = TextField | TelField | EmailField | TextArea

type CheckboxField = { type: "checkbox"; label: string; options: Record<string, string> } // OPTION KEY MUST BE UNIQUE
type RadioField = { type: "radio"; label: string; options: Record<string, string> }
type TextField = { type: "text"; label: string }
type TextArea = { type: "textarea"; label: string }
type TelField = { type: "tel"; label: string }
type EmailField = { type: "email"; label: string }

type Workshops = Record<WorkshopId, WorkshopDetails>
type WorkshopId = string
type WorkshopDetails = {
  image: string // "1.jpg",
  description: string // "Great for beginners. Make various sizes of wreath base with native willow species, then adorn them with an array of locally-grown dried flowers and cattail cordage.",
  title: string // "Dried Floral Wreath",
  sessions: number // "1",
  materialCost: number // "40",
  totalCost: number // "80",
  instructionCost: number // "40",
  classSize: string // "Minimum 5, maximum 10", // Just store the max?
  limit: number
  tools: string // "Shears",
  teacher: string // "Josephine Junas-Grant ",
  scheduleSlots: number[] // [0],
  scheduleDesc: string // "Fri AM",
  hours: string // "2 hours"
}

function generateForm(structure: FormStructure, data = {}) {
  const form = document.querySelector("form")!

  for (const sectionName in structure) {
    const fields = structure[sectionName]
    tag("h2", form, sectionName)

    if (sectionName == "Workshops") {
      makeWorkshops(form, fields as Workshops)
    } else {
      for (const fieldName in fields) {
        const field = fields[fieldName]
        makeField(form, fieldName, field as Field, data)
      }
    }
  }
}

function makeWorkshops(form: HTMLFormElement, workshops: Workshops) {
  let table = tag("table", form)

  let rows: any[] = []

  for (let id in workshops) {
    let details = workshops[id]

    let tr = tag("tr", table)
    let cb = tag("input", tag("td", tr))
    rows.push({ id, cb, details })
    cb.type = "checkbox"
    cb.addEventListener("change", click(id, details, rows))
    tag("td", tr, details.title)
    tag("td", tr, "$" + details.totalCost)
    tag("td", tr, details.limit) // We actually care about how many spots are left
    tag("td", tr, details.scheduleSlots)
    tag("td", tr, details.scheduleDesc)
  }
}

const click = (myId: WorkshopId, myDetails: WorkshopDetails, rows: any[]) => (e: Event) => {
  for (const { id, cb, details } of rows) {
    if (id != myId) {
      for (let slot of myDetails.scheduleSlots) {
        let otherSlots = details.scheduleSlots as number[]
        if (otherSlots.includes(slot)) {
          cb.checked = false
        }
      }
    }
  }
}

function makeField(form: HTMLFormElement, fieldName: FieldName, field: Field, data: any) {
  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return makeTexty(form, fieldName, field, data)

    case "textarea":
      return makeTextarea(form, fieldName, field, data)

    case "radio":
      return makeRadio(form, fieldName, field, data)

    case "checkbox":
      return makeCheckbox(form, fieldName, field, data)
  }
}

function makeTexty(form: HTMLFormElement, fieldName: FieldName, field: TextyField, data: any) {
  const label = tag("label", form)
  tag("span", label, field.label)
  const input = tag("input", label)
  input.type = field.type
  input.name = fieldName
  input.value = data[fieldName] ?? ""
  persist(input, fieldName, () => input.value)
}

function makeTextarea(form: HTMLFormElement, fieldName: FieldName, field: TextyField, data: any) {
  const label = tag("label", form)
  tag("span", label, field.label)
  const textarea = tag("textarea", label)
  textarea.name = fieldName
  textarea.textContent = data[fieldName] ?? ""
  persist(textarea, fieldName, () => textarea.value)
}

function makeRadio(form: HTMLFormElement, fieldName: FieldName, field: RadioField, data: any) {
  const wrapper = tag("div", form)
  tag("span", wrapper, field.label)
  const row = tag("div", wrapper)
  row.className = "row"
  for (let key in field.options) {
    const label = tag("label", row)
    const input = tag("input", label)
    input.type = "radio"
    input.name = fieldName
    input.value = key
    if (data[fieldName] == key) input.checked = true
    persist(input, fieldName, () => key)
    tag("span", label, field.options[key])
  }
}

function makeCheckbox(form: HTMLFormElement, fieldName: FieldName, field: CheckboxField, data: any) {
  const wrapper = tag("div", form)
  tag("span", wrapper, field.label)
  const row = tag("div", wrapper)
  row.className = "row"
  for (let key in field.options) {
    const label = tag("label", row)
    const input = tag("input", label)
    input.type = "checkbox"
    input.name = fieldName
    input.value = key
    if (data[key]) input.checked = true
    persist(input, key, () => input.checked)
    tag("span", label, field.options[key])
  }
}

function persist(elm: HTMLElement, name: string, valueGetter: () => any) {
  elm.addEventListener("change", () => saveValue(name, valueGetter()))
}

function saveValue(name: string, value: any) {
  fetchJson("https://spiralganglion-weaving.web.val.run/save", { id, name, value })
}

function fetchJson(url: string, json: any, method = "POST") {
  return window.fetch(url, { method, body: JSON.stringify(json) })
}

function tag<K extends keyof HTMLElementTagNameMap>(
  name: K,
  parent: HTMLElement,
  content?: any
): HTMLElementTagNameMap[K] {
  const elm = document.createElement(name)
  parent.appendChild(elm)
  if (content) elm.textContent = content as string
  return elm
}

///////////////////////////////////////////////////////////////////////////////////////////////////

// const form = document.querySelector("form")!
// const inputs = document.querySelectorAll("input")
const loading: HTMLElement = document.querySelector(".loading")!
// const success: HTMLElement = document.querySelector(".success")!
// const failure: HTMLElement = document.querySelector(".failure")!

let id: string | null

async function loadData() {
  const url = new URL(window.location.href)
  id = url.searchParams.get("id")

  if (id == null) return console.log("No ID")

  const res = await fetchJson("https://spiralganglion-weaving.web.val.run/load", { id })

  const data: Record<string, string> = await res.json()

  generateForm(formStructure, data)

  loading.remove()
}

loadData()
