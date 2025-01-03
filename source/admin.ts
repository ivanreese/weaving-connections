import { tag, postJson } from "./helpers.js"

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

function err(msg: string) {
  tag("h2", document.body, msg)
}

async function loadData() {
  if (id == null) return err("Invalid Registration")

  // Load any server-side data we need to populate the registration form
  const res = await postJson("https://spiralganglion-weaving.web.val.run/admin", { id })

  if (res.err) return err(res.err)

  let workshops = await fetch("workshops.json").then((r) => r.json())

  console.log(res.users)

  renderUsers(res.users)
  renderWorkshops(res.workshops, res.users)
  renderEmailToId()
}

function renderUsers(users: Record<string, any>[]) {
  tag("h2", document.body, "Users")
  let table = tag("table", document.body, { class: "users" })

  let headers = tag("tr", table, { class: "headers" })

  let columns = ["id", "email", "counts", "completed", "registration"]
  columns.forEach((k) => {
    tag("th", headers, k == "counts" ? "<small>Auth Load Save Submit</small>" : k)
  })

  for (let id in users) {
    let user = users[id]
    let row = tag("tr", table)

    tag("td", row, { class: "id", content: user.id })
    tag("td", row, { class: "email", content: user.email })

    let counts = tag("td", row, { class: "counts" })
    ;[user.nAuths, user.nLoads, user.nSaves, user.nSubmits].forEach((c) => tag("span", counts, { content: c }))

    tag("td", row, { class: "completed", content: user.completed })

    let reg = tag("td", row, { class: "registration" })

    let dia = tag("span", reg, { class: "dialog" })
    tag("a", dia, { class: "dialoger", content: "Data", click: () => dialog.showModal() })
    let dialog = tag("dialog", dia, { click: () => dialog.close() })
    let diaTable = tag("table", dialog)
    for (var k in user.registration) {
      let tr = tag("tr", diaTable)
      tag("td", tr, k)
      tag("td", tr, { content: user.registration[k] })
    }

    tag("span", reg, `<a href="/register.html?id=${id}&inert=true" target="_blank">Form</a>`)

    if (user.paymentId) {
      const link = `<a href="https://dashboard.stripe.com/payment-links/${user.paymentId}" target="_blank">Stripe</a>`
      tag("span", reg, link)
    }
  }
}

function renderWorkshops(workshops: Record<string, any>[], users: Record<string, any>) {
  tag("h2", document.body, "Workshops")
  let table = tag("table", document.body, { class: "workshops" })

  let columns = ["id", "limit", "buyers"]

  let headers = tag("tr", table, { class: "headers" })
  for (let k of columns) tag("th", headers, k)

  for (let id in workshops) {
    let ws = workshops[id]
    let row = tag("tr", table)

    for (let k of columns) {
      let v = ws[k]
      if (k == "buyers") {
        v = v.map((id: string) => users[id].email).join(", ")
      } else if (k == "limit") {
        v = ws.buyers.length + "/" + v
      }
      tag("td", row, { content: v, class: k })
    }
  }
}

function renderEmailToId() {
  tag("h2", document.body, "Email -> ID")
  let parent = tag("div", document.body, { class: "email-to-id" })
  let email = tag("input", parent, { type: "email" })
  tag("button", parent, {
    content: "Update",
    click: async () => {
      let res = await fetch("https://spiralganglion-weaving.web.val.run/auth", {
        body: JSON.stringify({ email: email.value, manual: true }),
        method: "POST"
      }).then((res) => res.json())
      output.textContent = res.id
      formLink.href = "/register.html?id=" + res.id
      formLink.textContent = "Form"
    }
  })
  let output = tag("div", parent)
  let formLink = tag("a", parent)
  formLink.target = "_blank"
}

loadData()
