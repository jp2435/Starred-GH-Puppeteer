const puppeteer = require('puppeteer');
require('dotenv').config();
const readlineSync = require('readline-sync');


(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();
  await page.goto('https://github.com/login');
  
  await page.type('[name="login"]', process.env.User_Github);
  await page.type('#password', process.env.Pass_Github);

  await page.click('[type="submit"]');
  
  const url = readlineSync.question('Link (user/rep):');


  await page.waitForNavigation();
  
  await page.goto(`https://github.com/${url}`);

  const div = await page.evaluate(() => {
    return document.querySelector('.d-block.js-toggler-container.js-social-container.starring-container.on');
  });
  const _404 = await page.evaluate(() => {
    return document.querySelector('.js-plaxify.position-absolute');
  });
  if(!(_404 === null)){
    //Executa este bloco se não existir tal repositório
    console.log(`Não foi encontrado nenhum repositório nomeado de ${url}`);
  }else{
    //Executa este bloco se existir tal repositório
    if(!(div === null)){
      //Executa este bloco se o repositório já estiver starred
      console.log("Reposiório já starred");
      await browser.close();
    }else{
      //Executa este bloco se o repositório ainda não estiver starred
      await page.click(`[title="Star ${url}"]`);
      console.log("Starred com sucesso!!");
    }
  }
  await browser.close();
})();