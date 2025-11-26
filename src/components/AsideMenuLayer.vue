<script setup>
import { mdiLogout, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { computed, ref } from 'vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import AsideMenuItem from '@/components/AsideMenuItem.vue'
import BaseIcon from '@/components/BaseIcon.vue'

defineProps({
  menu: {
    type: Array,
    required: true,
  },
  isAsideMobileExpanded: {
    type: Boolean,
    default: true,
  },
  isAsideLgActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const isCollapsed = ref(false)

const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'info',
  isLogout: true,
}))

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside
    id="aside"
    :class="[
      'fixed top-0 z-40 flex h-screen overflow-hidden transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-60',
      {
        'ml-0': isAsideMobileExpanded,
        '-ml-60': !isAsideMobileExpanded,
        'lg:ml-0': true
      }
    ]"
  >
    <div class="aside flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 shadow-lg border-r border-gray-200 dark:border-slate-700">
      
      <!-- Header -->
      <div class="aside-brand flex h-14 flex-row items-center justify-center bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-2">
        
        <!-- When Expanded: Show title and toggle button -->
        <template v-if="! isCollapsed">
          <div class="flex-1 px-2">
            <b class="font-black text-blue-600 dark:text-blue-400">FB Collector</b>
          </div>
          <!-- <button 
            :class="[
              'p-2 transition-all duration-200 rounded-lg flex items-center justify-center',
              'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600',
              'border border-gray-200 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500'
            ]"
            @click.prevent="toggleCollapse"
            title="Collapse Sidebar"
          >
            <BaseIcon 
              :path="mdiChevronLeft" 
              size="20"
              class="text-gray-700 dark:text-gray-200"
            />
          </button> -->
        </template>

        <!-- When Collapsed: Show only app icon (clickable) -->
        <template v-else>
          <button 
            @click.prevent="toggleCollapse"
            title="Expand Sidebar"
            class="w-10 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-200"
          >
            <span class="text-white font-bold text-sm">FB</span>
          </button>
        </template>
      </div>

      <!-- Menu Content -->
      <div 
        :class="[
          'aside-scrollbar flex-1 overflow-x-hidden overflow-y-auto dark:scrollbar-styled-dark transition-all duration-300',
          isCollapsed ? 'px-1' : 'px-2'
        ]"
      >
        <AsideMenuList 
          :menu="menu" 
          :is-collapsed="isCollapsed"
          @menu-click="menuClick" 
        />
      </div>

      <!-- Logout Button at Bottom -->
      <ul class="border-t border-gray-200 dark:border-slate-700 p-1">
        <AsideMenuItem 
          :item="logoutItem" 
          :is-collapsed="isCollapsed"
          @menu-click="menuClick" 
        />
      </ul>
    </div>
  </aside>
</template>