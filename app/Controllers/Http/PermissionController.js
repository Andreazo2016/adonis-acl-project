'use strict'

const Permission = use('Permission')

class PermissionController {

    async index() {
        const permissions = await Permission.all()
        return permissions
    }

    async store({ request }) {
        const data = request.only(['name', 'slug', 'description'])

        const permission = await Permission.create(data)

        return permission
    }

    async show({ params }) {
        const { id } = params
        const permission = await Permission.findOrFail(id)

        return permission
    }

    async update({ request, params }) {
        const { id } = params

        const data = request.only(['name', 'slug', 'description'])

        const permission = await Permission.findOrFail(id)

        permission.merge(data)

        await permission.save()

        return permission
    }

    async destroy({ params, response }) {
        const { id } = params
        const permission = await Permission.findOrFail(id)

        await permission.delete()

        return response.send()
    }

}

module.exports = PermissionController
