import { defineStore } from 'pinia';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        inventory_units: {
            wafer: 0,
            antennas: 0,
            capacitors: 0,
            epoxy: 0
        },
        inventory: {
            wafer: 0,
            antennas: 0,
            capacitors: 0,
            epoxy: 0
        },
        minimum_in_weeks: {
            wafer: 0,
            antennas: 0,
            capacitors: 0,
            epoxy: 0
        },
        weeks_left: {
            wafer: 0,
            antennas: 0,
            capacitors: 0,
            epoxy: 0
        },
        shifts: 0,
        shift_amount: 0,
        meta: {
            lastEmailDate: Date.now(),
            lastInventorySaveDate: Date.now()
        }
    }),
    getters: {
        countWafer(state) {
            return state.inventory.wafer / (state.inventory_units.wafer || 1);
        },
        countAntennas(state) {
            return state.inventory.antennas / (state.inventory_units.antennas || 1);
        },
        countCapacitors(state) {
            return state.inventory.capacitors / (state.inventory_units.capacitors || 1);
        },
        countEpoxy(state) {
            return state.inventory.epoxy / (state.inventory_units.epoxy || 1);
        },
        weeksLeft(state) {
            const round2 = (val: number) => Math.round(val * 100) / 100;
            debugger
            return {
                wafer: round2(state.inventory.wafer / ((state.shifts || 1) * (state.shift_amount || 1))),
                antennas: round2(state.inventory.antennas / ((state.shifts || 1) * (state.shift_amount || 1))),
                capacitors: round2(state.inventory.capacitors / ((state.shifts || 1) * (state.shift_amount || 1))),
                epoxy: round2(state.inventory.epoxy / ((state.shifts || 1) * (state.shift_amount || 1)))
            };
        }
    },
    actions: {
        setInventory(data: any) {
            this.inventory = data.inventory;
            this.inventory_units = data.inventory_units;
            this.minimum_in_weeks = data.minimum_in_weeks;
            this.shifts = data.shifts;
            this.shift_amount = data.shift_amount;
        },
        setMeta(meta: any) {
            this.meta = meta;
        },
        setWeeksLeft(weeks: { wafer: number; antennas: number; capacitors: number; epoxy: number }) {
            this.weeks_left = weeks;
        }
    }
});
