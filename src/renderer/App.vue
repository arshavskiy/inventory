

<template>
  <!-- <Tabs :tabs="['Inventory', 'Edit', 'Other']" v-model:activeTab="activeTab"> -->
    <!-- <template #Inventory> -->
      <section>
        <div display="flex" style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
          <h2>Inventory</h2>
          <div>
            <n-button v-if="!editMode"  type="warning" @click="editMode = !editMode">Edit</n-button>
            <n-button v-if="editMode" type="primary" @click="saveData">Save</n-button>
          </div>
          <div style="width: 400px; display: flex; align-items:center">
            <div style="margin-right: 40px;">Shifts (weekly): </div>
            <div style="margin-right: 40px;">
             <n-input-number  v-model:value="store.shifts" style="width: 100px;" />
            </div>
           
          </div>

          <n-text type="success">
            <span>Weeks left: </span>
          </n-text>
        </div>

        <div v-if="loading">
          <n-spin  size="large" style="margin: 2rem 0;" />
        </div>

        <div>
          <div v-if="error" style="color:red">{{ error }}</div>
          <div class="flex-center">
            <label style="width: 350px;">Wafer (units): </label>
            <n-text type="info">
              <span class="flex">
              <n-input-number v-model:value="store.inventory.wafer" @update:value="updateInventory('wafer', $event)" :disabled="!editMode" style="width: 150px;" />
              <n-input-number v-model:value="store.inventory_total.wafer" :disabled="!editMode" style="width: 150px;" />
              </span>
            </n-text>
              <n-text>
                <h3 :class="{red: store.weeks_left.wafer <= 2}">{{store.weeks_left.wafer}} </h3> 
              </n-text>
             
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Antennas (units): </label>
           <n-text type="info">
              <span class="flex">
              <n-input-number v-model:value="store.inventory.antennas" @update:value="updateInventory('antennas', $event)" :disabled="!editMode" style="width: 150px;" />
              <n-input-number v-model:value="store.inventory_total.antennas" :disabled="!editMode" style="width: 150px;" /></span>
            </n-text>
            <n-text>
               <h3 :class="{red: store.weeks_left.antennas <= 2}">{{store.weeks_left.antennas}}</h3>
            </n-text>
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Capacitors (units): </label>
           <n-text type="info">
             <span class="flex">
               <n-input-number v-model:value="store.inventory.capacitors" @update:value="updateInventory('capacitors', $event)" :disabled="!editMode" style="width: 150px;" />
               <n-input-number v-model:value="store.inventory_total.capacitors" :disabled="!editMode" style="width: 150px;" />
             </span>
            </n-text>
            <n-text>
               <h3 :class="{red: store.weeks_left.capacitors <= 2}">{{store.weeks_left.capacitors}}</h3>
            </n-text>
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Epoxy (units): </label>
           <n-text type="info">
             <span class="flex">
               <n-input-number v-model:value="store.inventory.epoxy" @update:value="updateInventory('epoxy', $event)" :disabled="!editMode" style="width: 150px;" />
               <n-input-number v-model:value="store.inventory_total.epoxy" :disabled="!editMode" style="width: 150px;" />
             </span>
            </n-text>
            <n-text>
              <h3 :class="{red: store.weeks_left.epoxy <= 2}">{{store.weeks_left.epoxy}}</h3>
            </n-text>
          </div>
        </div>
        <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
          <n-button type="info" @click="sendMail" style="width: 200px;">Send Inventory Email</n-button>

         <div style="display: flex;align-items: center;">
          <div style="margin-right: 20px;">
            <n-text>
              Antennas (units):
            </n-text>
          </div>
              <n-input-number v-model:value="antennas" style="width: 150px; margin-right: 10px; " />
              <n-button type="primary" @click="printInventory">Print</n-button>
            </div>
            </div>  
            <code>
              <n-text type="info">
                <span>
                  Email sent at {{ store.meta.lastEmailDate ? new Date(store.meta.lastEmailDate).toLocaleString() : 'N/A' }}
                </span>
                <br>
                <span>
                  Inventory saved {{ store.meta.lastInventorySaveDate ? new Date(store.meta.lastInventorySaveDate).toLocaleString() : 'N/A' }}
                </span>
              </n-text>
            </code>
      </section>
    <!-- </template>
    <template #Edit>
      <section>
        <h2>Edit Inventory</h2>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <div v-if="error" style="color:red">{{ error }}</div>
           <div class="flex-center">
            <label>Wafer (units): </label>
              <n-input-number  v-model:value="store.inventory.wafer" style="width: 100px;" />
          </div>
           <div class="flex-center">
          <label>Antennas (units): </label>
              <n-input-number  v-model:value="store.inventory.antennas" style="width: 100px;" />
          </div>
           <div class="flex-center">
          <label>Capacitors (units): </label>
              <n-input-number  v-model:value="store.inventory.capacitors" style="width: 100px;" />
          </div>
           <div class="flex-center">
          <label>Epoxy (units): </label>
              <n-input-number  v-model:value="store.inventory.epoxy" style="width: 100px;" />  
          </div>
          <n-button type="primary" @click="saveData" style="margin-top: 1rem;">Save</n-button>
        </div>
      </section>
    </template>
    <template #Other>
      <section>
        <h2>Other</h2>
        <p>Placeholder for future features.</p>
      </section>
    </template> -->
  <!-- </Tabs> -->
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue';
import { useInventoryStore } from './store/inventory';
import Tabs from './components/Tabs.vue';
import { NInput, NButton, NInputNumber, NText, NSpin } from 'naive-ui';

const store = useInventoryStore();
const loading = ref(false);
const error = ref('');
const activeTab = ref(0);
const editMode = ref(false);
const antennas = ref(28000);

const baseValue = ref(10);

const updateShifts = (value: number) => {
  console.log('Updating shifts:', value);
  if (value !== undefined) {
    store.setShifts(value);
  }
};

const updateInventory = (key: string, value: number) => {
  console.log('Updating inventory:', key, value);
  if (key in store.inventory && value !== undefined) {
    store.inventory[key] = value;
    store.setDataTotals(key, store.inventory[key] * store.inventory_units[key]);
  }
};

const readConfig = async () => {
  try {
    // @ts-ignore
    const data = await window.electronAPI.readConfig();
    console.log('read-config data:', data);
    return data;
  } catch (e) {
    console.error('Failed to read config:', e);
    return null;
  }
};

const loadInventory = async () => {
  loading.value = true;
  error.value = '';
  try {
    const result = await readConfig();
    console.log('load-inventory data:', result);
    if (result) store.setInventory(result);
    if (result && result.meta) {
      store.setMeta(result.meta);
     
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
  loading.value = false;
};

const printInventory = async () => {
  loading.value = true;
  error.value = '';

  store.inventory_total.wafer -= antennas.value;
  store.inventory_total.antennas -= antennas.value;
  store.inventory_total.capacitors -= antennas.value;
  store.inventory_total.epoxy -= antennas.value;

  console.log('Printing inventory:', store);

  const save = {
    inventory_total: store.inventory_total,
    inventory: store.inventory,
    weeks_left: store.weeks_left,
    shifts: store.shifts,
  }

  console.log('Saving inventory before print:', save);
  try {
    // @ts-ignore
    await saveInventory(save);
  } catch (e) {
   error.value = e instanceof Error ? e.message : String(e);
  }
  loading.value = false;
};

const saveData = async () => {
    const save = {
    inventory_total: store.inventory_total,
    inventory: store.inventory,
    weeks_left: store.weeks_left,
    shifts: store.shifts,
  }
  await saveInventory(save);
  editMode.value = !editMode.value;
}

const saveInventory = async (data : any) => {
  loading.value = true;
  // const newValue = JSON.parse(JSON.stringify(data))
  debugger
  error.value = '';
  try {
    // @ts-ignore
    const result = await window.electronAPI.writeInventory(JSON.stringify(data));
     store.setMeta(result.meta);

     loadInventory();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
  loading.value = false;
};

const sendMail = async () => {
  loading.value = true;
  error.value = '';
  try {
    // @ts-ignore
    const result = await window.electronAPI.sendMailWithCSV();
    store.setMeta(result.meta);
    if (result && result.success) {
      error.value = '';
      // alert('Email sent successfully at ' + new Date(result.meta.lastEmailDate).toLocaleString());
    } else {
      error.value = 'Failed to send email.';
    }
  } catch (e) {
    error.value = 'Failed to send email.';
  }
  loading.value = false;
};

// Load inventory when switching to Edit Inventory tab
watch(activeTab, (tabIdx) => {
  if (tabIdx === 1) {
    loadInventory();
  }
});

loadInventory();
</script>

<style>
label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 80px;
  margin-left: 0.5rem;
}

h3{
  width: 230px;
  text-align: right;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.flex-center {
  display: flex;
  align-items: center;
}

section {
  margin: 1rem 2rem;
  max-width: 900px;
}

.n-input__input-el .n-input--disabled  {
  color: #000 !important;
}

.flex{
  display: flex;
}

code{
    display: flex;
    background: #f5f5f5;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    font-family: monospace;
    white-space: pre-wrap;
    height: 40px;
    font-size: 11px;
  }
  .red{
    color: red;
  }
</style>

