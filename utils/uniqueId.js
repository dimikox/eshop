const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 10); // Random alphanumeric string
    return `${timestamp}-${random}`;
};
export default generateUniqueId;
