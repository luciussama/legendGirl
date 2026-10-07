// Servidor de QA restrito à máquina local; nunca usado pelo jogo publicado.
import express from 'express';
import fs from 'node:fs/promises';
const app=express();
app.use(express.json({limit:'1mb'}));
app.post('/__qa/difficulty',async(req,res)=>{
  await fs.mkdir('docs/qa/modo-facil',{recursive:true});
  await fs.writeFile('docs/qa/modo-facil/campanha-browser.json',JSON.stringify(req.body,null,2)+'\n');
  console.log(req.body.resultado);
  res.sendStatus(204);
});
app.use(express.static(process.cwd()));
app.listen(3019,'127.0.0.1',()=>console.log('Validação local: http://127.0.0.1:3019/tests/game-difficulty.html?report=1'));
