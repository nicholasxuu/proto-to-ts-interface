export default class TreeHelper {
  static addToTree = (tree: object, keys: string[], value: any) => {
    const result = tree; // use pointer

    let currSubtree = tree;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!currSubtree[key]) {
        currSubtree[key] = i === keys.length - 1 ? value : {};
      }
      currSubtree = currSubtree[key];
    }
    return result;
  };

  static isTreeBranch = (tree: object, keys: string[], length: number = -1) => {
    const checkLength = length === -1 ? keys.length : length;
    let currSubtree = tree;
    for (let i = 0; i < checkLength; i++) {
      const key = keys[i];
      if (!currSubtree[key]) {
        return false;
      }
      currSubtree = currSubtree[key];
    }
    return true;
  };
}
