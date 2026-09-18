export function bindInput(game) {
  const handlePointerDown = (event) => {
    event.preventDefault();
    game.doJump();
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      game.doJump();
    }
  };

  window.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('keydown', handleKeyDown);
  };
}
