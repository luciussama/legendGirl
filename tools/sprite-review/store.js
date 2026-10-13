import fs from 'node:fs/promises';
import path from 'node:path';
const failure=(message,status=400)=>Object.assign(new Error(message),{status});
export function createReviewStore({catalogPath,selectionPath}) {
 let queue=Promise.resolve();
 const catalog=async()=>JSON.parse(await fs.readFile(catalogPath,'utf8'));
 const empty=cat=>({schemaVersion:1,catalogVersion:cat.version,revision:0,updatedAt:null,decisions:{},selectedForDeletion:[],selectedRegions:[],selectedCode:[]});
 async function read(){const cat=await catalog();try{return JSON.parse(await fs.readFile(selectionPath,'utf8'));}catch(e){if(e.code==='ENOENT')return empty(cat);throw e;}}
 async function saveNow(payload){
  const cat=await catalog(),previous=await read();
  if(payload.catalogVersion!==cat.version)throw failure('O catálogo mudou. Recarregue a página antes de salvar.',409);
  if(payload.revision!==previous.revision)throw failure('As escolhas foram alteradas em outra página. Recarregue para revisar a versão mais recente.',409);
  if(!payload.decisions||typeof payload.decisions!=='object'||Array.isArray(payload.decisions))throw failure('Seleções inválidas.');
  const byId=new Map(cat.items.map(i=>[i.id,i])),decisions={};
  for(const [id,value]of Object.entries(payload.decisions)){if(!byId.has(id))throw failure('Recurso fora do catálogo.');if(!['old','current','pending'].includes(value))throw failure('Classificação inválida.');if(value!=='pending')decisions[id]=value;}
  const selected=cat.items.filter(i=>decisions[i.id]==='old');
  const target=i=>({id:i.id,path:i.path,sha256:i.sha256,usage:i.usage,references:i.references});
  const saved={schemaVersion:1,catalogVersion:cat.version,revision:previous.revision+1,updatedAt:new Date().toISOString(),decisions,
   selectedForDeletion:selected.filter(i=>i.kind==='file').map(target),
   selectedRegions:selected.filter(i=>i.kind==='region').map(i=>({...target(i),region:i.region,action:'recompor-prancha'})),
   selectedCode:selected.filter(i=>i.kind==='code').map(i=>({...target(i),signature:i.signature,action:'remover-desenho-especifico'}))};
  await fs.mkdir(path.dirname(selectionPath),{recursive:true});const temporary=selectionPath+'.tmp';await fs.writeFile(temporary,JSON.stringify(saved,null,2)+'\n');await fs.rename(temporary,selectionPath);return saved;
 }
 return {catalog,read,save(payload){const operation=queue.then(()=>saveNow(payload));queue=operation.catch(()=>{});return operation;}};
}

/** A rota de gravação só aceita a revisão servida pelo mesmo servidor local. */
export function localReviewRequest(req){
 const host=req.headers.host||'';const local=/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
 const address=req.socket.remoteAddress||'';const loopback=['127.0.0.1','::1','::ffff:127.0.0.1'].includes(address);
 return local&&loopback&&(!req.headers.origin||req.headers.origin==='http://'+host);
}
export function installReviewRoutes(app,store,express){
 app.get('/api/sprite-review/catalog',async(_req,res)=>{try{res.json(await store.catalog());}catch(e){res.status(500).json({error:'Gere o catálogo com npm run review:sprites:catalog.'});}});
 app.get('/api/sprite-review/selections',async(_req,res)=>{try{res.json(await store.read());}catch(e){res.status(500).json({error:'Não foi possível ler as escolhas.'});}});
 app.post('/api/sprite-review/selections',express.json({limit:'1mb'}),async(req,res)=>{
  if(!localReviewRequest(req))return res.status(403).json({error:'As escolhas só podem ser gravadas pela página do servidor local.'});
  try{res.json(await store.save(req.body));}catch(e){res.status(e.status||500).json({error:e.status?e.message:'Não foi possível gravar as escolhas.'});}
 });
}
