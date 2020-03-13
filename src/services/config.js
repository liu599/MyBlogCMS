export default {
  rootUrl: 'https://kasumi.ecs32.top',
  fileUrl: 'https://mltd.ecs32.top',
  fileRootUrl: 'https://file.ecs32.top/data',
  filemodules: {
    upload: 'upload',
    nekofile: 'nekofile',
    fix: 'fix',
    filetype: 'filelist',
    filelist: 'filelist',
  },
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
      filelist: 'filelist',
    },
    backend: {
      token: 'token.v2.get',
      postEdit: 'auth/post.edit',
      postDelete: 'auth/post.delete',
      categoryEdit: 'auth/category.edit',
      categoryDelete: 'auth/category.delete',
    }
  },
  genUrl: function (module, name) {
    return `${this.rootUrl}${this.relativePath}${module}/${name}`
  },
  genFileUrl: function(module) {
    return `${this.fileUrl}/${module}`
  }
}
