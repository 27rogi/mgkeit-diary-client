import { Middleware } from '@nuxt/types'

const approved: Middleware = ({ $auth, redirect }) => {
  if ($auth.user) {
    if ((<any>$auth.user.role).roleId === '6267c57f0f80e9f4646bb5bb')
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
