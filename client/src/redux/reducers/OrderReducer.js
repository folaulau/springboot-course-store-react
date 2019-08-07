
let numberOfProducts = localStorage.getItem("numberOfProducts");
let numberOfLineItems = localStorage.getItem("numberOfLineItems");

if (numberOfProducts === undefined || numberOfProducts === null) {
    numberOfProducts = 0;
}

if (numberOfLineItems === undefined || numberOfLineItems === null) {
    numberOfLineItems = 0;
}

const shoppingInitialState = {
    numberOfProducts: numberOfProducts,
    numberOfLineItems: numberOfLineItems
};

let newOrder;

export const OrderStateReducer = (state = shoppingInitialState, action) => {

    switch (action.type) {
        case 'SET_ORDER_IN_SHOPPING_CART':

            newOrder = action.payload;

            localStorage.setItem("numberOfProducts", newOrder.lineItems.length);
            localStorage.setItem("numberOfLineItems", newOrder.totalItemCount);
            localStorage.setItem("orderUid", newOrder.uid);

            return Object.assign({}, state, {
                numberOfProducts: newOrder.lineItems.length,
                numberOfLineItems: newOrder.totalItemCount
            });
        case 'EMPTY_SHOPPING_CART':

            newOrder = action.payload;

            localStorage.removeItem("numberOfProducts");
            localStorage.removeItem("numberOfLineItems");
            localStorage.removeItem("orderUid");

            return Object.assign({}, state, {
                numberOfProducts: 0,
                numberOfLineItems: 0
            });

        default:
            return state;
    }
}