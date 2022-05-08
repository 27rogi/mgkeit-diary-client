import { Middleware } from '@nuxt/types'

const permissions: Middleware = ({ $auth, route, redirect }) => {
  if (!$auth.user) return redirect('/')
  if (!route.meta || !route.meta[0].permissions) return redirect('/')

  const permissions: string[] = route.meta[0].permissions
  const userPermissions = <string[]>(<any>$auth.user.role).permissions

  if (!permissions.every((perm: string) => userPermissions.includes(perm))) {
    return redirect({
      replace: true,
      path: '/error',
      query: {
        type: 'permissions',
        required: permissions.filter((perm) => !userPermissions.includes(perm)).join(', '),
      },
    })
  }
}

export default permissions
