'use strict'


const Role = use('Role')


class RoleController {

    async index() {
        const role = await Role.query().with('permissions').fetch()
        return role
    }

    async store({ request }) {
        const {permissions, ...data} = request.only(['name', 'slug', 'description','permissions'])

        const role = await Role.create(data)

        /*
            Se essa role possuir permissions, atrela a ela as devidas permissions
        */
        if(permissions){
            await role.permissions().attach(permissions)
        }

        await role.load('permissions')

        return role
    }

    async show({ params }) {

        const { id } = params

        const role = await Role.findOrFail(id)
        
        await role.load('permissions')

        return role
    }

    async update({ request, params }) {
        const { id } = params

        const {permissions, ...data} = request.only(['name', 'slug', 'description','permissions'])

        const role = await Role.findOrFail(id)

        role.merge(data)

        await role.save()

        /*
           Faz a remoção das antigas permissions e adiciona as novas
        */
        if(permissions){
            await role.permissions().sync(permissions)
        }

        await role.load('permissions')

        return role
    }

    async destroy({ params, response }) {
        const { id } = params
        const role = await Role.findOrFail(id)

        await role.delete()

        return response.send()
    }
}

module.exports = RoleController
