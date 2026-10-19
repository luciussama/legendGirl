# Three.js local

Distribuição oficial de `three@0.186.1`, pacote npm `three`, licença MIT em `LICENSE`.
`three.module.js` e `three.core.js` são cópias sem alterações de `node_modules/three/build/`.
Não traduzir ou editar o código da dependência. A versão também está fixa no lockfile.

A prévia 3D importa esses arquivos dinamicamente; assim não depende de CDN ou de
`node_modules` no GitHub Pages. Ao atualizar a dependência, copiar ambos os arquivos
da mesma versão e preservar a licença. As fases 2D não carregam o renderer 3D.
