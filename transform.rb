require 'json'
require 'time'

NUMBER_OF_MESSAGE_FILES = 6
WORD_LIMIT = 100
MESSAGE_FORMAT = ARGV[0]
DATA_DIR = ARGV[1]

def read_json(filename)
  JSON.parse(File.read(filename))
end

def reencode(string)
  string.encode('iso-8859-1').force_encoding('utf-8')
end

stop_words = read_json('data/stopwords.json')['words'].map do |word|
  reencode(word)
end

messages = []
case MESSAGE_FORMAT
when 'messenger'
  messages = (1..NUMBER_OF_MESSAGE_FILES).map do |number|
    read_json("#{DATA_DIR}/message_#{number}.json")['messages'].reject do |message|
      message['content'].nil?
    end.sort_by do |message|
      message['timestamp_ms']
    end.map do |message|
      message['content'].encode('iso-8859-1').force_encoding('utf-8')
    end
  end.flatten
when 'telegram'
  messages = read_json("#{DATA_DIR}/messages.json")['messages'].reject do |message|
    message['text'].nil? || message['text'].empty?
  end.sort_by do |message|
    DateTime.parse(message['date']).to_time.to_i
  end.map do |message|
    message['text']
  end.flatten.reject do |message|
    message.is_a?(Hash)
  end
end

words = messages.map do |message|
  message.split.map do |word|
    word.downcase.tr('.', '').tr('?', '').tr('"', '').sub('’', "'").tr('(', '').tr(')', '').tr('!', '').tr('@', '').tr(',', '').tr('-', '')
  end.flatten
end.flatten.reject do |word|
  stop_words.include?(word) || word.include?('http') || word.empty? || word.include?('🍑') || word.include?("😂") || word.include?("📉") || word.include?("📈") || word.include?("w/")
end.reject do |word|
  %w{1 2 3 4 5 6 7 8 9 10}.include?(word)
end

top_words = Hash.new(0)
words.each do |word|
  top_words[word] += 1
end

top_words = top_words.sort_by do |(word, count)|
  count
end.reverse.first(WORD_LIMIT)

File.write("#{DATA_DIR}/top_words.json", top_words.to_json)
