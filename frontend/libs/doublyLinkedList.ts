import { MenuItem } from "../types";

export class DoublyLinkedList {
    head: null | Node;
    tail: null | Node;
    currentPageNode: null | Node;

    constructor() {
        this.head = null;
        this.tail = null;
        this.currentPageNode = null;
    }

    getByDataId(id: number) {
        var found = null;
        var current = this.head;
        while (!found) {
            if (current?.data.id === id) found = current;
            current = current?.next || null;
        }
        return found;
    }

    addToTail(data: MenuItem) {
        const newTail = new Node(data);
        const currentTail = this.tail;
        if (currentTail) {
            currentTail.setNextNode(newTail);
            newTail.setPreviousNode(currentTail);
        }
        this.tail = newTail;
        if (!this.head) this.head = newTail;
        if ((this.currentPageNode && this.currentPageNode.data.completed && !newTail.data.completed) || newTail.data.completed) {
            this.currentPageNode = newTail;
        }
    }

    printList() {
        let currentNode = this.head;
        let output = '<head> ';
        while (currentNode !== null) {
            output += currentNode.data.name + '--' + ' ';
            currentNode = currentNode.getNextNode();
        }
        output += '<tail>';
    }
}

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
            throw new Error('Next node must be a member of the Node class')
        }
    }

    setPreviousNode(node: Node) {
        if (node instanceof Node || node === null) {
            this.previous = node;
        } else {
            throw new Error('Previous node must be a member of the Node class')
        }
    }

    getNextNode() {
        return this.next;
    }

    getPreviousNode() {
        return this.previous;
    }
}