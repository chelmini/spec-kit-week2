(function (global) {
  "use strict";

  const quotes = [
    { id: "q01", text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { id: "q02", text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { id: "q03", text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { id: "q04", text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { id: "q05", text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { id: "q06", text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { id: "q07", text: "What we think, we become.", author: "Buddha" },
    { id: "q08", text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { id: "q09", text: "Do not wait to strike till the iron is hot; make it hot by striking.", author: "William Butler Yeats" },
    { id: "q10", text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { id: "q11", text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { id: "q12", text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { id: "q13", text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
    { id: "q14", text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { id: "q15", text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
    { id: "q16", text: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn" },
    { id: "q17", text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { id: "q18", text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
    { id: "q19", text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { id: "q20", text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
    { id: "q21", text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
    { id: "q22", text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
    { id: "q23", text: "It is never too late to be what you might have been.", author: "George Eliot" },
    { id: "q24", text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { id: "q25", text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  ];

  const api = { quotes };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.QOTD = global.QOTD || {};
    global.QOTD.quotes = api.quotes;
  }
})(typeof window !== "undefined" ? window : globalThis);
