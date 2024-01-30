import coupon from "/mock/coupon.json"

const checkIfCouponExist = (name) => {
    return coupon.find(item => item.name === name);
};
export default checkIfCouponExist;
