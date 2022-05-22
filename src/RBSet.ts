// A Set implementation based on Red-Black Trees

type Color = "red" | "black";

type Key = string | number;

interface RedBlackTreeIEmpty {
  type: "empty";
}
interface RedBlackTreeINode<Element extends Key> {
  type: "node";
  color: Color;
  element: Element;
  left: RedBlackTreeI<Element>;
  right: RedBlackTreeI<Element>;
}

type RedBlackTreeI<Element extends Key> =
  | RedBlackTreeIEmpty
  | RedBlackTreeINode<Element>;

function containsI<Element extends Key>(
  element: Element,
  tree: RedBlackTreeI<Element>
): boolean {
  if (tree.type === "empty") {
    return false;
  }

  if (tree.element === element) {
    return true;
  }

  if (tree.element > element) {
    return containsI(element, tree.left);
  }

  return containsI(element, tree.right);
}

function forEachI<Element extends Key>(
  callback: (_: Element) => void,
  tree: RedBlackTreeI<Element>
) {
  if (tree.type === "node") {
    forEachI(callback, tree.left);
    callback(tree.element);
    forEachI(callback, tree.right);
  }
}

function insertI<Element extends Key>(
  element: Element,
  tree: RedBlackTreeI<Element>
): RedBlackTreeI<Element> {
  if (tree.type === "empty") {
    return {
      type: "node",
      color: "red",
      element,
      left: { type: "empty" },
      right: { type: "empty" },
    };
  }

  if (tree.element === element) {
    return tree;
  }

  if (tree.element > element) {
    const left = insertI(element, tree.left);
    return balance(tree.color, tree.element, left, tree.right);
  }

  const right = insertI(element, tree.right);
  return balance(tree.color, tree.element, tree.left, right);
}

function balance<Element extends Key>(
  color: Color,
  element: Element,
  left: RedBlackTreeI<Element>,
  right: RedBlackTreeI<Element>
): RedBlackTreeI<Element> {
  /**
   * Mom! I want pattern matching!
   * We have pattern matching at home.
   * Pattern matching at home:
   */

  if (
    color === "black" &&
    left.type === "node" &&
    left.color === "red" &&
    left.left.type === "node" &&
    left.left.color === "red"
  ) {
    return {
      type: "node",
      color: "red",
      element: left.element,
      left: {
        type: "node",
        color: "black",
        element: left.left.element,
        left: left.left.left,
        right: left.left.right,
      },
      right: {
        type: "node",
        color: "black",
        element,
        left: left.right,
        right: right,
      },
    };
  }

  if (
    color === "black" &&
    left.type === "node" &&
    left.color === "red" &&
    left.right.type === "node" &&
    left.right.color === "red"
  ) {
    return {
      type: "node",
      color: "red",
      element: left.right.element,
      left: {
        type: "node",
        color: "black",
        element: left.element,
        left: left.left,
        right: left.right.left,
      },
      right: {
        type: "node",
        color: "black",
        element,
        left: left.right.right,
        right,
      },
    };
  }

  if (
    color === "black" &&
    right.type === "node" &&
    right.color === "red" &&
    right.left.type === "node" &&
    right.left.color === "red"
  ) {
    return {
      type: "node",
      color: "red",
      element: right.left.element,
      left: {
        type: "node",
        color: "black",
        element,
        left,
        right: right.left.left,
      },
      right: {
        type: "node",
        color: "black",
        element: right.element,
        left: right.left.right,
        right: right.right,
      },
    };
  }

  if (
    color === "black" &&
    right.type === "node" &&
    right.color === "red" &&
    right.right.type === "node" &&
    right.right.color === "red"
  ) {
    return {
      type: "node",
      color: "red",
      element: right.element,
      left: {
        type: "node",
        color: "black",
        element,
        left,
        right: right.left,
      },
      right: {
        type: "node",
        color: "black",
        element: right.right.element,
        left: right.right.left,
        right: right.right.right,
      },
    };
  }

  return { type: "node", color, element, left, right };
}

export class RBSet<Element extends Key> {
  private root: RedBlackTreeI<Element>;

  constructor(elements: Element[] = []) {
    this.root = { type: "empty" };
    for (const element of elements) {
      this.insert(element);
    }
  }

  contains = (element: Element) => containsI(element, this.root);

  forEach = (callback: (_: Element) => void) => forEachI(callback, this.root);

  insert = (element: Element) => {
    const newRoot = insertI(element, this.root);
    if (newRoot.type === "node" && newRoot.color === "red") {
      newRoot.color = "black";
      this.root = newRoot;
    } else {
      this.root = newRoot;
    }
  };

  entries = (): Element[] => {
    const elements: Element[] = [];

    this.forEach((e) => elements.push(e));

    return elements;
  };
}
