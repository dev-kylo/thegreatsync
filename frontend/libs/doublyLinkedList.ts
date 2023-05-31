import { MenuItem } from '../types';
import { Node } from './node';

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
        let found = null;
        let current = this.head;
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
        if (
            (this.currentPageNode && this.currentPageNode.data.completed && !newTail.data.completed) ||
            newTail.data.completed
        ) {
            this.currentPageNode = newTail;
        }
    }

    getTotalNodes(): number {
        let count = 0;
        let currentNode = this.head;
        while (currentNode !== null) {
            count++;
            currentNode = currentNode.getNextNode();
        }
        return count;
    }

    getFirstUncompleted(): Node | null {
        let found = null;
        let current = this.head;
        while (!found && current) {
            if (!current?.data.completed) found = current;
            current = current?.next || null;
        }
        return found;
    }

    printList() {
        let currentNode = this.head;
        let output = '<head> ';
        while (currentNode !== null) {
            output += `${currentNode.data.name}--`;
            currentNode = currentNode.getNextNode();
        }
        output += '<tail>';
        console.log(output);
    }
}
