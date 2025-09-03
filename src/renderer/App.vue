

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
              <n-input-number v-model:value="countWafer" :disabled="!editMode" style="width: 150px;" />
              <n-input-number v-model:value="store.inventory.wafer" :disabled="!editMode" style="width: 150px;" />
              </span>
            </n-text>
              <n-text>
                <h3>{{weeks_left.wafer}} </h3> 
              </n-text>
             
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Antennas (units): </label>
           <n-text type="info">
              <span class="flex">
              <n-input-number v-model:value="countAntennas" :disabled="!editMode" style="width: 150px;" />
              <n-input-number v-model:value="store.inventory.antennas" :disabled="!editMode" style="width: 150px;" /></span>
            </n-text>
            <n-text>
               <h3>{{weeks_left.antennas}}</h3>
            </n-text>
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Capacitors (units): </label>
           <n-text type="info">
             <span class="flex">
               <n-input-number v-model:value="countCapacitors" :disabled="!editMode" style="width: 150px;" />
               <n-input-number v-model:value="store.inventory.capacitors" :disabled="!editMode" style="width: 150px;" />
             </span>
            </n-text>
            <n-text>
               <h3>{{weeks_left.capacitors}}</h3>
            </n-text>
          </div>
           <div class="flex-center">
          <label style="width: 350px;">Epoxy (units): </label>
           <n-text type="info">
             <span class="flex">
               <n-input-number v-model:value="countEpoxy" :disabled="!editMode" style="width: 150px;" />
               <n-input-number v-model:value="store.inventory.epoxy" :disabled="!editMode" style="width: 150px;" />
             </span>
            </n-text>
            <n-text>
              <h3>
              {{weeks_left.epoxy}}

              </h3>
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
import { NInput, NButton, NInputNumber, NText } from 'naive-ui';

const store = useInventoryStore();
const loading = ref(false);
const error = ref('');
const activeTab = ref(0);
const editMode = ref(false);
const antennas = ref(28000);

const baseValue = ref(10)

const storeWafer = ref(store.inventory.wafer)
const storeUnitWafer = ref(store.inventory_units.wafer)

// const countWafer = computed(() => round2(store.inventory.wafer / store.inventory_units.wafer));
const round2 = (val: number) => Math.round(val * 100) / 100;


const calculatedValue = computed({
  get() {
    return baseValue.value * 2
  },
  set(newVal) {
    baseValue.value = newVal / 2
  }
})


const countWafer = computed({
  get() {
    debugger
    return round2(storeWafer.value / storeUnitWafer.value)
  },
  set(newValue) {
    // When someone changes the value via v-model, update baseValue accordingly
    storeWafer.value = newValue
  }
})
const countAntennas = computed(() => round2(store.inventory.antennas / store.inventory_units.antennas));
const countCapacitors = computed(() => round2(store.inventory.capacitors / store.inventory_units.capacitors));
const countEpoxy = computed(() => round2(store.inventory.epoxy / store.inventory_units.epoxy));

const weeks_left = computed(() => {
  return {
                wafer: round2(  store.inventory.wafer / (store.shifts * store.shift_amount) ),
                antennas: round2(store.inventory.antennas / (store.shifts * store.shift_amount)),
                capacitors: round2(store.inventory.capacitors / (store.shifts * store.shift_amount)),
                epoxy: round2(store.inventory.epoxy / (store.shifts * store.shift_amount))
            };
        }
    );


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
    const data = await readConfig();
    if (data) store.setInventory(data);
    if (data && data.meta) {
      store.setMeta(data.meta);
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
  loading.value = false;
};

const printInventory = async () => {
  loading.value = true;
  error.value = '';

  store.inventory.wafer -= antennas.value;
  store.inventory.antennas -= antennas.value;
  store.inventory.capacitors -= antennas.value;
  store.inventory.epoxy -= antennas.value;

  try {
    // @ts-ignore
    await saveInventory(store.inventory);
  } catch (e) {
   error.value = e instanceof Error ? e.message : String(e);
  }
  loading.value = false;
};

const saveData = async () => {
    const data = {
        wafer: countWafer.value * store.inventory_units.wafer,
        antennas: countAntennas.value * store.inventory_units.antennas,
        capacitors: countCapacitors.value * store.inventory_units.capacitors,
        epoxy: countEpoxy.value * store.inventory_units.epoxy
    }
  await saveInventory(data);
  editMode.value = !editMode.value;
}

const saveInventory = async (data : any) => {
  loading.value = true;
  const newValue = JSON.parse(JSON.stringify(data))
  error.value = '';
  try {
    // @ts-ignore
    const result = await window.electronAPI.writeInventory(newValue);
     store.setMeta(result.meta);
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
</style>

