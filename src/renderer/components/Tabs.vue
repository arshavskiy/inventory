<template>
  <div>
    <div class="tabs">
      <button v-for="(tab, idx) in tabs" :key="tab" :class="{active: idx === activeTab}" @click="activeTab = idx">
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <slot :name="tabs[activeTab]" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    tabs: {
      type: Array as () => string[],
      required: true
    }
  },
  setup() {
    const activeTab = ref(0);
    return { activeTab };
  }
});
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background: #eee;
  cursor: pointer;
}
button.active {
  background: #42b983;
  color: white;
}
.tab-content {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
