const ServiceMan = require('../models/serviceman.model'); // Assuming the model is in /models
const mongoose = require('mongoose');

// ✅ Create ServiceMan
exports.createServiceMan = async (req, res) => {
    try {
        const { user, provider, name, phone, skills, status, location } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(provider)) {
            return res.status(400).json({ message: "Invalid user or provider ID" });
        }

        if (skills && !skills.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid skill IDs provided" });
        }

        const newServiceMan = new ServiceMan({
            user,
            provider,
            name,
            phone,
            skills: skills || [],
            status: status || "pending",
            location: location || {}
        });

        await newServiceMan.save();
        return res.status(201).json({ message: "ServiceMan created successfully", serviceMan: newServiceMan });

    } catch (error) {
        console.error("Error creating serviceman:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get ServiceMan by ID
exports.getServiceMan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid serviceman ID" });
        }

        const serviceMan = await ServiceMan.findById(id)
            .populate("user")
            .populate("provider")
            .populate("skills");

        if (!serviceMan) {
            return res.status(404).json({ message: "ServiceMan not found" });
        }

        return res.status(200).json(serviceMan);
    } catch (error) {
        console.error("Error retrieving serviceman:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Update ServiceMan
exports.updateServiceMan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid serviceman ID" });
        }

        if (req.body.user && !mongoose.Types.ObjectId.isValid(req.body.user)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (req.body.provider && !mongoose.Types.ObjectId.isValid(req.body.provider)) {
            return res.status(400).json({ message: "Invalid provider ID" });
        }

        if (req.body.skills && !req.body.skills.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid skill IDs provided" });
        }

        const updatedServiceMan = await ServiceMan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedServiceMan) {
            return res.status(404).json({ message: "ServiceMan not found" });
        }

        return res.status(200).json({ message: "ServiceMan updated successfully", serviceMan: updatedServiceMan });
    } catch (error) {
        console.error("Error updating serviceman:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Delete ServiceMan
exports.deleteServiceMan = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid serviceman ID" });
        }

        const deletedServiceMan = await ServiceMan.findByIdAndDelete(id);
        if (!deletedServiceMan) {
            return res.status(404).json({ message: "ServiceMan not found" });
        }

        return res.status(200).json({ message: "ServiceMan deleted successfully" });
    } catch (error) {
        console.error("Error deleting serviceman:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
