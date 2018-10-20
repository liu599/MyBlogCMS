export default {
  rootUrl: 'https://www.blog.nekohand.moe',
  relativePath: '/api/nekohand/v2/',
  frontend: 'frontend',
  backend: 'backend',
  modules: {
    frontend: {
      categories: 'categories',
      status: 'status',
      post: 'post',
      posts: 'posts',
      postByTime: 'po/t',
      postChronology: 'posts-chronology',
      comments: 'comments',
      commentCreation: 'c2a5cc3b070',
    },
    backend: {
      token: 'token.get',
      postEdit: 'auth/post.edit',
      postDelete: 'auth/post.delete',
      categoryEdit: 'auth/category.edit',
      categoryDelete: 'auth/category.delete',
    }
  },
  genUrl: function (module, name) {
    return `${this.rootUrl}${this.relativePath}${module}/${name}`
  }
}
