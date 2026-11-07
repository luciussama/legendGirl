/** Transições dos brinquedos; regras de interação, contagem e efeitos pertencem aos chamadores. */
export function pickUpToy(player, toy) {
  toy.isCarried = true;
  player.carriedItem = toy;
}

export function storeToyInChest(player, chest) {
  const toy = player.carriedItem;
  toy.isCarried = false;
  toy.isOrganized = true;
  toy.x = chest.x + chest.w / 2 + (Math.random() - 0.5) * 60;
  toy.y = chest.y + 45;
  player.carriedItem = null;
}

export function releaseCarriedToy(player, point) {
  const toy = player.carriedItem;
  toy.x = point.x;
  toy.y = point.y;
  toy.isCarried = false;
  player.carriedItem = null;
}

export function returnToyToFloor(toy, point) {
  toy.x = point.x;
  toy.y = point.y;
  toy.isOrganized = false;
  toy.isCarried = false;
  toy.returnGeneration = (toy.returnGeneration || 0) + 1;
  toy.bounceOffset = 0;
}
