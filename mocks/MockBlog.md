# It's a story of a girl, cried a river and drowned the whole world.

It's the story of a user named **Omer Barnir** who reported a bug in 2005 on the MySQL [bug report platform](https://bugs.mysql.com/)

But the thing is that Omer never got an answer. 15 years later, the bug has never been fix and people are starting to make fun out of it. We let you take a look at the conversation [here](https://bugs.mysql.com/bug.php?id=11472), it's pretty funny

```js
// DATA
const app = {
  blogsPublished: 1,
  blogsUnPublished: 10,
  users: [
    {
      userId: 32323,
      username: 'CodeMaster',
      posts: [
        {
          title: 'learning Javascript'
        }
      ]
    }
  ]
};

// CAPITALISE THE TITLE IN THE FIRST POST OF THE FIRST USER IN OUR DATA
// DO NOT MUTATE THE ORIGINAL APP OBJECT

const incorrectTitle = app.users[0].posts[0].title;
const correctTitle = incorrectTitle[0].toUpperCase() + incorrectTitle.slice(1);

const updatedApp = { ...app };
updatedApp.users = [ ...app.users ];
updatedApp.users[0].posts = [...app.users[0].posts];

const updatedFirstPost = { ...updatedApp.users[0].posts[0] };
updatedFirstPost.title = correctTitle;
updatedApp.users[0].posts[0] = updatedFirstPost;
```