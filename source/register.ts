export {}

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
      tools: "Shears",
      teacher: "Josephine Junas-Grant ",
      scheduleSlots: [0],
      scheduleDesc: "Fri AM",
      hours: "2 hours"
    },
    willowSweedishStars: {
      image: "2.jpg",
      description:
        "Create an elegant Swedish Star from foraged willow. The design can be scaled large or small, and you can bring decorative yarn, cordage, or fabric to adorn your star.",
      title: "Willow Swedish Stars",
      sessions: 1,
      materialCost: 30,
      totalCost: 70,
      instructionCost: 40,
      classSize: "Minimum 5; maximum 10",
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
      tools: "Sharp pruners, sharp locking blade",
      teacher: "Karla Powell",
      scheduleSlots: [0],
      scheduleDesc: "Fri AM",
      hours: "1 hour"
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

  for (let id in workshops) {
    let details = workshops[id]
    let tr = tag("tr", table)
    tag("td", tr, details.title)
    tag("td", tr, "$" + details.totalCost)
    tag("td", tr, details.classSize)
    tag("td", tr, details.scheduleSlots)
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
