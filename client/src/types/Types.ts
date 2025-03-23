export interface CafeInfoType {
    id?: number,
    name: string,
    logo: string,
    phone: string,
    location: string,
    address: string,
    map: string,
    instagram: string
}

export interface EmployeeType {
    id?: number,
    username: string,
    password: string,
    role: string
}

export interface CategoryType {
    id?: number,
    name: string,
    image: string
}

export interface ProductType {
    id?: number,
    name: string,
    image: string,
    price: number,
    categoryName: string
}

export interface TableType {
    id?: number,
    table_number: number,
    bill?: number
}

export interface OrderType {
    id?: number,
    table_id: number,
    product_id?: number,
    quantity: number,
    totalPrice?: number
}