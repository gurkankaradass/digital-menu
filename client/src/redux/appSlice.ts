import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CafeInfoType, CategoryType, EmployeeType, ProductType } from '../types/Types'

export interface AppSliceType {
    cafeInfo: CafeInfoType | null,
    currentEmployee: EmployeeType | null,
    products: ProductType[],
    categories: CategoryType[],
    loading: boolean,
    drawer: boolean
}

const initialState: AppSliceType = {
    cafeInfo: null,
    currentEmployee: null,
    products: [],
    categories: [],
    loading: false,
    drawer: false
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCafeInfo: (state: AppSliceType, actions: PayloadAction<CafeInfoType>) => {
            state.cafeInfo = actions.payload;
        },
        setCurrentEmployee: (state: AppSliceType, action: PayloadAction<EmployeeType | null>) => {
            state.currentEmployee = action.payload;
        },
        setProducts: (state: AppSliceType, actions: PayloadAction<ProductType[]>) => {
            state.products = actions.payload;
        },
        setCategories: (state: AppSliceType, actions: PayloadAction<CategoryType[]>) => {
            state.categories = actions.payload;
        },
        setLoading: (state: AppSliceType, actions: PayloadAction<boolean>) => {
            state.loading = actions.payload;
        },
        setDrawer: (state: AppSliceType, actions: PayloadAction<boolean>) => {
            state.drawer = actions.payload;
        }
    },
})

export const { setCafeInfo, setCurrentEmployee, setProducts, setCategories, setLoading, setDrawer } = appSlice.actions

export default appSlice.reducer