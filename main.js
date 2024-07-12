const cheerio = require("cheerio");
const axios = require("axios");

const args = process.argv.slice(2);

function printWelcome() {
  console.log(`
    Welcome to my first CLI application !
    
    Type help for more information.`);
}

function printHelp() {
  console.log(`
    You can search a URL to print the text content of an element that matches the selector.

    Usage : <url> <css_selector>
    Example : https://example.com div>h1
    `);
}

function parseArguments(args) {
  const options = {};

  if (args.length === 0) {
    options.welcome = true;
  }

  if (args[0] === "help") {
    options.help = true;
  } else {
    options.url = args[0];
  }
  options.selector = args[1];

  return options;
}

async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(`Error fetching the URL: ${error}`);
    throw error;
  }
}

async function main() {
  const options = parseArguments(args);
  let $;
  let result;

  if (options.welcome) {
    printWelcome();
  }

  if (options.help) {
    printHelp();
  }

  if (options.url) {
    try {
      const html = await fetchHTML(options.url);
      $ = cheerio.load(html);
    } catch (error) {
      console.error(error);
    }
  }

  if (options.selector && $) {
    result = $(options.selector).text();
  }

  console.log(result);
}

main();
