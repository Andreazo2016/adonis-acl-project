'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})


Route.resource('permissions','PermissionController').apiOnly().middleware('auth')
Route.resource('roles','RoleController').apiOnly().middleware('auth')


/**
 * 
 * Remove do resource os métodos index e show que estão sobre influencia dos middleware
 */
Route.resource('posts','PostController')
.apiOnly()
.except(['index','show'])
.middleware(['auth','is:(administrator || moderator)'])


/** 
 * Cria rotas alternativas com permissions
 * 
 */
Route.get('posts','PostController.index')
.middleware(['auth','can:(read_posts || read_private_posts)'])


Route.get('posts/:id','PostController.show')
.middleware(['auth','can:( read_posts || read_private_posts )'])

Route.resource('users','UserController').apiOnly()
Route.resource('sessions','SessionController').apiOnly()