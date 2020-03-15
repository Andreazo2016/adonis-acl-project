'use strict'

const User = use('App/Models/User')

class UserController {


    async index() {
        const users = await User.query().with('roles').fetch()

        return users
    }

    async store({ request }) {
        const { permissions, roles, ...data } = request.only([
            'username',
            'email',
            'password',
            'permissions',
            'roles'
        ])

        const user = await User.create(data)

        if (roles) {
            await user.roles().attach(roles)
        }
        if (permissions) {
            await user.permissions().attach(permissions)
        }

        await user.loadMany(['roles', 'permissions'])


        return user
    }

    async update({ params, request }) {
        const { permissions, roles, ...data } = request.only([
            'username',
            'email',
            'password',
            'permissions',
            'roles'
        ])

        const { id } = params


        const user = await User.findBy('id', id)

        user.merge(data)

        await user.save()

        if (roles) {
            await user.roles().sync(roles)
        }
        if (permissions) {
            await user.permissions().sync(permissions)
        }

        await user.loadMany(['roles', 'permissions'])

        return user
    }
}

module.exports = UserController
