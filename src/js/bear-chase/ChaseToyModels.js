/** Adaptador dos consumidores anteriores para o catálogo visual compartilhado. */
export class ChaseToyModels {
  /** Recebe o catálogo por composição, sem manter outra versão da modelagem. */
  constructor(catalog) { this.catalog = catalog; }
  /** Conserva a API de revisão da menina, delegando ao mesmo trem usado no jogo. */
  train() { return this.catalog.create('train'); }
}
