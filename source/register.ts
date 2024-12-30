export {}

const formStructure: FormStructure = {
  Basics: {
    fullName: { type: "text", required: true, label: "Full Name" },
    preferredName: { type: "text", label: "What would you like us to call you?" },
    pronouns: { type: "text", label: "Preferred Pronouns" },
    phone: { type: "tel", required: true, label: "Phone Number" },
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
        "Elvira of Under the Linden Bakehouse will be preparing vegetarian lunches and suppers for all takers. The cost is $25 per lunch and $30 per supper. Please bring your own plate, bowl, and cutlery, and kindly help out with the cleanup.<br><br>Of course, feel free to bring your own food & snacks, a mug for tea, and any specialty needs."
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
        "Where are you planning to stay?<br><br>About tenting: space is very limited, and it costs $30 for the weekend (billed separately).",
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
      class: "wide",
      label: 'Are you planning to attend the <a href="/#attending">Annual General Meeting</a> on Friday night?',
      options: { yes: "Yes", no: "No" }
    },
    attendingCelebration: {
      type: "radio",
      class: "wide",
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
        "We will refund 50% of one day of classes and materials for selected applicants. Does not include the registration fee ($25), meals, or other expenses.",
      class: "wide",
      options: { financialAssistance: "I would like to apply for financial assistance" }
    },
    payExtra: {
      type: "radio",
      class: "wide",
      label: "Would you be able to pay a little extra to cover someone else who needs help with their fees?",
      options: { 0: "No thanks", 10: "$10", 25: "$25", 50: "$50" }
    }
  },
  Workshops: {},
  "Finally…": {
    specialNotes: {
      type: "textarea",
      class: "wide",
      label: "If you have any final comments, special notes, things you'd like us to know, leave them here."
    }
  }
}

type FormStructure = Record<SectionName, SectionFields>
type SectionName = string

type SectionFields = Record<FieldName, Field>
type FieldName = string // MUST BE UNIQUE ACROSS ALL SECTIONS — this is the key we use to store the data

type Field = Note | TextyField | CheckboxField | RadioField
type TextyField = TextField | TelField | EmailField | TextArea

type BasicField = { label: string; class?: string; required?: boolean }
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
  title: string // "Dried Floral Wreath",
  image: string // "1.jpg",
  totalCost: number // 80,
  scheduleSlots: number[] // [0],
  scheduleDesc: string // "Fri AM",
}

let schedule: HTMLElement

type WorkshopCardData = {
  id: string
  cb: HTMLInputElement
  details: WorkshopDetails
}

// GENERATING THE FORM ////////////////////////////////////////////////////////////////////////////
// This code runs once during initialization

function makeForm() {
  for (const sectionName in formStructure) {
    tag("h2", form, sectionName)

    if (sectionName == "Workshops") {
      makeWorkshops()
      makeReview()
    } else {
      makeSection(formStructure[sectionName])
    }
  }

  makeSubmitButton()

  // Run all our idempotent form-updating functions
  updateWorkshopCards()
  regenerateSchedule()
  regenerateSubtotal()
}

function makeSection(fields: SectionFields) {
  let section = tag("div", form, { class: "grid" })

  for (const fieldName in fields) {
    const field = fields[fieldName]
    makeField(section, fieldName, field as Field, registrationData)
  }
}

function makeWorkshops() {
  tag("div", form, {
    content:
      "<p>Select the workshops you'd like to register for. You may only select one workshop per time slot. Feel free to leave some time empty, or just attend for one day. Note that there's a flat $25 registration fee if you are taking at least one workshop.</p><p>If you want to learn more about each of the workshops, <a href='/#workshops' target='_blank'>click here.</a></p>",
    class: "workshop-intro"
  })

  let elm = tag("div", form, { class: "workshop-tokens" })
  for (let id in workshops) makeWorkshop(elm, id, workshops[id])
}

// SPECIAL ELEMENTS /////////////////////////////////////////////////////////////////////////////////////////

function makeWorkshop(elm: HTMLDivElement, id: WorkshopId, details: WorkshopDetails) {
  let rem = remainingSeatsByWorkshop[id]
  let label = tag("label", elm, { class: rem > 0 ? "workshop-token" : "workshop-token sold-out" })

  let cb = tag("input", label)
  workshopCards.push({ id, cb, details })
  cb.checked = registrationData[id as keyof typeof registrationData]
  cb.type = "checkbox"
  if (rem > 0) cb.addEventListener("change", toggleWorkshop(id, cb, details))

  tag("img", label, { src: "/photos/" + details.image })

  let right = tag("div", label, { class: "right" })
  tag("h5", right, details.title)
  let meta = tag("div", right, { class: "meta" })
  tag("span", meta, "$" + details.totalCost)
  tag("span", meta, details.scheduleDesc)
  tag("span", right, {
    content: rem == 1 ? rem + " spot open" : rem > 0 ? rem + " spots open" : "sold out",
    class: "spots"
  })
}

function makeReview() {
  let review = tag("div", form, { class: "review" })
  schedule = tag("div", review, { class: "your-schedule" })
  let subtotalParent = tag("div", review, { class: "subtotal" })
  tag("h2", subtotalParent, "Subtotal")
  subtotalElm = tag("div", subtotalParent, { class: "table" })
}

function makeSubmitButton() {
  const submit = tag("button", form, {
    type: "button",
    class: "submit",
    content: "Proceed to Payment",
    click: async (e: Event) => {
      e.preventDefault()

      if (!form.reportValidity()) return alert("Please fill in all the required fields.")

      submit.disabled = true
      const res = await postJson("https://spiralganglion-weaving.web.val.run/submit", { id })
      if (res.err) {
        console.log(res)
        // Show a modal error with a "reload" button?
      } else if (res.paymentLink) {
        window.location.href = res.paymentLink
        submit.disabled = false // This makes sure that the form is still submittable if someone hits the back button
      }
    }
  })
}

// BASIC ELEMENTS /////////////////////////////////////////////////////////////////////////////////////////
// This code is only run once during initialization

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
  const wrapper = tag(type, parent, { class: name })
  if (field.class) wrapper.classList.add(field.class)
  tag("span", wrapper, field.label)
  return wrapper
}

function makeTexty(parent: HTMLElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("input", wrapper, {
    type: field.type,
    name,
    value: data[name] ?? "",
    required: field.required,
    change: () => saveFieldValue(name, input.value)
  })
}

function makeTextarea(parent: HTMLElement, name: FieldName, field: TextyField, data: any) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("textarea", wrapper, {
    name,
    content: data[name] ?? "",
    required: field.required,
    change: () => saveFieldValue(name, input.value)
  })
}

function makeRadio(parent: HTMLElement, name: FieldName, field: RadioField, data: any) {
  makeEnumeratedInput("radio", parent, name, field, (input, key) => {
    if (data[name] == key) input.checked = true
    input.addEventListener("change", () => saveFieldValue(name, key))
  })
}

function makeCheckbox(parent: HTMLElement, name: FieldName, field: CheckboxField, data: any) {
  makeEnumeratedInput("checkbox", parent, name, field, (input, key) => {
    if (data[key]) input.checked = true
    input.addEventListener("change", () => saveFieldValue(key, input.checked))
  })
}

type AddChangeHandler = (input: HTMLInputElement, key: string) => void

function makeEnumeratedInput(
  type: "radio" | "checkbox",
  parent: HTMLElement,
  name: FieldName,
  field: RadioField | CheckboxField,
  addChangeHandler: AddChangeHandler
) {
  const wrapper = makeWrapper("div", parent, name, field)
  const row = tag("div", wrapper, { class: "row" })
  for (let key in field.options) {
    const label = tag("label", row)
    const input = tag("input", label, { type, name, value: key, required: field.required })
    addChangeHandler(input, key)
    tag("span", label, field.options[key])
  }
}

// INTERACTION HANDLERS //////////////////////////////////////////////////////////////////////////////////////
// These functions are run after the user interacts with something in the form

function saveFieldValue(name: string, value: any) {
  registrationData[name] = value
  saveData()
}

// When a workshop is clicked, update the registration state and then save
const toggleWorkshop = (myId: WorkshopId, cb: HTMLInputElement, myDetails: WorkshopDetails) => (e: Event) => {
  // Save the new state of this checkbox
  registrationData[myId] = cb.checked

  if (cb.checked) {
    // Clear any checked checkboxes that conflict with the newly selected one
    for (const { id, cb, details } of workshopCards) {
      if (id != myId) {
        for (let slot of myDetails.scheduleSlots) {
          if (details.scheduleSlots.includes(slot) && cb.checked) {
            cb.checked = false
            registrationData[id] = false
          }
        }
      }
    }
  }

  saveData()
}

// SCHEDULE ///////////////////////////////////////////////////////////////////////////////////////
// This code is idempotent

function regenerateSchedule() {
  schedule.innerHTML = ""

  tag("h2", schedule, "Your Weekend Schedule")
  let table = tag("div", schedule, { class: "table" })

  tag("h3", table, "Friday")
  addWorkshopToSchedule(0, "9am", table)
  if (registrationData.fridayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(1, "2pm", table)
  if (registrationData.fridaySupper) addRowToSchedule(table, "6pm", "Your Supper Order")
  if (registrationData.attendingAGM == "yes") addRowToSchedule(table, "6:30pm", "Annual General Meeting")
  tag("h3", table, "Saturday")
  addWorkshopToSchedule(2, "9am", table)
  if (registrationData.saturdayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(3, "2pm", table)
  if (registrationData.saturdaySupper) addRowToSchedule(table, "6pm", "Your Supper Order")
  if (registrationData.attendingCelebration == "yes") addRowToSchedule(table, "6:30pm", "Celebration of Life")
  tag("h3", table, "Sunday")
  addWorkshopToSchedule(4, "9am", table)
  if (registrationData.sundayLunch) addRowToSchedule(table, "1pm", "Your Lunch Order")
  addWorkshopToSchedule(5, "2pm", table)
}

function addWorkshopToSchedule(i: number, name: string, table: HTMLElement) {
  let filteredCards = workshopCards.filter(({ cb, details }) => cb.checked && details.scheduleSlots.includes(i))
  let d: WorkshopCardData | null = filteredCards[0]
  let value = d?.details?.title ?? "Free time / Open Weave"
  let [labelElm, valueElm] = addRowToSchedule(table, name, value)
  if (d == null) valueElm.className = "nuttin"
}

function addRowToSchedule(table: HTMLElement, label: string, value: string) {
  return [
    tag("span", table, { content: label, class: "label" }),
    tag("span", table, { content: value, class: "value" })
  ]
}

// WORKSHOPS //////////////////////////////////////////////////////////////////////////////////////
// This code is idempotent

// Make sure all workshop card elements are greyed out if they conflict with a selected workshop
function updateWorkshopCards() {
  // Clear all existing classes
  for (const { cb } of workshopCards) cb.className = ""

  // We assume that all the selected workshops are valid — ie: no conflicts
  let selectedWorkshops = workshopCards.filter(({ cb }) => cb.checked)

  // Go through all the unselected workshops, and grey them out if they conflict with a selected workshop
  let unselectedWorkshops = workshopCards.filter(({ cb }) => !cb.checked)
  unselectedWorkshops.forEach((unchecked) => {
    selectedWorkshops.forEach((checked) => {
      for (let slot of unchecked.details.scheduleSlots) {
        if (checked.details.scheduleSlots.includes(slot)) {
          unchecked.cb.className = "faded"
        }
      }
    })
  })
}

// UPDATING THE VIEW //////////////////////////////////////////////////////////////////////////////
// This code is idempotent

function regenerateSubtotal() {
  let subtotal = 0

  subtotalElm.innerHTML = ""

  let mealCost = 0
  if (registrationData.fridayLunch) mealCost += 25
  if (registrationData.fridaySupper) mealCost += 30
  if (registrationData.saturdayLunch) mealCost += 25
  if (registrationData.saturdaySupper) mealCost += 30
  if (registrationData.sundayLunch) mealCost += 25

  if (mealCost > 0) {
    tag("div", subtotalElm, "Meals")
    tag("div", subtotalElm, "$" + mealCost)
    subtotal += mealCost
  }

  // If the field is a workshop, then grab its cost
  let workshopCost = 0
  for (const field in registrationData) {
    const workshop = workshops[field]
    if (workshop == null || registrationData[field] == false) continue
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

  // Needs to be a number, but JSON will sometimes coerce it to a string
  registrationData.payExtra = +registrationData.payExtra
  if (registrationData.payExtra > 0) {
    tag("td", subtotalElm, "Extra Contribution")
    tag("td", subtotalElm, "$" + registrationData.payExtra)
    subtotal += registrationData.payExtra
  }

  tag("td", subtotalElm, "Total")
  tag("td", subtotalElm, "$" + subtotal)
}

// SERVER CALLS ///////////////////////////////////////////////////////////////////////////////////

function postJson(url: string, json: any, method = "POST") {
  return window.fetch(url, { method, body: JSON.stringify(json) }).then((res) => res.json())
}

function saveData() {
  if (id != null) {
    const json = { id, data: registrationData }
    postJson("https://spiralganglion-weaving.web.val.run/save", json).then((x) => console.log(x))
  }

  regenerateSubtotal()
  updateWorkshopCards()
  regenerateSchedule()
}

// HTML HELPERS ///////////////////////////////////////////////////////////////////////////////////

function tag<K extends keyof HTMLElementTagNameMap>(
  name: K,
  parent: HTMLElement,
  opts: string | Record<string, any> = {}
): HTMLElementTagNameMap[K] {
  if (typeof opts == "string") opts = { content: opts }

  const elm = document.createElement(name)
  parent.appendChild(elm)

  if (opts.content) elm.innerHTML = opts.content
  if (opts.class) elm.className = opts.class

  if (opts.click) elm.addEventListener("click", opts.click)
  if (opts.change) elm.addEventListener("change", opts.change)

  const inputElm = elm as HTMLInputElement
  if (opts.type) inputElm.type = opts.type
  if (opts.name) inputElm.name = opts.name
  if (opts.value) inputElm.value = opts.value
  if (opts.required) inputElm.required = true

  const imgElm = elm as HTMLImageElement
  if (opts.src) imgElm.src = opts.src

  return elm
}

// prettier-ignore
function err(msg: string) {
  loading.remove()
  refundElm.remove()
  tag("h3", document.body, msg)
  tag("p", document.body, "Something went wrong when loading your registration. Please return to the <a href='/'>Weaving Connections</a> home page and try registering again, or email <b>albertabasketryguild@gmail.com</b> for help.")
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const form = document.querySelector("form")!
const loading: HTMLElement = document.querySelector(".loading")!
const refundElm: HTMLElement = document.querySelector("#refund")!
let subtotalElm: HTMLElement

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

let registrationData: Record<WorkshopId, any> = {}
let remainingSeatsByWorkshop: Record<WorkshopId, number> = {}
let workshopCards: WorkshopCardData[] = []

let workshops: Workshops

async function loadData() {
  if (id == null) return err("Invalid Registration")

  // Load any server-side data we need to populate the registration form
  const res = await postJson("https://spiralganglion-weaving.web.val.run/load", { id })

  if (res.err) return err("Invalid Registration")

  // We need two pieces of data to populate the form:
  // 1. Saved data for this user
  registrationData = res.registration
  // 2. The number of remaining seats for each workshop
  remainingSeatsByWorkshop = res.remaining

  workshops = await fetch("workshops.json").then((r) => r.json())

  loading.remove()
  refundElm.classList.remove("hidden")

  makeForm()
}

loadData()
