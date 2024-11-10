require "sweetbread"

task "start", "Build, watch, and serve.", ()->
  invoke "build"
  invoke "watch"
  invoke "serve"

task "build", "", ()->
  rm "public"

  compile "static", "source/**/*.!(ts)", (path)->
    copy path, replace path, "source/": "public/"

  compile "typescript", ()->
    write "public/register.js", typescript "source/register.ts"

task "watch", "Recompile on changes.", ()->
  watch "source", "build", reload

task "serve", "Spin up a live reloading server.", ()->
  serve "public"
