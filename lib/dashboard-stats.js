const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

function percentChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

export function computeDashboardStats(orders, now = new Date()) {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.customerPhone)).size;

    const ordersThisMonth = orders.filter(o => new Date(o.createdAt) >= startOfThisMonth);
    const ordersLastMonth = orders.filter(
        o => new Date(o.createdAt) >= startOfLastMonth && new Date(o.createdAt) < startOfThisMonth
    );

    const customersThisMonth = new Set(ordersThisMonth.map(o => o.customerPhone)).size;
    const customersLastMonth = new Set(ordersLastMonth.map(o => o.customerPhone)).size;

    const ordersDelta = percentChange(ordersThisMonth.length, ordersLastMonth.length);
    const customersDelta = percentChange(customersThisMonth, customersLastMonth);

    // Daily sales — last 14 days
    const dailyBuckets = new Map();
    const dailyOrder = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - i);
        const key = dayKey(d);
        dailyBuckets.set(key, { value: 0, label: `${d.getDate()}/${d.getMonth() + 1}` });
        dailyOrder.push(key);
    }
    orders.forEach(o => {
        const key = dayKey(new Date(o.createdAt));
        if (dailyBuckets.has(key)) {
            dailyBuckets.get(key).value += o.total;
        }
    });
    const dailySales = dailyOrder.map(key => dailyBuckets.get(key));

    // Monthly sales — last 6 months
    const monthlyBuckets = new Map();
    const monthlyOrder = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = monthKey(d);
        monthlyBuckets.set(key, { value: 0, label: MONTH_LABELS[d.getMonth()] });
        monthlyOrder.push(key);
    }
    orders.forEach(o => {
        const key = monthKey(new Date(o.createdAt));
        if (monthlyBuckets.has(key)) {
            monthlyBuckets.get(key).value += o.total;
        }
    });
    const monthlySales = monthlyOrder.map(key => monthlyBuckets.get(key));

    // Recent orders
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    // Top categories by revenue
    const categoryRevenue = new Map();
    orders.forEach(o => {
        o.items.forEach(item => {
            const category = item.product?.category || 'Lainnya';
            const revenue = item.price * item.quantity;
            categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue);
        });
    });
    const totalCategoryRevenue = Array.from(categoryRevenue.values()).reduce((a, b) => a + b, 0) || 1;
    const topCategories = Array.from(categoryRevenue.entries())
        .map(([category, revenue]) => ({
            category,
            revenue,
            percentage: Math.round((revenue / totalCategoryRevenue) * 100),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return {
        totalOrders,
        totalCustomers,
        ordersDelta,
        customersDelta,
        dailySales,
        monthlySales,
        recentOrders,
        topCategories,
    };
}
