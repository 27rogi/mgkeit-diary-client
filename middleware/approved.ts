import { Middleware } from '@nuxt/types'

const approved: Middleware = ({ $auth, redirect }) => {
  if ($auth.user) {
    if ((<any>$auth.user.role).permissions.includes('awaiting'))
      return redirect({
        replace: true,
        path: '/error',
        query: {
          type: 'not_approved',
        },
      })
  }
}

export default approved
