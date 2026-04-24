export const getGreetingKey = (dob?: string | null) => {
    if (dob) {
        const today = new Date();
        const birth = new Date(dob);
        if (birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate()) {
            return "messages.birthday";
        }
    }

    const hour = new Date().getHours();
    if (hour < 12) return "messages.morning";
    if (hour < 17) return "messages.afternoon";
    return "messages.evening";
    
};
