import { tag, postJson } from "./helpers.js"

// This is the "declarative" description of (most of) the registration form
const formDescription: FormDescription = {
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
      label: "We need volunteers to help clean the greenhouse, and help out during the event. Care to lend a hand?",
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
    // financialAssistance: {
    //   type: "checkbox",
    //   label:
    //     "We will refund 50% of one day of classes and materials for selected applicants. Does not include the registration fee ($25), meals, or other expenses. We'll apply the refund after you pay, once we have a chance to review all the applications (our funds for this are quite limited).",
    //   class: "wide",
    //   options: { financialAssistance: "I would like to apply for financial assistance" }
    // },
    payExtra: {
      type: "radio",
      class: "wide",
      label: "Would you be able to pay a little extra to cover someone else who needs help with their fees?",
      options: { 0: "No thanks", 10: "$10", 25: "$25", 50: "$50" }
    }
  },
  Workshops: {},
  Review: {},
  "Finally…": {
    specialNotes: {
      type: "textarea",
      class: "wide",
      label: "If you have any final comments, special notes, things you'd like us to know, leave them here."
    }
  },
  Submit: {}
}

// And these are all the types for the above declarative description of the form

type FormDescription = Record<SectionName, SectionDescription>

type SectionName = string
type SectionDescription = Record<FieldName, FieldDescription>

type FieldName = string // MUST BE UNIQUE ACROSS ALL SECTIONS — this is the key we use to store the data
type FieldDescription = Note | TextishField | CheckboxField | RadioField

type BasicField = { label: string; class?: string; required?: boolean }
type CheckboxField = BasicField & { type: "checkbox"; options: Record<string, string> } // OPTION KEY MUST BE UNIQUE
type RadioField = BasicField & { type: "radio"; options: Record<string, string> }
type TextField = BasicField & { type: "text" }
type TextArea = BasicField & { type: "textarea" }
type TelField = BasicField & { type: "tel" }
type EmailField = BasicField & { type: "email" }
type Note = BasicField & { type: "note" }
type TextishField = TextField | TelField | EmailField | TextArea

// These are the types for the workshops loaded from workshops.json
type WorkshopDescriptions = Record<WorkshopId, WorkshopDescription>
type WorkshopId = string
type WorkshopDescription = {
  title: string // "Dried Floral Wreath",
  image: string // "1.jpg",
  totalCost: number // 80,
  scheduleSlots: number[] // [0],
  scheduleDesc: string // "Fri AM",
}

// We turn each of the workshops into a little "token"-like element, which requires some state
type WorkshopTokenData = {
  id: WorkshopId
  checkbox: HTMLInputElement // checkbox that stores whether the workshop has been picked
  description: WorkshopDescription
}

// GENERATING THE FORM ////////////////////////////////////////////////////////////////////////////
// This code runs once during initialization

function makeForm() {
  for (const sectionName in formDescription) {
    if (sectionName == "Workshops") {
      makeWorkshops()
    } else if (sectionName == "Review") {
      makeReview()
    } else if (sectionName == "Submit") {
      makeSubmitButton()
    } else {
      makeGenericSection(sectionName)
    }
  }
}

// WORKSHOPS SECTION //////////////////////////////////////////////////////////////////////////////
// This code runs once during initialization

function makeWorkshops() {
  tag("h2", form, "Workshops")
  tag("div", form, {
    content:
      "<p>Select the workshops you'd like to register for. You may only select one workshop per time slot. Feel free to leave some time empty, or just attend for one day. Note that there's a flat $25 registration fee if you are taking at least one workshop.</p><p>If you want to learn more about each of the workshops, <a href='/#workshops' target='_blank'>click here.</a></p>",
    class: "workshop-intro"
  })

  let elm = tag("div", form, { class: "workshop-tokens" })
  for (let id in workshopDescriptions) makeWorkshop(elm, id, workshopDescriptions[id])
}

function makeWorkshop(elm: HTMLDivElement, id: WorkshopId, description: WorkshopDescription) {
  let rem = remainingSeatsByWorkshop[id]
  let label = tag("label", elm, { class: rem > 0 ? "workshop-token" : "workshop-token sold-out" })

  let checkbox = tag("input", label)
  workshopTokens.push({ id, checkbox, description })
  checkbox.checked = registrationData[id as keyof typeof registrationData]
  checkbox.type = "checkbox"
  checkbox.addEventListener("change", toggleWorkshop(id, checkbox, description))

  tag("img", label, { src: "/photos/" + description.image })

  let right = tag("div", label, { class: "right" })
  tag("h5", right, description.title)
  let meta = tag("div", right, { class: "meta" })
  tag("span", meta, "$" + description.totalCost)
  tag("span", meta, description.scheduleDesc)
  tag("span", right, {
    content: rem == 1 ? rem + " spot open" : rem > 0 ? rem + " spots open" : "sold out",
    class: "spots"
  })
}

// When a workshop is clicked, update the registration state and then save
const toggleWorkshop = (myId: WorkshopId, cb: HTMLInputElement, myDetails: WorkshopDescription) => (e: Event) => {
  let rem = remainingSeatsByWorkshop[myId]
  if (rem <= 0) {
    cb.checked = false
  }

  // Save the new state of this checkbox
  registrationData[myId] = cb.checked

  if (cb.checked) {
    // Clear any checked checkboxes that conflict with the newly selected one
    for (const { id, checkbox: cb, description: details } of workshopTokens) {
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

// REVIEW SECTION /////////////////////////////////////////////////////////////////////////////////
// This code runs once during initialization

function makeReview() {
  let review = tag("div", form, { class: "review" })

  schedule = tag("div", review, { class: "your-schedule" })

  let subtotalParent = tag("div", review, { class: "subtotal" })
  tag("h2", subtotalParent, "Subtotal")

  subtotalElm = tag("div", subtotalParent, { class: "table" })
}

// SUBMIT SECTION /////////////////////////////////////////////////////////////////////////////////
// This code runs once during initialization

function makeSubmitButton() {
  submitButton = tag("button", form, {
    type: "button",
    class: "submit",
    content: "Proceed to Payment", // Updated by rerender()
    click: async (e: Event) => {
      e.preventDefault()

      if (!form.reportValidity()) return alert("Please fill in all the required fields.")

      inert = true
      rerender()

      const res = await postJson("https://spiralganglion-weaving.web.val.run/submit", { id })

      if (res.paymentLink) {
        window.location.href = res.paymentLink
      } else if (res.err == "sold-out") {
        alert("Sorry — one or more of the workshops you selected are now sold out.")
        window.location.reload()
      } else {
        alert("Sorry — we were unable to prepare the checkout form, and you'll need to try again.")
        window.location.reload()
      }
    }
  })
}

// GENERIC SECTION ////////////////////////////////////////////////////////////////////////////////
// This code is only run during initialization

function makeGenericSection(sectionName: SectionName) {
  let sectionDescription = formDescription[sectionName]

  tag("h2", form, sectionName)
  let sectionElm = tag("div", form, { class: "grid" })

  // fieldName will be things like "fullName" or "pronouns"
  for (const fieldName in sectionDescription) {
    const fieldDescription = sectionDescription[fieldName]
    makeField(sectionElm, fieldName, fieldDescription)
  }
}

function makeField(parent: HTMLElement, fieldName: FieldName, field: FieldDescription) {
  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return makeTextishInput(parent, fieldName, field)

    case "textarea":
      return makeTextarea(parent, fieldName, field)

    case "radio":
      return makeRadio(parent, fieldName, field)

    case "checkbox":
      return makeCheckbox(parent, fieldName, field)

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

function makeTextishInput(parent: HTMLElement, name: FieldName, field: TextishField) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("input", wrapper, {
    type: field.type,
    name,
    value: registrationData[name] ?? "",
    required: field.required,
    change: () => saveFieldValue(name, input.value)
  })
}

function makeTextarea(parent: HTMLElement, name: FieldName, field: TextishField) {
  const wrapper = makeWrapper("label", parent, name, field)
  const input = tag("textarea", wrapper, {
    name,
    content: registrationData[name] ?? "",
    required: field.required,
    change: () => saveFieldValue(name, input.value)
  })
}

function makeRadio(parent: HTMLElement, name: FieldName, field: RadioField) {
  makeEnumeratedInput("radio", parent, name, field, (input, key) => {
    if (registrationData[name] === key) input.checked = true
    input.addEventListener("change", () => saveFieldValue(name, key))
  })
}

function makeCheckbox(parent: HTMLElement, name: FieldName, field: CheckboxField) {
  makeEnumeratedInput("checkbox", parent, name, field, (input, key) => {
    if (registrationData[key]) input.checked = true
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

function saveFieldValue(name: string, value: any) {
  registrationData[name] = value
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
  let filteredTokens = workshopTokens.filter(
    ({ checkbox: cb, description: details }) => cb.checked && details.scheduleSlots.includes(i)
  )
  let d: WorkshopTokenData | null = filteredTokens[0]
  let value = d?.description?.title ?? "Free time / Open Weave"
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

// Make sure all workshop token elements are greyed out if they conflict with a selected workshop
function updateWorkshopTokens() {
  // Clear all existing classes
  for (const { checkbox: cb } of workshopTokens) cb.className = ""

  // We assume that all the selected workshops are valid — ie: no conflicts
  let selectedWorkshops = workshopTokens.filter(({ checkbox: cb }) => cb.checked)

  // Go through all the unselected workshops, and grey them out if they conflict with a selected workshop
  let unselectedWorkshops = workshopTokens.filter(({ checkbox: cb }) => !cb.checked)
  unselectedWorkshops.forEach((unchecked) => {
    selectedWorkshops.forEach((checked) => {
      for (let slot of unchecked.description.scheduleSlots) {
        if (checked.description.scheduleSlots.includes(slot)) {
          unchecked.checkbox.className = "faded"
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
    const workshop = workshopDescriptions[field]
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
  let payExtra = +registrationData.payExtra
  if (payExtra > 0) {
    tag("td", subtotalElm, "Extra Contribution")
    tag("td", subtotalElm, "$" + payExtra)
    subtotal += payExtra
  }

  tag("td", subtotalElm, "Total")
  tag("td", subtotalElm, "$" + subtotal)

  submitButton.innerHTML = subtotal > 0 ? "Proceed to Payment" : "Register for Free"
}

// SAVE & RE-RENDER ///////////////////////////////////////////////////////////////////////////////

function saveData() {
  if (inert) return

  if (id != null) {
    const json = { id, data: registrationData }
    postJson("https://spiralganglion-weaving.web.val.run/save", json).then((x) => console.log(x))
  }

  rerender()
}

function rerender() {
  document.body.classList.toggle("inert", inert)
  regenerateSubtotal()
  updateWorkshopTokens()
  regenerateSchedule()
}

///////////////////////////////////////////////////////////////////////////////////////////////////

const form = document.querySelector("form")!
const loading: HTMLElement = document.querySelector(".loading")!
const refundElm: HTMLElement = document.querySelector("#refund")!
let subtotalElm: HTMLElement

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

// When the page is "inert", the user can't interact with it and changes won't be saved.
// It will go inert:
// * Right when the form is submitted (so that if the user hits Back, they can't change stuff)
// * When anyone views a completed form
// * When an admin views the form (even if it's not completed)
let inert = url.searchParams.get("inert") == "true"

let registrationData: Record<WorkshopId, any> = {}
let remainingSeatsByWorkshop: Record<WorkshopId, number> = {}
let workshopTokens: WorkshopTokenData[] = []

let workshopDescriptions: WorkshopDescriptions

let schedule: HTMLElement
let submitButton: HTMLButtonElement

async function loadData() {
  if (id == null) return err("Invalid Registration")

  // Load any server-side data we need to populate the registration form
  const res = await postJson("https://spiralganglion-weaving.web.val.run/load", { id })

  if (res.err) return err("Invalid Registration")

  // We need several pieces of data to populate the form:
  registrationData = res.registration
  remainingSeatsByWorkshop = res.remaining
  workshopDescriptions = await fetch("workshops.json").then((r) => r.json())

  // Done loading
  loading.remove()
  refundElm.classList.remove("hidden")

  if (res.completed) {
    tag("h4", form, "Your registration has been submitted.")
    tag("h4", form, "If you need to make changes, send us an email.")
    inert = true
  }

  // Do all the one-time form generation
  makeForm()

  // Run all our idempotent form-updating functions
  updateWorkshopTokens()
  regenerateSchedule()
  regenerateSubtotal()
}

// prettier-ignore
function err(msg: string) {
  loading.remove()
  refundElm.remove()
  tag("h3", document.body, msg)
  tag("p", document.body, "Something went wrong when loading your registration. Please return to the <a href='/'>Weaving Connections</a> home page and try registering again, or email <b>albertabasketryguild@gmail.com</b> for help.")
}

loadData()
