require "sweetbread"

task "start", "Build, watch, and serve.", ()->
  invoke "build"
  invoke "watch"
  invoke "serve"

indent = (s)-> s.split("\n").map((l)-> "          " + l).join("\n")

task "build", "", ()->
  rm "public"

  workshopCardTemplate = read "templates/workshop-card.html"
  workshopsJson = JSON.parse read "source/workshops.json"

  workshopCardElms = for name, workshop of workshopsJson
    card = workshopCardTemplate
    card = replace card, "{{#{k}}}": v for k, v of workshop
    indent card

  cardsHtml = "\n" + workshopCardElms.join "\n\n"

  compile "html", "source/**/*.html", (path)->
    dest = replace path, "source/": "public/"
    write dest, replace read(path), "{{CARDS}}": cardsHtml

  compile "static", "source/**/*.!(ts|html)", (path)->
    copy path, replace path, "source/": "public/"

  compile "typescript", "source/**/*.ts", (path)->
    dest = replace path, "source/": "public/", ".ts": ".js"
    write dest, typescript path

task "watch", "Recompile on changes.", ()->
  watch "source", "build", reload
  watch "templates", "build", reload
  watch "workshops.json", "build", reload

task "serve", "Spin up a live reloading server.", ()->
  serve "public"
