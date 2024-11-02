require "sweetbread"

task "watch", "Recompile on changes.", ()->
  watch ".", reload

task "serve", "Spin up a live reloading server.", ()->
  serve "."

task "start", "Build, watch, and serve.", ()->
  invoke "watch"
  invoke "serve"
