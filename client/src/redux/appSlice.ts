import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppSliceType {
    loading: boolean,
    drawer: boolean
}

const initialState: AppSliceType = {
    loading: false,
    drawer: false
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state: AppSliceType, actions: PayloadAction<boolean>) => {
            state.loading = actions.payload;
        },
        setDrawer: (state: AppSliceType, actions: PayloadAction<boolean>) => {
            state.drawer = actions.payload;
        }
    },
})

export const { setLoading, setDrawer } = appSlice.actions

export default appSlice.reducer