export const getGreetingKey = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "messages.morning";
    if (hour < 17) return "messages.afternoon";
    return "messages.evening";
};
