const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  addTagsToPost,
  createTags,
  getPostsByTagName
} = require('./index');

/**
 * User functions
 */

async function createInitialUsers() {
  try {
    console.log('starting to create users...');

    await createUser({
      username: 'albert',
      password: 'bertie99',
      name: 'al',
      location: 'Florida, USA',
    });
    await createUser({
      username: 'sandra',
      password: '2sandy4me',
      name: 'Sandy',
      location: 'Sydney, Australia',
    });
    await createUser({
      username: 'glamgal',
      password: 'soglam',
      name: 'Gertrude',
      location: 'New York, USA',
    });

    console.log('Finished creating users!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Post Functions
 */

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log('Starting to create posts...');
    await createPost({
      authorId: albert.id,
      title: 'Go Gators',
      content: 'I was named after their mascot.'
    });

    await createPost({
      authorId: sandra.id,
      title: 'Time to throw shrimp on the barby',
      content: 'Anyone got the Fosters?'
    });

    await createPost({
      authorId: glamgal.id,
      title: 'Glamming it up',
      content: 'My dream in life is to be as glamtastic as Captain Fantastic.'
    });
    console.log('Finished creating posts!');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 *
 * Tag Functions
 *
 */

async function createInitialTags() {
  try {
    console.log('Starting Tag creation');

    const [happy, sad, inspo, catman] = await createTags([
      '#happy', '#worst-day-ever', '#youcandoanything', '#catmandoeverything'
    ]);

    const [postOne, postTwo, postThree] = await getAllPosts();

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);

    console.log('Finished Tags');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Base Functions
 */

async function dropTables() {
  try {
    console.log('Starting to drop tables...');
    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    `);
    console.log('Fininished dropping tables');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Starting to build tables');

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      location varchar(255) NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id),
      title varchar(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL
    );
    CREATE TABLE post_tags (
      id SERIAL PRIMARY KEY,
      "postId" INTEGER REFERENCES posts(id),
      "tagId" INTEGER REFERENCES tags(id)
      );
    `);

    console.log('finsished building tables');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    // await createInitialTags();
  } catch (error) {}
}

async function testDB() {
  console.log('Starting database test');

  try {
    const users = await getAllUsers();
    console.log('getAllUsers:', users);

    const updateUserResult = await updateUser(users[0].id, {
      name: 'Newname Sogood',
      location: 'Lesterville, KY',
    });
    console.log('updateUser', updateUserResult);

    const posts = await getAllPosts();
    console.log('getAllPosts', posts);

    const updatePostResult = await updatePost(posts[0].id, {
      title: 'New Title',
      content: 'Updated Content',
    });
    console.log('updatePost:', updatePostResult);

    const albert = await getUserById(1);
    console.log('getUserById:', albert);

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("updatePostTagsResult:", updatePostTagsResult);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("getPostsByTagName:", postsWithHappy);

    console.log('Finished database tests');
  } catch (error) {
    console.error(error);
  }
}
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
