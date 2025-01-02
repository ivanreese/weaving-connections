# Weaving Connections

WIP on the website for Weaving Connections 2025

To manually get an ID for an email address, run:

```
const email = "email@example.com"
await window.fetch("https://spiralganglion-weaving.web.val.run/auth", {
  method: "POST",
  body: JSON.stringify({ email, manual: true })
})
```
