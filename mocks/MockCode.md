
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