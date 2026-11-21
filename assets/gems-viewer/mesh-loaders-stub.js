// Stand-ins for three.js's STL and Collada loaders, which urdf-loader imports
// unconditionally. The GEMs URDF draws every segment with primitives (boxes and
// cylinders), so no mesh file is ever loaded and the real loaders, with their
// dependencies, are not shipped. When the visual model of plan ID-7 brings
// meshes, map these specifiers to the real loaders in the page's import map.

class MeshLoaderNotBundled {
  load(url, onLoad, onProgress, onError) {
    const err = new Error(`mesh loading is not bundled with the GEMs viewer: ${url}`);
    if (onError) onError(err);
    else throw err;
  }
}

export class STLLoader extends MeshLoaderNotBundled {}
export class ColladaLoader extends MeshLoaderNotBundled {}
