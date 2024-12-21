export {}

const formStructure: FormStructure = {
  Basics: {
    fullName: { type: "text", label: "Full Name" },
    preferredName: { type: "text", label: "What would you like us to call you?" },
    pronouns: { type: "text", label: "Preferred Pronouns" },
    phone: { type: "tel", label: "Phone" },
    firstAider: {
      type: "radio",
      label: "Are you a currently certified first aider?",
      options: { yes: "Yes", no: "No" }
    },
    emergencyContactName: { type: "text", label: "Emergency Contact (Name)" },
    emergencyContactPhone: { type: "text", label: "Emergency Contact (Phone)" }
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
        sundayLunch: "Sunday Lunch"
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
        "Dietary restrictions? We will strive to meet as many of these needs as possible, but do bring supplemental food if you think your needs can't be met.",
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
        tenting: "Tenting in the Greenhouse ($30 for the weekend, billed separately)",
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
    financialAssistance: {
      label:
        "We have limited funds for financial assistance. This assistance will be 50% of one day of classes and materials. Participants will still need to pay the registration fee, any meals that they want to participate in, and all fees associated with any additional classes.",
      type: "checkbox",
      options: { financialAssistance: "I would like to request financial assistance" }
    },
    payExtra: {
      type: "radio",
      label: "Would you be able to pay a little extra to cover someone else who needs help with their fees?",
      options: { 0: "No thanks", 10: "$10", 25: "$25", 50: "$50" }
    },
    volunteer: {
      label: "We're looking for volunteers to help with some of the prep work. If you'd like to help, let us know.",
      type: "checkbox",
      options: {
        cleanGreenhouseWed: "Cleaning the greenhouse on Wednesday (Mar 5th)",
        helpDuringEvent: "Help during the event",
        cleanGreenhouseSun: "Cleaning the greenhouse on Sunday night (Mar 9th)"
      }
    },
    specialNotes: {
      type: "textarea",
      label: "Special Notes / Anything you'd like us to know?"
    }
  },
  Workshops: (await fetch("workshops.json").then((r) => r.json())) as Workshops
}

const costs = {
  fridayLunch: { is: true, cost: 25 },
  fridaySupper: { is: true, cost: 30 },
  saturdayLunch: { is: true, cost: 25 },
  saturdaySupper: { is: true, cost: 30 },
  sundayLunch: { is: true, cost: 25 }
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

  const submit = tag("input", form)
  submit.type = "submit"
  submit.onclick = async (e) => {
    e.preventDefault()
    submit.disabled = true
    const res = await fetchJson("https://spiralganglion-weaving.web.val.run/submit", { id })
    if (res.err) {
      console.log(res)
      // Show a modal error with a "reload" button?
    } else if (res.paymentLink) {
      window.location.href = res.paymentLink
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
    let rem = remaining[id]

    let label = tag("label", elm)
    label.className = rem > 0 ? "workshop-token" : "workshop-token sold-out"

    // TODO: What do we do if someone selected this workshop when it was available,
    // we saved this state, but they didn't finish registering, then they came back later
    // and the workshop is now sold out?
    // We ought to deselect it and save that to the server… but how do we tell if their
    // registration is finalized or not?
    // We probably need some state to indicate that a registration is finalized,
    // but still let people change the fields that don't affect payment or mess up our records.

    let cb = tag("input", label)
    rows.push({ id, cb, details })
    cb.checked = data[id as keyof typeof data]
    cb.type = "checkbox"
    if (rem > 0) cb.addEventListener("change", toggleWorkshop(id, cb, details, rows))

    let img = tag("img", label)
    img.src = "/photos/" + details.image

    let right = tag("div", label)
    right.className = "right"

    tag("h5", right, details.title)

    let meta = tag("div", right)
    meta.className = "meta"

    tag("span", meta, "$" + details.totalCost)
    tag("span", meta, details.scheduleDesc)

    let spots = tag("span", right, rem == 1 ? rem + " spot open" : rem > 0 ? rem + " spots open" : "sold out")
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
    let title = tag("td", tr, d?.details?.title ?? "Free time / Open Weave")
    if (d == null) title.className = "nuttin"
  }
}

const toggleWorkshop =
  (myId: WorkshopId, cb: HTMLInputElement, myDetails: WorkshopDetails, rows: Row[]) => (e: Event) => {
    // Save the new state of this checkbox
    data[myId] = cb.checked

    if (cb.checked) {
      // Clear any checked checkboxes that conflict with the newly selected one
      for (const { id, cb, details } of rows) {
        if (id != myId) {
          for (let slot of myDetails.scheduleSlots) {
            if (details.scheduleSlots.includes(slot) && cb.checked) {
              cb.checked = false
              data[id] = false
            }
          }
        }
      }
    }

    saveData()
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
    input.addEventListener("change", () => saveValue(key, input.checked))
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
  data[name] = value
  saveData()
}

function saveData() {
  if (id != null) fetchJson("https://spiralganglion-weaving.web.val.run/save", { id, data }).then((x) => console.log(x))
  updateSubtotal()
}

function updateSubtotal() {
  let subtotal = 0
  subtotalElm.innerHTML = ""

  // Registration fee
  subtotal += 25
  let tr = tag("tr", subtotalElm)
  tag("td", tr, "Registration Fee")
  tag("td", tr, "$25")

  // Go through all the fields in our saved data, and see if any of them have a cost associated with them
  // If the field is one of the things we explicitly list a cost for (eg: meals) then grab that cost
  for (const field in data) {
    const costsForField = costs[field as keyof typeof costs]
    if (costsForField?.is != data[field]) continue
    subtotal += costsForField.cost
    tr = tag("tr", subtotalElm)
    tag("td", tr, field)
    tag("td", tr, "$" + costsForField.cost)
  }

  // If the field is a workshop, then grab its cost
  for (const field in data) {
    const workshop = formStructure.Workshops[field] as WorkshopDetails
    if (workshop == null || data[field] == false) continue
    subtotal += workshop.totalCost
    tr = tag("tr", subtotalElm)
    tag("td", tr, workshop.title)
    tag("td", tr, "$" + workshop.totalCost)
  }

  tr = tag("tr", subtotalElm)
  tag("td", tr, "Total")
  tag("td", tr, "$" + subtotal)
}

function fetchJson(url: string, json: any, method = "POST") {
  return window.fetch(url, { method, body: JSON.stringify(json) }).then((res) => res.json())
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
const subtotalElm: HTMLElement = document.querySelector(".subtotal")!
const section = document.querySelector("section")!

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

let data: Record<WorkshopId, any> = {}
let remaining: Record<WorkshopId, any> = {}

// prettier-ignore
function err(msg: string) {
  loading.remove()
  tag("h3", section, msg)
  tag("p", section, "Something went wrong when loading your registration. Please return to the <a href='/'>Weaving Connections</a> home page and try registering again, or email <b>fulveland@gmail.com</b> for help.")
}

async function loadData() {
  if (id == null) return err("Invalid Registration")

  const res = await fetchJson("https://spiralganglion-weaving.web.val.run/load", { id })

  if (res.err) return err("Invalid Registration")

  data = res.registration
  remaining = res.remaining

  generateForm(formStructure, data)
  updateSubtotal()
  loading.remove()
}

loadData()
