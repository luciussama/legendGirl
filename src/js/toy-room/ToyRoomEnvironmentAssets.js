/** Resolve os recortes existentes da sala sem acessar gameplay, câmera ou narrativa. */
export function createToyRoomEnvironmentAssets(assets) {
  const environmentFloorTile = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 27, y: 151, width: 186, height: 48
  });
  const environmentTeddy = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 424, y: 44, width: 86, height: 120
  });
  const environmentRug = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 39, y: 355, width: 291, height: 247
  });
  const environmentDoor = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 304, y: 158, width: 88, height: 136
  });
  const environmentChest = assets?.get('toy-room-chest-brinquedos-v1') || null;
  const environmentTrain = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 689, y: 76, width: 116, height: 88
  });
  const environmentTable = assets && assets.getRegion('toy-room-environment-sheet', {
    x: 548, y: 44, width: 137, height: 119
  });
  const environmentDetails = assets ? [
    {
      image: assets.getRegion('toy-room-environment-sheet', { x: 832, y: 482, width: 45, height: 45 }),
      x: 1350,
      y: 470,
      width: 34,
      height: 34
    },
    {
      image: assets.getRegion('toy-room-environment-sheet', { x: 878, y: 482, width: 54, height: 45 }),
      x: 1430,
      y: 615,
      width: 42,
      height: 34
    },
    {
      image: assets.getRegion('toy-room-environment-sheet', { x: 839, y: 555, width: 50, height: 52 }),
      x: 1180,
      y: 930,
      width: 42,
      height: 44
    },
    {
      image: assets.getRegion('toy-room-environment-sheet', { x: 1038, y: 561, width: 66, height: 63 }),
      x: 220,
      y: 520,
      width: 54,
      height: 52
    }
  ] : [];

  return { environmentFloorTile, environmentTeddy, environmentRug, environmentDoor, environmentChest, environmentTrain, environmentTable, environmentDetails };
}
