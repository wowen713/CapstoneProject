/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from '@keystone-6/core';

// We're using some common fields in the starter. Check out https://keystonejs.com/docs/apis/fields#fields-api
// for the full list of fields.
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  checkbox,
} from '@keystone-6/core/fields';
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { document } from '@keystone-6/fields-document';

// We are using Typescript, and we want our types experience to be as strict as it can be.
// By providing the Keystone generated `Lists` type to our lists object, we refine
// our types to a stricter subset that is type-aware of other lists in our schema
// that Typescript cannot easily infer.
import { Lists } from '.keystone/types';

function newWebpage(name: string, type: string){
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/'+name+'.json';
  const newPage = 'pages/'+name+'.tsx';
  const templateFile = 'data/template/'+type+'.json'
  fs.open(newFile,'w',function (_err: any, _f: any) {});
  fs.copyFileSync(templateFile, newFile);
  fs.appendFile(newPage, "import 'grapesjs/dist/css/grapes.min.css'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { getStaticProps } from 'destack/build/server'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { ContentProvider as default } from 'destack'"+os.EOL,function (_err: any, _f: any) {});
}

function newTemplate(name: string){
  var fs = require('fs');
  var os = require("os");
  const newPage = 'pages/template/'+name+'.tsx';
  const newFile = 'data/template/'+name+'.json'
  fs.open(newFile,'w',function (_err: any, _f: any) {});
  fs.appendFile(newPage, "import 'grapesjs/dist/css/grapes.min.css'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { getStaticProps } from 'destack/build/server'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { ContentProvider as default } from 'destack'"+os.EOL,function (_err: any, _f: any) {});
}

function shiftWebpage(name:string){
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/'+name+'.json';
  const newPage = 'pages/'+name+'.tsx';
  fs.rename(newFile,'data/name__switch.json',() => {});
  fs.rename(newPage,'pages/name__switch.tsx',() => {});
}

function shiftTemplate(name:string){
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/template/'+name+'.json';
  const newPage = 'pages/template/'+name+'.tsx';
  fs.rename(newFile,'data/template/name__switch.json',() => {});
  fs.rename(newPage,'pages/template/name__switch.tsx',() => {});
}

function updateWebpage(name:string) {
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/'+name+'.json';
  const newPage = 'pages/'+name+'.tsx';
  fs.rename('data/name__switch.json',newFile,() => {});
  fs.rename('pages/name__switch.tsx',newPage,() => {});
}

function updateTemplate(name:string) {
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/template/'+name+'.json';
  const newPage = 'pages/template/'+name+'.tsx';
  fs.rename('data/template/name__switch.json',newFile,() => {});
  fs.rename('pages/template/name__switch.tsx',newPage,() => {});
}

function deleteWebpage(name: string){
  var fs = require('fs');
  const deleteFile = 'data/'+name+'.json';
  const deletePage = 'pages/'+name+'.tsx';
  fs.unlink(deleteFile, function (err: any) {
    if (err) throw err;
    console.log(deleteFile+' has been deleted!');
  });
  fs.unlink(deletePage, function (err: any) {});
}

function deleteTemplate(name: string){
  var fs = require('fs');
  const deleteFile = 'data/template/'+name+'.json';
  const deletePage = 'pages/template/'+name+'.tsx';
  fs.unlink(deleteFile, function (err: any) {
    if (err) throw err;
    console.log(deleteFile+' has been deleted!');
  });
  fs.unlink(deletePage, function (err: any) {});
}


type Session = {
  data: {
    id: string;
    isAdmin: boolean;
  }
}

const isAdmin = ({ session }: { session: Session }) => session?.data.isAdmin;

// We have a users list, a blogs list, and tags for blog posts, so they can be filtered.
// Each property on the exported object will become the name of a list (a.k.a. the `listKey`),
// with the value being the definition of the list, including the fields.
export const lists: Lists = {
  // Here we define the user list.
  User: list({
    access: {
      operation: {
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } }),
      // Relationships allow us to reference other lists. In this case,
      // we want a user to have many posts, and we are saying that the user
      // should be referencable by the 'author' field of posts.
      // Make sure you read the docs to understand how they work: https://keystonejs.com/docs/guides/relationships#understanding-relationships
      posts: relationship({ ref: 'Post.author', many: true }),
      isAdmin: checkbox(),
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ['name', 'posts'],
      },
    },
  }),
  Post: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({ isIndexed: 'unique', isFilterable: true }),
      template: select({
        defaultValue: 'none',
        options: [
          { label: 'Product', value: 'product' },
          { label: 'Ecommerce', value: 'ecommerce' },
          { label: 'None', value: 'none' },
        ],
    }),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: 'draft',
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      publishDate: timestamp(),
      author: relationship({
        validation: {isRequired: true},
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name', 'email', 'password'] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),

    },
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === 'create') {
          newWebpage(item.slug,item.template);
        }
        else if(operation === 'update') {
          updateWebpage(item.slug);
        }
      },
      beforeOperation: ({ operation, item }) => {
         if (operation === 'delete') {
          deleteWebpage(item.slug);
        }else if(operation === 'update'){
          shiftWebpage(item.slug);
        }
      },
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
  Template: list({
    fields:{
      name: text({isIndexed: 'unique'}),
    },
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === 'create') {
          newTemplate(item.title);
        }
        else if(operation === 'update') {
          updateTemplate(item.title);
        }
      },
      beforeOperation: ({ operation, item }) => {
         if (operation === 'delete') {
          deleteTemplate(item.title);
        }else if(operation === 'update'){
          shiftTemplate(item.title);
        }
      },
    },
  }),
};
