// Observação QA-CAMERA-002A: não participa da simulação nem modifica a câmera.
export function createCameraQaObserver({ host, snapshot }) {
  const enabled = new URLSearchParams(host.location.search).has('cameraQa');
  return {
    record(transform = null) {
      if (!enabled || typeof host.cameraQaRecord !== 'function') return;
      host.cameraQaRecord(snapshot(transform));
    }
  };
}
