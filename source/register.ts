export {}

const formStructure: FormStructure = {
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
    faNote: {
      type: "note",
      label:
        "Which meals will you require? Feel free to bring potluck snacks, a mug for tea, and any specialty needs. Lunch and supper will be provided by Elvira of Under the Linden Bakehouse. $25 for lunch and $30 for supper. Please bring a plate, bowl, and cutlery. Community cleanup will be appreciated."
    },
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
    potluck: {
      type: "checkbox",
      label: "For those who are interested, we will be organizing a potluck supper Friday and Saturday night.",
      options: {
        potluck: "I'd like to participate in the potluck."
      }
    },
    dietaryRestrictions: {
      type: "radio",
      label:
        "Dietary restrictions? We will strive to meet as many of these needs as possible, but do bring snacks if you think your needs can't be met.",
      options: {
        none: "None",
        vegetarian: "Vegetarian",
        vegan: "Vegan",
        glutenFree: "Gluten-free",
        other: "Other (explain below)"
      }
    },
    foodAllergies: {
      type: "text",
      label: ""
    }
  },
  Accommodations: {
    accommodation: {
      type: "radio",
      label: "Where are you planning to stay? (Note: tenting space is very limited.)",
      options: {
        tenting: "Tenting in the Greenhouse ($20 for 2 nights)",
        hotel: "Hotel on my own",
        near: "I live nearby",
        self: "Only coming one day"
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
    faNote: {
      type: "note",
      label:
        "We're happy to offer financial assistance to those who need help with the cost of attending Weaving Connections. This financial assistance is covered by the generous donations of other attendees."
    },
    financialAssistance: {
      type: "radio",
      label: "Would you like to request financial assistance to cover some or all of your fees?",
      options: { yes: "Yes", no: "No" }
    },
    payExtra: {
      type: "radio",
      label: "Would you be able to pay a little extra to cover someone else who needs help with their fees?",
      options: { yes: "Yes", no: "No" }
    }
  },
  Workshops: await fetch("workshops.json").then((r) => r.json())
}

type FormStructure = Record<SectionName, SectionFields | Workshops>
type SectionName = string

type SectionFields = Record<FieldName, Field>
type FieldName = string // MUST BE UNIQUE ACROSS ALL SECTIONS — this is the key we use to store the data

type Field = Note | TextyField | CheckboxField | RadioField
type TextyField = TextField | TelField | EmailField | TextArea

type CheckboxField = { type: "checkbox"; label: string; options: Record<string, string> } // OPTION KEY MUST BE UNIQUE
type RadioField = { type: "radio"; label: string; options: Record<string, string> }
type TextField = { type: "text"; label: string }
type TextArea = { type: "textarea"; label: string }
type TelField = { type: "tel"; label: string }
type EmailField = { type: "email"; label: string }
type Note = { type: "note"; label: string }

type Workshops = Record<WorkshopId, WorkshopDetails>
type WorkshopId = string
type WorkshopDetails = {
  image: string // "1.jpg",
  description: string // "Great for beginners.",
  title: string // "Dried Floral Wreath",
  materialCost: number // 40,
  totalCost: number // 80,
  instructionCost: number // 40,
  limit: number
  tools: string // "Shears",
  teacher: string // "Josephine Junas-Grant ",
  scheduleSlots: number[] // [0],
  scheduleDesc: string // "Fri AM",
}

function generateForm(structure: FormStructure, data = {}) {
  const form = document.querySelector("form")!

  for (const sectionName in structure) {
    const fields = structure[sectionName]
    tag("h2", form, sectionName)

    if (sectionName == "Workshops") {
      makeWorkshops(form, fields as Workshops, data)
    } else {
      for (const fieldName in fields) {
        const field = fields[fieldName]
        makeField(form, fieldName, field as Field, data)
      }
    }
  }
}

let schedule: HTMLElement

type Row = {
  id: string
  cb: HTMLInputElement
  details: WorkshopDetails
}

function makeWorkshops(form: HTMLFormElement, workshops: Workshops, data = {}) {
  tag(
    "p",
    form,
    "Select the workshops you'd like to register for. You may only select one workshop per time slot. Feel free to leave some time empty, or just attend for one day."
  )

  let elm = tag("div", form)
  elm.className = "workshop-tokens"

  let rows: Row[] = []

  for (let id in workshops) {
    let details = workshops[id]

    let label = tag("label", elm)
    label.className = "workshop-token"

    let cb = tag("input", label)
    rows.push({ id, cb, details })
    cb.checked = data[id]
    cb.type = "checkbox"
    cb.addEventListener("change", click(id, cb, details, rows))

    let img = tag("img", label)
    img.src = "/photos/" + details.image

    let right = tag("div", label)
    right.className = "right"

    tag("h5", right, details.title)

    let meta = tag("div", right)
    meta.className = "meta"

    tag("span", meta, "$" + details.totalCost)
    tag("span", meta, details.scheduleDesc)

    let spots = tag("span", right, details.limit + " spots open")
    spots.className = "spots"
  }

  schedule = tag("div", form)
  schedule.className = "your-schedule"

  updateRows(rows)
  updateSchedule(rows)
}

function updateSchedule(rows: Row[]) {
  schedule.innerHTML = ""

  tag("h3", schedule, "Your Workshop Schedule")
  let table = tag("table", schedule)

  let segs = ["Friday AM", "Friday PM", "Saturday AM", "Saturday PM", "Sunday AM", "Sunday PM"]
  for (let i = 0; i < segs.length; i++) {
    let time = segs[i]
    let filteredRows = rows.filter(({ cb, details }) => cb.checked && details.scheduleSlots.includes(i))

    let d: Row | null = filteredRows[0]
    let tr = tag("tr", table)
    tag("td", tr, time)
    let title = tag("td", tr, d?.details?.title ?? "Nothing selected")
    if (d == null) title.className = "nuttin"
  }
}

const click = (myId: WorkshopId, cb: HTMLInputElement, myDetails: WorkshopDetails, rows: Row[]) => (e: Event) => {
  // Save the new state of this checkbox
  saveValue(myId, cb.checked)

  if (cb.checked) {
    // Clear any checked checkboxes that conflict with the newly selected one
    for (const { id, cb, details } of rows) {
      if (id != myId) {
        for (let slot of myDetails.scheduleSlots) {
          if (details.scheduleSlots.includes(slot) && cb.checked) {
            cb.checked = false
            saveValue(id, false)
          }
        }
      }
    }
  }

  updateRows(rows)
  updateSchedule(rows)
}

function updateRows(rows: Row[]) {
  for (const { cb } of rows) cb.className = ""

  let checkedRows = rows.filter(({ cb }) => cb.checked)
  let uncheckedRows = rows.filter(({ cb }) => !cb.checked)

  uncheckedRows.forEach((unchecked) => {
    checkedRows.forEach((checked) => {
      for (let slot of unchecked.details.scheduleSlots) {
        if (checked.details.scheduleSlots.includes(slot)) {
          unchecked.cb.className = "faded"
        }
      }
    })
  })
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

    case "note":
      return tag("p", form, field.label)
  }
}

function makeWrapper(type: "label" | "div", form: HTMLFormElement, name: FieldName, label: string) {
  const wrapper = tag(type, form)
  wrapper.className = name
  tag("span", wrapper, label)
  return wrapper
}

function makeTexty(form: HTMLFormElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", form, name, field.label)
  const input = tag("input", wrapper)
  input.type = field.type
  input.name = name
  input.value = data[name] ?? ""
  input.addEventListener("change", () => saveValue(name, input.value))
}

function makeTextarea(form: HTMLFormElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", form, name, field.label)
  const input = tag("textarea", wrapper)
  input.name = name
  input.innerHTML = data[name] ?? ""
  input.addEventListener("change", () => saveValue(name, input.value))
}

function makeRadio(form: HTMLFormElement, name: FieldName, field: RadioField, data: any) {
  makeSelection("radio", form, name, field, (input, key) => {
    if (data[name] == key) input.checked = true
    input.addEventListener("change", () => saveValue(name, key))
  })
}

function makeCheckbox(form: HTMLFormElement, name: FieldName, field: CheckboxField, data: any) {
  makeSelection("checkbox", form, name, field, (input, key) => {
    if (data[key]) input.checked = true
    input.addEventListener("change", () => saveValue(name, input.checked))
  })
}

type ConfigFn = (input: HTMLInputElement, key: string) => void

function makeSelection(
  type: "radio" | "checkbox",
  form: HTMLFormElement,
  name: FieldName,
  field: RadioField | CheckboxField,
  cb: ConfigFn
) {
  const wrapper = makeWrapper("div", form, name, field.label)
  const row = tag("div", wrapper)
  row.className = "row"
  for (let key in field.options) {
    const label = tag("label", row)
    const input = tag("input", label)
    input.type = type
    input.name = name
    input.value = key
    cb(input, key)
    tag("span", label, field.options[key])
  }
}

function saveValue(name: string, value: any) {
  console.log("save", name, value)
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
  if (content) elm.innerHTML = content as string
  return elm
}

///////////////////////////////////////////////////////////////////////////////////////////////////

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

  // TODO: Handle the case where this ID is invalid (like, someone just typed random stuff in the URL)

  // const data = {}

  generateForm(formStructure, data)

  loading.remove()
}

loadData()
