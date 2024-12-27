export {}

const formStructure: FormStructure = {
  Basics: {
    fullName: { type: "text", label: "Full Name" },
    preferredName: { type: "text", label: "What would you like us to call you?" },
    pronouns: { type: "text", label: "Preferred Pronouns" },
    phone: { type: "tel", label: "Phone Number" },
    emergencyContactName: { type: "text", label: "Emergency Contact — Name & Phone Number" },
    firstAider: {
      type: "radio",
      label: "Are you a currently certified first aider?",
      options: { yes: "Yes", no: "No" }
    },
    photoConsent: {
      type: "checkbox",
      class: "wide",
      label: "We will be taking photos of the event, and sharing them on our website and social media.",
      options: { yes: "I consent to having my photo taken & shared online." }
    }
  },
  Meals: {
    mealNote: {
      type: "note",
      label:
        "Elvira of Under the Linden Bakehouse will be preparing vegetarian lunches and suppers for all takers. The cost is $25 per lunch and $30 per supper. Please bring your own plate, bowl, and cutlery, and kindly help out a bit with the cleanup.<br><br>Of course, feel free to bring your own food & snacks, a mug for tea, and any specialty needs."
    },
    meals: {
      type: "checkbox",
      class: "wide",
      label: "Which meals would you like to purchase?",
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
      class: "wide",
      label: "For those who are interested, we will be organizing a potluck supper Friday and Saturday night.",
      options: {
        potluck: "I'd like to participate in the potluck."
      }
    },
    dietaryRestrictions: {
      type: "radio",
      class: "wide",
      label:
        "Do you have any dietary restrictions? We will strive to meet as many of these needs as possible, but do bring supplemental food if you think your needs can't be met.",
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
      class: "wide",
      label:
        "Where are you planning to stay?<br><br>About tenting: space is very limited, it costs $30 for the weekend, billed separately.",
      options: {
        tenting: "Tenting in the Greenhouse",
        hotel: "Hotel on my own",
        near: "I live nearby",
        self: "Only coming one day"
      }
    }
  },
  Activities: {
    attendingAGM: {
      type: "radio",
      label: 'Are you planning to attend the <a href="/#attending">Annual General Meeting</a> on Friday night?',
      options: { yes: "Yes", no: "No" }
    },
    attendingCelebration: {
      type: "radio",
      label:
        'Are you planning to attend the <a href="/#attending">celebration of life for Maryann</a> on Saturday night?',
      options: { yes: "Yes", no: "No" }
    },
    volunteer: {
      label:
        "We're looking for volunteers to help clean the greenhouse, and help during the event. Care to lend a hand?",
      class: "wide",
      type: "checkbox",
      options: {
        cleanGreenhouseWed: "Cleaning on Wednesday (Mar 5th)",
        helpDuringEvent: "Help during the event",
        cleanGreenhouseSun: "Cleaning on Sunday night (Mar 9th)"
      }
    }
  },
  "Financial Assistance": {
    financialAssistance: {
      type: "checkbox",
      label:
        "We have limited funds for financial assistance. This assistance will be 50% of one day of classes and materials. Participants will still need to pay the registration fee, any meals that they want to participate in, and all fees associated with any additional classes.",
      class: "wide",
      options: { financialAssistance: "I would like to request financial assistance" }
    },
    payExtra: {
      type: "radio",
      class: "wide",
      label: "Would you be able to pay a little extra to cover someone else who needs help with their fees?",
      options: { 0: "No thanks", 10: "$10", 25: "$25", 50: "$50" }
    }
  },
  Workshops: (await fetch("workshops.json").then((r) => r.json())) as Workshops,
  "Finally…": {
    specialNotes: {
      type: "textarea",
      class: "wide",
      label: "If you have any final comments, special notes, things you'd like us to know, leave them here."
    }
  }
}

type FormStructure = Record<SectionName, SectionFields | Workshops>
type SectionName = string

type SectionFields = Record<FieldName, Field>
type FieldName = string // MUST BE UNIQUE ACROSS ALL SECTIONS — this is the key we use to store the data

type Field = Note | TextyField | CheckboxField | RadioField
type TextyField = TextField | TelField | EmailField | TextArea

type BasicField = { label: string; class?: string }
type CheckboxField = BasicField & { type: "checkbox"; options: Record<string, string> } // OPTION KEY MUST BE UNIQUE
type RadioField = BasicField & { type: "radio"; options: Record<string, string> }
type TextField = BasicField & { type: "text" }
type TextArea = BasicField & { type: "textarea" }
type TelField = BasicField & { type: "tel" }
type EmailField = BasicField & { type: "email" }
type Note = BasicField & { type: "note" }

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
      let section = tag("div", form)
      section.className = "grid"

      for (const fieldName in fields) {
        const field = fields[fieldName]
        makeField(section, fieldName, field as Field, data)
      }
    }
  }

  // Make the submit button
  const submit = tag("input", form)
  submit.type = "submit"
  submit.value = "Proceed to Payment"
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
  let intro = tag(
    "div",
    form,
    "<p>Select the workshops you'd like to register for. You may only select one workshop per time slot. Feel free to leave some time empty, or just attend for one day. Note that there's a flat $25 registration fee if you are taking at least one workshop.</p></p>If you want to learn more about each of the workshops, <a href='/#workshops' target='_blank'>click here.</a></p>"
  )
  intro.className = "workshop-intro"

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

  let review = tag("div", form)
  review.className = "review"

  schedule = tag("div", review)
  schedule.className = "your-schedule"

  let subtotalParent = tag("div", review)
  subtotalParent.className = "subtotal"

  tag("h2", subtotalParent, "Subtotal")
  subtotalElm = tag("div", subtotalParent)
  subtotalElm.className = "table"

  updateRows(rows)
  updateSchedule(rows)
}

function updateSchedule(rows: Row[]) {
  schedule.innerHTML = ""

  tag("h2", schedule, "Your Weekend Schedule")
  let table = tag("div", schedule)
  table.className = "table"

  tag("h3", table, "Friday")
  addWorkshopToSchedule(0, "9am", rows, table)
  if (data.fridayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(1, "2pm", rows, table)
  if (data.fridaySupper) addRowToSchedule(table, "6pm", "Your Supper Order")
  if (data.attendingAGM) addRowToSchedule(table, "6:30pm", "Annual General Meeting")
  tag("h3", table, "Saturday")
  addWorkshopToSchedule(2, "9am", rows, table)
  if (data.saturdayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(3, "2pm", rows, table)
  if (data.saturdaySupper) addRowToSchedule(table, "6pm", "Your Supper Order")
  if (data.attendingCelebration) addRowToSchedule(table, "6:30pm", "Celebration of Life")
  tag("h3", table, "Sunday")
  addWorkshopToSchedule(4, "9am", rows, table)
  if (data.sundayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(5, "2pm", rows, table)
}

function addWorkshopToSchedule(i: number, name: string, rows: Row[], table: HTMLElement) {
  let filteredRows = rows.filter(({ cb, details }) => cb.checked && details.scheduleSlots.includes(i))
  let d: Row | null = filteredRows[0]
  let value = d?.details?.title ?? "Free time / Open Weave"
  let [labelElm, valueElm] = addRowToSchedule(table, name, value)
  if (d == null) valueElm.className = "nuttin"
}

function addRowToSchedule(table: HTMLElement, label: string, value: string) {
  let labelElm = tag("span", table, label)
  labelElm.className = "label"
  let valueElm = tag("span", table, value)
  valueElm.className = "value"
  return [labelElm, valueElm]
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

function makeField(parent: HTMLElement, fieldName: FieldName, field: Field, data: any) {
  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return makeTexty(parent, fieldName, field, data)

    case "textarea":
      return makeTextarea(parent, fieldName, field, data)

    case "radio":
      return makeRadio(parent, fieldName, field, data)

    case "checkbox":
      return makeCheckbox(parent, fieldName, field, data)

    case "note":
      return tag("p", parent, field.label)
  }
}

function makeWrapper(type: "label" | "div", parent: HTMLElement, name: FieldName, field: BasicField) {
  const wrapper = tag(type, parent)
  wrapper.className = name
  if (field.class) wrapper.classList.add(field.class)
  tag("span", wrapper, field.label)
  return wrapper
}

function makeTexty(parent: HTMLElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("input", wrapper)
  input.type = field.type
  input.name = name
  input.value = data[name] ?? ""
  input.addEventListener("change", () => saveValue(name, input.value))
}

function makeTextarea(parent: HTMLElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("textarea", wrapper)
  input.name = name
  input.innerHTML = data[name] ?? ""
  input.addEventListener("change", () => saveValue(name, input.value))
}

function makeRadio(parent: HTMLElement, name: FieldName, field: RadioField, data: any) {
  makeSelection("radio", parent, name, field, (input, key) => {
    if (data[name] == key) input.checked = true
    input.addEventListener("change", () => saveValue(name, key))
  })
}

function makeCheckbox(parent: HTMLElement, name: FieldName, field: CheckboxField, data: any) {
  makeSelection("checkbox", parent, name, field, (input, key) => {
    if (data[key]) input.checked = true
    input.addEventListener("change", () => saveValue(key, input.checked))
  })
}

type ConfigFn = (input: HTMLInputElement, key: string) => void

function makeSelection(
  type: "radio" | "checkbox",
  parent: HTMLElement,
  name: FieldName,
  field: RadioField | CheckboxField,
  cb: ConfigFn
) {
  const wrapper = makeWrapper("div", parent, name, field)
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

  // If the field is a workshop, then grab its cost
  let workshopCost = 0
  for (const field in data) {
    const workshop = formStructure.Workshops[field] as WorkshopDetails
    if (workshop == null || data[field] == false) continue
    workshopCost += workshop.totalCost
  }

  if (workshopCost > 0) {
    tag("td", subtotalElm, "Workshops")
    tag("td", subtotalElm, "$" + workshopCost)
    subtotal += workshopCost

    // Registration fee
    tag("td", subtotalElm, "Registration Fee")
    tag("td", subtotalElm, "$25")
    subtotal += 25
  }

  let mealCost = 0
  if (data.fridayLunch) mealCost += 25
  if (data.fridaySupper) mealCost += 30
  if (data.saturdayLunch) mealCost += 25
  if (data.saturdaySupper) mealCost += 30
  if (data.sundayLunch) mealCost += 25

  if (mealCost > 0) {
    tag("div", subtotalElm, "Meals")
    tag("div", subtotalElm, "$" + mealCost)
    subtotal += mealCost
  }

  // Needs to be a number, but JSON will sometimes coerce it to a string
  data.payExtra = +data.payExtra
  if (data.payExtra > 0) {
    tag("td", subtotalElm, "Extra Contribution")
    tag("td", subtotalElm, "$" + data.payExtra)
    subtotal += data.payExtra
  }

  tag("td", subtotalElm, "Total")
  tag("td", subtotalElm, "$" + subtotal)
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
let subtotalElm: HTMLElement

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

let data: Record<WorkshopId, any> = {}
let remaining: Record<WorkshopId, any> = {}

// prettier-ignore
function err(msg: string) {
  loading.remove()
  tag("h3", document.body, msg)
  tag("p", document.body, "Something went wrong when loading your registration. Please return to the <a href='/'>Weaving Connections</a> home page and try registering again, or email <b>albertabasketryguild@gmail.com</b> for help.")
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
