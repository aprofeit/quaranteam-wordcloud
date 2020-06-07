# Quaranteam Word Cloud

This app is composed of a ruby script to transform exported facebook data and a javascript file to generate the visualization.

The ruby script is contained within [`transform.rb`](https://github.com/aprofeit/quaranteam-wordcloud/blob/master/transform.rb) and the javscript is contained within [`app.js`](https://github.com/aprofeit/quaranteam-wordcloud/blob/master/app.js). It expects exported Facebook message data to exist within `data/message_*.json`.

Depending on the number of message files exported, the [`NUMBER_OF_MESSAGE_FILES`](https://github.com/aprofeit/quaranteam-wordcloud/blob/5d91d80a10829b4761b7b5cf4f8ec2c661c912d7/transform.rb#L3) constant should be adjusted accordingly. The [`WORD_LIMIT`](https://github.com/aprofeit/quaranteam-wordcloud/blob/73ce9be7d833135ddee755be8b30a01c60c21a12/transform.rb#L4) constant can also be adjusted to change the number of words to populate the cloud. 

When the data exists there, the javascript bundle can be built by running `script/build`. Once that is completed you can see the word cloud by opening `index.html` in your browser of choice. 

# Example output

![Example output](https://github.com/aprofeit/quaranteam-wordcloud/raw/master/example/example.png)
