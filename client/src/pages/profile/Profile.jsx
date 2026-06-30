import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userApi";
import { authAPI } from "../../api/authApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import { Camera, Edit2, X, Lock, Trash2, Save } from "lucide-react";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const heightFromCm = (cm) => {
    if (!cm) return { feet: "", inches: "" };
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    return { feet: String(feet), inches: String(inches) };
  };

  const initialHeight = heightFromCm(user?.healthProfile?.height?.value);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    age: user?.healthProfile?.age || "",
    weight: user?.healthProfile?.weight?.value || "",
    heightFeet: initialHeight.feet,
    heightInches: initialHeight.inches,
    gender: user?.healthProfile?.gender || "",
    activityLevel: user?.healthProfile?.activityLevel || "",
    workoutExperience: user?.healthProfile?.workoutExperience || "",
    foodPreference: user?.healthProfile?.foodPreference || "",
    sleepHours: user?.healthProfile?.sleepHours || 7,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    document.title = "Profile — TalishFits";
  }, []);

  useEffect(() => {
    if (user) {
      const h = heightFromCm(user.healthProfile?.height?.value);
      setEditData({
        name: user.name || "",
        age: user.healthProfile?.age || "",
        weight: user.healthProfile?.weight?.value || "",
        heightFeet: h.feet,
        heightInches: h.inches,
        gender: user.healthProfile?.gender || "",
        activityLevel: user.healthProfile?.activityLevel || "",
        workoutExperience: user.healthProfile?.workoutExperience || "",
        foodPreference: user.healthProfile?.foodPreference || "",
        sleepHours: user.healthProfile?.sleepHours || 7,
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await userAPI.uploadAvatar(formData);
      updateUser({ avatar: res.data.data.avatar });
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await userAPI.updateProfile({
        name: editData.name,
        healthProfile: {
          age: editData.age,
          weight: editData.weight,
          heightFeet: editData.heightFeet,
          heightInches: editData.heightInches,
          gender: editData.gender,
          activityLevel: editData.activityLevel,
          workoutExperience: editData.workoutExperience,
          foodPreference: editData.foodPreference,
          sleepHours: editData.sleepHours,
        },
      });

      if (res.data.success) {
        updateUser(res.data.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      await authAPI.changePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteAccount({});
      await logout();
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-page">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-page-header"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{ width: "24px", height: "1.5px", background: "#c4a87a" }}
            />
            <span className="font-mono profile-tag">Account</span>
          </div>
          <h1 className="font-display profile-title">Your Profile.</h1>
        </motion.div>

        <div className="premium-card profile-info-card">
          <div className="profile-info-content">
            <label className="profile-avatar-wrapper">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <span className="font-display">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="profile-avatar-overlay">
                <Camera size={13} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
                disabled={isUploading}
              />
            </label>

            <div className="profile-info-text">
              <h2 className="font-display profile-name">{user?.name}</h2>
              <p className="font-mono profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="tag tag-dark">
                  Level {user?.gamification?.level || 1}
                </span>
                <span className="tag">
                  {(user?.selectedGoal || "fitness").replace(/_/g, " ")}
                </span>
                <span className="tag">
                  {user?.subscription?.plan || "Free"} Plan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card profile-health-card">
          <div className="profile-health-header">
            <h3 className="font-display profile-section-title">
              Health Profile
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="profile-edit-btn"
              >
                <Edit2 size={11} />
                Edit Profile
              </button>
            ) : (
              <div className="profile-edit-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className="profile-cancel-btn"
                >
                  <X size={11} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="profile-save-btn"
                >
                  <Save size={11} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          <div className="profile-fields-grid">
            <Field
              label="Name"
              value={editData.name}
              onChange={(v) => setEditData({ ...editData, name: v })}
              isEditing={isEditing}
            />
            <Field
              label="Age"
              type="number"
              value={editData.age}
              onChange={(v) => setEditData({ ...editData, age: v })}
              isEditing={isEditing}
            />
            <Field
              label="Weight (kg)"
              type="number"
              value={editData.weight}
              onChange={(v) => setEditData({ ...editData, weight: v })}
              isEditing={isEditing}
            />

            {isEditing ? (
              <div>
                <label className="font-mono field-label">Height</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="number"
                    placeholder="5"
                    value={editData.heightFeet}
                    onChange={(e) =>
                      setEditData({ ...editData, heightFeet: e.target.value })
                    }
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    placeholder="8"
                    value={editData.heightInches}
                    onChange={(e) =>
                      setEditData({ ...editData, heightInches: e.target.value })
                    }
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ) : (
              <Field
                label="Height"
                value={`${editData.heightFeet}' ${editData.heightInches}"`}
                isEditing={false}
              />
            )}

            <SelectField
              label="Gender"
              value={editData.gender}
              onChange={(v) => setEditData({ ...editData, gender: v })}
              isEditing={isEditing}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
            <SelectField
              label="Activity Level"
              value={editData.activityLevel}
              onChange={(v) => setEditData({ ...editData, activityLevel: v })}
              isEditing={isEditing}
              options={[
                { value: "sedentary", label: "Sedentary" },
                { value: "lightly_active", label: "Lightly Active" },
                { value: "moderately_active", label: "Moderately Active" },
                { value: "very_active", label: "Very Active" },
                { value: "extremely_active", label: "Extremely Active" },
              ]}
            />
            <SelectField
              label="Experience"
              value={editData.workoutExperience}
              onChange={(v) =>
                setEditData({ ...editData, workoutExperience: v })
              }
              isEditing={isEditing}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
            <SelectField
              label="Diet"
              value={editData.foodPreference}
              onChange={(v) => setEditData({ ...editData, foodPreference: v })}
              isEditing={isEditing}
              options={[
                { value: "non_veg", label: "Non Vegetarian" },
                { value: "veg", label: "Vegetarian" },
                { value: "vegan", label: "Vegan" },
                { value: "vegetarian", label: "Eggetarian" },
              ]}
            />
          </div>
        </div>

        <div className="premium-card profile-settings-card">
          <h3 className="font-display profile-section-title">
            Account Settings
          </h3>
          <div className="profile-settings-list">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="settings-btn"
            >
              <Lock size={13} style={{ color: "#0d3d35" }} />
              Change Password
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="settings-btn settings-btn-danger"
            >
              <Trash2 size={13} />
              Delete Account
            </button>
          </div>
        </div>

        {showPasswordModal && (
          <Modal
            title="Change Password"
            onClose={() => setShowPasswordModal(false)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              <Field
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(v) =>
                  setPasswordData({ ...passwordData, currentPassword: v })
                }
                isEditing={true}
              />
              <Field
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(v) =>
                  setPasswordData({ ...passwordData, newPassword: v })
                }
                isEditing={true}
              />
              <button
                onClick={handleChangePassword}
                className="btn-primary"
                style={{ width: "100%", marginTop: "6px" }}
              >
                Update Password
              </button>
            </div>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal
            title="Delete Account"
            onClose={() => setShowDeleteModal(false)}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#6b7068",
                fontFamily: "Inter",
                lineHeight: 1.6,
                marginBottom: "1.25rem",
              }}
            >
              This action is permanent. All your data, progress, and plans will
              be deleted forever.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="delete-confirm-btn"
              >
                Delete Forever
              </button>
            </div>
          </Modal>
        )}
      </div>

      <style>{`
        .profile-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        .profile-page-header {
          margin-bottom: 1.5rem;
        }
        .profile-tag {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .profile-title {
          font-size: 1.75rem;
          color: #0d3d35;
          letter-spacing: -0.02em;
        }
        .profile-info-card,
        .profile-health-card,
        .profile-settings-card {
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .profile-info-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          text-align: center;
        }
        .profile-avatar-wrapper {
          position: relative;
          cursor: pointer;
        }
        .profile-avatar-img,
        .profile-avatar-placeholder {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0d3d35;
        }
        .profile-avatar-placeholder {
          background: #0d3d35;
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .profile-avatar-overlay {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #c4a87a;
          color: #0d3d35;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }
        .profile-info-text {
          flex: 1;
        }
        .profile-name {
          font-size: 1.5rem;
          color: #0d3d35;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }
        .profile-email {
          font-size: 10px;
          color: #6b7068;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          word-break: break-all;
        }
        .profile-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 0.875rem;
          justify-content: center;
        }
        .profile-health-header {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-bottom: 1.25rem;
        }
        .profile-section-title {
          font-size: 1.25rem;
          color: #0d3d35;
          letter-spacing: -0.01em;
        }
        .profile-edit-btn,
        .profile-cancel-btn,
        .profile-save-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .profile-edit-btn,
        .profile-cancel-btn {
          background: transparent;
          color: #0d3d35;
          border: 1.5px solid #0d3d35;
        }
        .profile-save-btn {
          background: #0d3d35;
          color: #f5f3ee;
          border: none;
        }
        .profile-edit-actions {
          display: flex;
          gap: 8px;
        }
        .profile-fields-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
        }
        .profile-settings-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 1rem;
        }
        .settings-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #f5f3ee;
          border: 1px solid rgba(13, 61, 53, 0.06);
          border-radius: 10px;
          cursor: pointer;
          font-family: Inter;
          font-size: 12px;
          color: #1a1a1a;
          font-weight: 600;
          text-align: left;
        }
        .settings-btn-danger {
          background: rgba(168, 72, 56, 0.06);
          border-color: rgba(168, 72, 56, 0.15);
          color: #a84838;
        }
        .delete-confirm-btn {
          flex: 1;
          padding: 0.875rem 2rem;
          background: #a84838;
          color: #f5f3ee;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        @media (min-width: 480px) {
          .profile-page-header {
            margin-bottom: 2rem;
          }
          .profile-title {
            font-size: 2rem;
          }
          .profile-info-card,
          .profile-health-card,
          .profile-settings-card {
            padding: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .profile-avatar-img,
          .profile-avatar-placeholder {
            width: 100px;
            height: 100px;
          }
          .profile-avatar-overlay {
            width: 30px;
            height: 30px;
          }
          .profile-name {
            font-size: 1.75rem;
          }
          .profile-section-title {
            font-size: 1.375rem;
          }
          .profile-edit-btn,
          .profile-cancel-btn,
          .profile-save-btn {
            font-size: 11px;
            padding: 0.625rem 1.25rem;
          }
          .profile-fields-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (min-width: 640px) {
          .profile-info-content {
            flex-direction: row;
            text-align: left;
            align-items: center;
          }
          .profile-badges {
            justify-content: flex-start;
          }
          .profile-health-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        @media (min-width: 1024px) {
          .profile-title {
            font-size: 2.25rem;
          }
          .profile-info-card,
          .profile-health-card,
          .profile-settings-card {
            padding: 2rem;
          }
          .profile-avatar-img,
          .profile-avatar-placeholder {
            width: 108px;
            height: 108px;
          }
          .profile-fields-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

const Field = ({ label, value, onChange, type = "text", isEditing }) => (
  <div>
    <label className="font-mono field-label">{label}</label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    ) : (
      <div className="field-display">{value || "—"}</div>
    )}
    <style>{`
      .field-label {
        font-size: 9px;
        color: #0d3d35;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        display: block;
        margin-bottom: 6px;
      }
      .field-display {
        padding: 0.75rem 1rem;
        background: #f5f3ee;
        border-radius: 10px;
        font-size: 13px;
        color: #1a1a1a;
        font-family: Inter;
        font-weight: 500;
        word-break: break-word;
      }
      @media (min-width: 480px) {
        .field-label {
          font-size: 10px;
        }
        .field-display {
          padding: 0.875rem 1.125rem;
          font-size: 14px;
        }
      }
    `}</style>
  </div>
);

const SelectField = ({ label, value, onChange, options, isEditing }) => (
  <div>
    <label className="font-mono field-label">{label}</label>
    {isEditing ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        style={{ cursor: "pointer" }}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <div className="field-display">
        {options.find((o) => o.value === value)?.label || "—"}
      </div>
    )}
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="modal-backdrop"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="modal-content"
    >
      <div className="modal-header">
        <h3 className="font-display modal-title">{title}</h3>
        <button onClick={onClose} className="modal-close-btn">
          <X size={14} />
        </button>
      </div>
      {children}
    </motion.div>
    <style>{`
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(13, 61, 53, 0.6);
        backdrop-filter: blur(8px);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .modal-content {
        background: #ffffff;
        border-radius: 16px;
        padding: 1.5rem;
        max-width: 440px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
      }
      .modal-title {
        font-size: 1.25rem;
        color: #0d3d35;
        letter-spacing: -0.01em;
      }
      .modal-close-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #f5f3ee;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7068;
      }
      @media (min-width: 480px) {
        .modal-content {
          padding: 2rem;
        }
        .modal-title {
          font-size: 1.5rem;
        }
        .modal-close-btn {
          width: 32px;
          height: 32px;
        }
      }
    `}</style>
  </motion.div>
);

export default Profile;
