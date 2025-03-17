import { ProductType } from "../types/Types"

interface PropsType {
    product: ProductType
}

const ProductCard = (props: PropsType) => {
    const { name, image, price } = props.product
    return (
        <div className="px-[16px]">
            <div className="flex flex-row items-center justify-around my-5 w-full h-28 px-3">
                <div className="w-2/5 flex items-center justify-center">
                    <img src={image} alt={name} className="object-cover w-28 h-28 rounded-2xl" />
                </div>
                <div className="flex-col text-center text-white justify-center items-center w-3/5">
                    <div className="font-bold">
                        <p>{name}</p>
                    </div>
                    <div className="mt-1">
                        <p>{price} TL</p>
                    </div>
                </div>
            </div>
            <hr className="text-white" />
        </div>
    )
}

export default ProductCard