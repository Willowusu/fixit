const dotenv = require('dotenv')
// Determine environment (default to development)
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("./models/user.model");
const Subscription = require("./models/subscription.model");

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ MongoDB Connected...");
        //sync indexes
        await mongoose.model("Subscription").syncIndexes();
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};




// Function to create a super admin user
const createSuperAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@admin.com" });
        if (existingAdmin) {
            console.log("✅ Super admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("Password12$", 10);

        const newAdmin = new User({
            email: "admin@admin.com",
            password: hashedPassword,
            role: "super_admin"
        });

        await newAdmin.save();
        console.log("✅ Super admin created successfully.");
    } catch (error) {
        console.error("❌ Error creating super admin:", error);
    }
};

// Function to create subscription plans
const createSubscriptions = async () => {
    const subscriptions = [
        {
            name: "Enterprise White Label",
            type: "white_label",
            price: 499.99,
            billingCycle: "monthly",
            commissionPercentage: 0,
            maxServicemen: 500,
            maxBranches: 50,
            maxClients: 5000,
            customBranding: true,
            prioritySupport: true,
            analyticsDashboard: true,
            whiteLabelDomain: true
        },
        {
            name: "Standard Marketplace",
            type: "open_marketplace",
            price: 99.99,
            billingCycle: "monthly",
            commissionPercentage: 10,
            maxServicemen: 100,
            maxBranches: 10,
            maxClients: "unlimited",
            featuredListing: false,
            prioritySupport: false,
            analyticsDashboard: true
        },
        {
            name: "Free Trial",
            type: "open_marketplace",
            price: 0,
            billingCycle: "monthly",
            commissionPercentage: 15,
            maxServicemen: 5,
            maxBranches: 1,
            maxClients: 50,
            featuredListing: false,
            prioritySupport: false,
            analyticsDashboard: false
        }
    ];

    try {
        for (const sub of subscriptions) {
            const exists = await Subscription.findOne({ name: sub.name });
            if (!exists) {
                await new Subscription(sub).save();
                console.log(`✅ Subscription plan '${sub.name}' created.`);
            } else {
                console.log(`✅ Subscription plan '${sub.name}' already exists.`);
            }
        }
    } catch (error) {
        console.error("❌ Error creating subscriptions:", error);
    }
};

// Run setup process
const setupDatabase = async () => {
    await connectDB();
    await createSuperAdmin();
    await createSubscriptions();
    console.log("✅ Database setup completed.");
    process.exit();
};

setupDatabase();
