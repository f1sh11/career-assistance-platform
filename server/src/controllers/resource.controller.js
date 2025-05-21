import Resource from "../models/Resource.js";
import AuditLog from "../models/AuditLog.js";

// 上传资源（导师 / 行业 / 管理员）
export const uploadResource = async (req, res) => {
  try {
    const { title, description, fileUrl, category } = req.body;
    const role = req.user.role;
    const uploaderId = req.user.id;

    if (!["mentor", "industry", "admin"].includes(role)) {
      return res.status(403).json({ message: "Not authorized to upload resources" });
    }

    const status = role === "admin" ? "approved" : "pending";

    const newResource = new Resource({
      title,
      description,
      fileUrl,
      category,
      uploader: uploaderId,
      status
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload resource", error: err.message });
  }
};

// 获取已通过的资源（分页 + 分类 + 搜索）
export const getResources = async (req, res) => {
  try {
    const { category = "", search = "", page = 1, limit = 15 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      status: "approved",
      ...(category ? { category } : {}),
      ...(search ? { title: { $regex: search, $options: "i" } } : {})
    };

    const [resources, total] = await Promise.all([
      Resource.find(filter).sort({ uploadDate: -1 }).skip(skip).limit(parseInt(limit)),
      Resource.countDocuments(filter)
    ]);

    res.status(200).json({
      resources,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resources", error: err.message });
  }
};

// 获取待审核资源（仅管理员）
export const getPendingResources = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view pending resources" });
    }

    const resources = await Resource.find({ status: "pending" }).populate("uploader", "identifier role");
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending resources", error: err.message });
  }
};

// 审核通过资源
export const approveResource = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can approve resources" });
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    await AuditLog.create({
      adminId: req.user.id,
      resourceId: resource._id,
      action: "approve"
    });

    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve resource", error: err.message });
  }
};

// 审核驳回资源
export const rejectResource = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can reject resources" });
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    await AuditLog.create({
      adminId: req.user.id,
      resourceId: resource._id,
      action: "reject"
    });

    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Failed to reject resource", error: err.message });
  }
};

// 上传本地文件
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
};

// 获取审核日志（仅管理员）
export const getAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view audit logs" });
    }

    const logs = await AuditLog.find({})
      .populate("adminId", "identifier")
      .populate("resourceId", "title")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs", error: err.message });
  }
};

// ✅ 删除资源（上传者本人或管理员）
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const isUploader = resource.uploader.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this resource" });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resource", error: err.message });
  }
};
