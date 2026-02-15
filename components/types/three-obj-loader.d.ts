declare module 'three/examples/jsm/loaders/OBJLoader.js' {
  import { Loader, Group, LoadingManager } from 'three';

  export class OBJLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (object: Group) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(text: string): Group;
  }
}
