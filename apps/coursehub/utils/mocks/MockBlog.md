
## Adding References to our Mental Model

Introducing [javascript references](https://bugs.mysql.com/)

They are simply links to objects, as described in the MDN docs. In The Great Sync, we can think of them as the link between the world of primitives, and the The Heap Multiverse where our objects live. 

These links are a special kind of island.

Every object (including arrays and functions) get their own. They live in the ocean of our code, together with the primitives. This means genie expressions can find them!

Unlike primitives, however, they serve only one purpose: as pointers to objects. They are not the values themselves.

```js
// DATA
const user = { name: 'Thili' }
const newName = 'Simon';

function updateUserName(userObject, nameString){
    userObject.name = nameString;
}

updateUserName(user, newName) // Passing in the string value 'Simon'
```

`User` is a genie sitting on a reference island, pointing at a flying ship. `newName` is a genie sitting on a rainy string island. We pass both these values into the function `updateUserName`.

Now, what if we tried to swap the variables out for the actual values?

```js
// Instead of this
updateUserName(user, newName) 

// Let's try use the actual value
updateUserName({ name: 'Thili' }, 'Simon') 
```

If we try `console.log(user)`, the original object which the variable user is assigned to - do you think there will be any change?

No. The name is still 'Thili'. As soon as we tried to type the object directly into the function, we were assuming we were passing in the value itself.