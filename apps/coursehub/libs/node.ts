import { MenuItem } from '../types';

export class Node {
    data: MenuItem;

    next: null | Node;

    previous: null | Node;

    constructor(data: MenuItem) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }

    setNextNode(node: Node) {
        if (node instanceof Node || node === null) {
            this.next = node;
        } else {
            throw new Error('Next node must be a member of the Node class');
        }
    }

    setPreviousNode(node: Node) {
        if (node instanceof Node || node === null) {
            this.previous = node;
        } else {
            throw new Error('Previous node must be a member of the Node class');
        }
    }

    getNextNode() {
        return this.next;
    }

    getPreviousNode() {
        return this.previous;
    }
}
