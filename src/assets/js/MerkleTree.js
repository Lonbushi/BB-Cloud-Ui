import SparkMD5 from "spark-md5";

// Merkle 树节点的类实现
class MerkleNode {
  constructor(hash, left = null, right = null) {
    this.h = hash;
    this.l = left;
    this.r = right;
  }
}

// Merkle 树的类实现
export class MerkleTree {
  constructor(nodes) {
    if (nodes.length === 0) {
      throw new Error("Empty Nodes");
    }

    if (typeof nodes[0] === "string") {
      this.leafs = nodes.map((node) => new MerkleNode(node));
    } else {
      this.leafs = nodes;
    }

    this.root = this.buildTree();
  }

  getRootHash() {
    return this.root.h;
  }

  buildTree() {
    let currentLevelNodes = this.leafs;
    while (currentLevelNodes.length > 1) {
      const parentNodes = [];
      for (let i = 0; i < currentLevelNodes.length; i += 2) {
        const left = currentLevelNodes[i];
        const right =
          i + 1 < currentLevelNodes.length ? currentLevelNodes[i + 1] : null;
        const parentHash = this.calculateHash(left, right);
        parentNodes.push(new MerkleNode(parentHash, left, right));
      }
      currentLevelNodes = parentNodes;
    }
    return currentLevelNodes[0];
  }

  serialize() {
    const serializeNode = (node) => {
      if (node === null) {
        return null;
      }
      return {
        h: node.h,
        l: serializeNode(node.l),
        r: serializeNode(node.r),
      };
    };
    const serializedRoot = serializeNode(this.root);
    return JSON.stringify(serializedRoot);
  }

  static deserialize(serializedTree) {
    const parsedData = JSON.parse(serializedTree);
    const deserializeNode = (data) => {
      if (data === null) {
        return null;
      }
      return new MerkleNode(
        data.h,
        deserializeNode(data.l),
        deserializeNode(data.r)
      );
    };
    const root = deserializeNode(parsedData);
    if (!root) {
      throw new Error("Invalid serialized tree data");
    }

    const extractLeafNodes = (node) => {
      if (node.l === null && node.r === null) {
        return [node];
      }
      return [
        ...(node.l ? extractLeafNodes(node.l) : []),
        ...(node.r ? extractLeafNodes(node.r) : []),
      ];
    };
    const leafNodes = extractLeafNodes(root);
    return new MerkleTree(leafNodes);
  }

  calculateHash(left, right) {
    return right ? SparkMD5.hash(left.h + right.h) : left.h;
  }
}
