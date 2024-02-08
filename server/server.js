require('dotenv').config();
const OpenAI = require('openai');
const express = require('express');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function main() {
  const image = await openai.images.generate({ prompt: "1 comic panel of a professor teaching in a superhero style." });

  console.log(image.data);
}
main();