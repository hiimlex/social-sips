import React, { useState } from "react";
import { CreateOrderProductPayload, IProduct } from "../../../../@types";
import { OrdersService } from "../../../../api";
import { Button } from "../../../../components";
import { ProductsRowCard } from "../../../WaiterProducts/components";
import { AddProduct } from "../../WaiterAddProducts";
import "./styles.scss";

interface ConfirmAddProductsProps {
	orderId: number;
	productList: AddProduct;
	cancel?: () => void;
	onChange?: (productList: AddProduct) => void;
	onConfirm?: () => void;
}

const ConfirmAddProducts: React.FC<ConfirmAddProductsProps> = ({
	productList,
	cancel,
	onChange,
	orderId,
	onConfirm,
}) => {
	const [adding, setAdding] = useState(false);

	const onAddProduct = (product: IProduct, quantity: number) => {
		const newToAddProducts = JSON.parse(JSON.stringify(productList));

		if (!newToAddProducts[product.id]) {
			newToAddProducts[product.id] = { product, quantity };
		}

		if (newToAddProducts[product.id]) {
			newToAddProducts[product.id].quantity = quantity;

			if (+newToAddProducts[product.id].quantity === 0) {
				delete newToAddProducts[product.id];
			}
		}

		onChange && onChange(newToAddProducts);
	};

	const confirmAddProducts = async () => {
		setAdding(true);

		try {
			const arr: CreateOrderProductPayload[] = Object.values(productList).map(
				({ product, quantity }) => ({
					product_id: product.id,
					quantity,
				})
			);

			await OrdersService.add_order_products(orderId.toString(), arr);

			setAdding(false);

			onConfirm && onConfirm();
		} catch (error) {
			console.log(error);
			setAdding(false);
		}
	};

	return (
		<div className="c-a-p">
			<div className="c-a-p-card">
				<span className="c-a-p-title">
					Deseja Adicionar esses items à Comanda ?
				</span>

				<div className="c-a-p-list">
					{Object.values(productList).map(({ product, quantity }) => (
						<ProductsRowCard
							key={product.id}
							product={product}
							quantity={quantity}
							showChangeButtons
							onChange={onAddProduct}
						/>
					))}
				</div>

				<footer className="c-a-p-footer">
					<Button
						className="fill-row"
						theme="secondary"
						variant="outlined"
						onClick={cancel}
					>
						Cancelar
					</Button>
					<Button
						className="fill-row"
						theme="secondary"
						loading={adding}
						onClick={confirmAddProducts}
					>
						Confirmar
					</Button>
				</footer>
			</div>
		</div>
	);
};

export { ConfirmAddProducts };
