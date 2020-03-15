'use strict'

const Post = use('App/Models/Post')

class PostController {

  async index({ auth }) {

    const { user } = auth

    if (await user.can('read_private_posts')) {
      const posts = await Post.all()
      return posts
    }

    const posts = await Post.query().where({ type: 'public' }).fetch()
    return posts
  }

  async store({ request }) {

    const data = request.only(['title', 'content'])

    const post = await Post.create(data)

    return post
  }

  async show({ params, auth,response }) {

    const { id } = params
    const { user } = auth
    const post = await Post.findByOrFail('id', id)


    if (post.type === 'public') {
      return post
    }

    if (await user.can('read_private_posts')) {
      return post
    }

    return response.status(400).send({
      error: {
        message: 'Você não tem permissão de leitura'
      }
    })
  }



  async update({ params, request }) {
    const { id } = params
    const data = request.all()

    const post = await Post.findByOrFail('id', id)

    post.merge(data)

    await post.save()


    return post
  }


  async destroy({ params, response }) {

    const { id } = params
    const post = await Post.findByOrFail('id', id)

    await post.delete()

    return response.send()
  }
}

module.exports = PostController
