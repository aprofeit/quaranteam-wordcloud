# Quaranteam Word Cloud

This app is composed of a ruby script to transform exported facebook data and a javascript file to generate the visualization.

The ruby script is contained within `transform.rb` and the javscript is contained within `app.js`. It expects exported Facebook message data to exist within `data/message_*.json`. When the data exists there, the bundle can be built by running `script/build`. Once that is completed you can see the word cloud by opening `index.html`.
