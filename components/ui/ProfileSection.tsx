import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "./button";

interface ProfileSectionProps {
  title: string;
  items: string[];
  userId: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, items = [], userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState(items);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    try {
      const response = await fetch(`/api/user?userId=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [title.toLowerCase()]: editedItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedItems(e.target.value.split("\n"));
  };

  return (
    <div className="mb-4 bg-slate-100 p-4 rounded-lg shadow-lg overflow-auto max-h-100">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isEditing ? (
          <Button onClick={handleSaveClick} className="px-2 py-1 rounded">
            <Pencil className="mr-2 h-4 w-4" /> Save
          </Button>
        ) : (
          <Button onClick={handleEditClick} className="px-2 py-1 rounded">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <textarea
          className="w-full mt-2 p-2 border rounded"
          value={editedItems.join("\n")}
          onChange={handleTextareaChange}
          rows={10}
        />
      ) : (
        <ul className="space-y-2 mt-2">
          {editedItems && editedItems.map((item, index) => (
            <li key={index} className="text-lg font-medium">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileSection;