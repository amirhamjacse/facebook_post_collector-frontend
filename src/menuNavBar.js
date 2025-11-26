import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiGithub,
  mdiReact,
} from '@mdi/js'

export default [
    {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  // {
  //   icon: mdiMenu,
  //   label: 'Sample menu',
  //   menu: [
  //     {
  //       icon: mdiClockOutline,
  //       label: 'Item One',
  //       to: '/item-one',
  //     },
  //     {
  //       icon: mdiCloud,
  //       label: 'Item Two',
  //       to: '/item-two',
  //     },
  //     {
  //       isDivider: true,
  //     },
  //     {
  //       icon: mdiCrop,
  //       label: 'Item Last',
  //       to: '/item-last',
  //     },
  //   ],
  // },
 
  // {
  //   icon: mdiGithub,
  //   label: 'GitHub',
  //   isDesktopNoLabel: true,
  //   href: 'https://github.com/justboil/admin-one-vue-tailwind',
  //   target: '_blank',
  // },
  // {
  //   icon: mdiReact,
  //   label: 'React version',
  //   isDesktopNoLabel: true,
  //   href: 'https://github.com/justboil/admin-one-react-tailwind',
  //   target: '_blank',
  // },
  // {
  //   icon: mdiLogout,
  //   label: 'Log out',
  //   isDesktopNoLabel: true,
  //   isLogout: true, // Keep the flag for component logic
  // },
   {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        to: '/profile',
      },
      {
        icon: mdiCogOutline,
        label: 'Settings',
        to: '/settings',
      },
      {
        icon: mdiEmail,
        label: 'Messages',
        to: '/messages',
      },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true, // Keep the flag for component logic
      },
    ],
  },

]