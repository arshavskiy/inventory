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
        inventory_total: {
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
    actions: {
        setShifts(shifts: number) {
            this.shifts = shifts;
        },
        setInventory(data: any) {
            this.inventory = data.inventory;
            this.inventory_units = data.inventory_units;
            this.inventory_total = data.inventory_total;
            this.minimum_in_weeks = data.minimum_in_weeks;
            this.weeks_left = data.weeks_left;
            this.shifts = data.shifts;
            this.shift_amount = data.shift_amount;
        },
        setMeta(meta: any) {
            this.meta = meta;
        },
        setDataTotals(key: string, data: any) {
            this.inventory_total[key] = data
        },
        setWeeksLeft(weeks: { wafer: number; antennas: number; capacitors: number; epoxy: number }) {
            this.weeks_left = weeks;
        }
    }
});
