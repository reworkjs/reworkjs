import Blessed from 'blessed';
import type { Widgets } from 'blessed';

type BlessedNode = Widgets.Node;
const IS_LEAF = Symbol('is-leaf');

export function append(root: BlessedNode, rawLeaf: any) {
  rawLeaf[IS_LEAF] = true;

  const newLeaf: BlessedNode = toNode(rawLeaf);

  return appendNode(root, newLeaf, 0);
}

function appendNode(root: BlessedNode, newLeaf: any, depth: number) {
  if (!root) {
    throw new TypeError('missing arg root');
  }

  const children = getChildren(root);

  if (children.length < 2) {
    const oldLeaf = children[0] && children[0][IS_LEAF] ? copyLeaf(root) : null;
    root.append(newLeaf);

    if (oldLeaf) {
      root.append(oldLeaf);
    }

    splitChildren(root, depth);

    return;
  }

  const lChildCount = getDescendantCount(children[0]);
  const rChildCount = getDescendantCount(children[1]);

  if (lChildCount <= rChildCount) {
    appendNode(children[0], newLeaf, depth + 1);
  } else {
    appendNode(children[1], newLeaf, depth + 1);
  }

  splitChildren(root, depth);
}

function splitChildren(root: BlessedNode, depth: number): void {
  const horizontal = depth % 2 === 0;

  const size = `${100 / (root.children.length || 1)}%`;

  const props = {
    height: horizontal ? '100%' : size,
    width: !horizontal ? '100%' : size,
  };

  // split height, or width
  // set left/right/top/bottom
  for (const child of root.children) {
    Object.assign(child, props);
  }

  if (root.children[1]) {
    root.children[1].left = horizontal ? size : '0';
    root.children[0].top = !horizontal ? size : '0';
  }
}

function getChildren(root: BlessedNode): BlessedNode[] {
  if (!root.children) {
    root.children = [];
  }

  return root.children;
}

function getNodeCount(root: BlessedNode): number {
  return 1 + getDescendantCount(root);
}

function getDescendantCount(root: BlessedNode): number {
  if (isLeaf(root)) {
    return 0;
  }

  let count = 0;
  for (const child of getChildren(root)) {
    count += getNodeCount(child);
  }

  return count;
}

function isLeaf(node: BlessedNode) {
  return getChildren(node).length === 1;
}

function copyLeaf(node: BlessedNode): BlessedNode {
  return toNode(getChildren(node)[0]);
}

function toNode(item: BlessedNode): BlessedNode {
  return Blessed.box({
    children: [item],
  });
}
