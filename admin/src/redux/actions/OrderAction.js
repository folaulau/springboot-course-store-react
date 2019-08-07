export const setOrderInShoppingCart = order => {
    return {
        type: 'SET_ORDER_IN_SHOPPING_CART',
        payload: order
    };
};

export const emptyShoppingCart = order => {
    return {
        type: 'EMPTY_SHOPPING_CART',
        payload: order
    };
};