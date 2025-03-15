"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStudyGroup, fetchStudyGroupById } from "../actions";

export default function EditStudyGroupPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadGroup = async () => {
            setLoading(true);
            try {
                const data = await fetchStudyGroupById(id);
                if (!data.isCreator) {
                    throw new Error("You are not authorized to edit this group.");
                }
                setGroup(data);
                setName(data.name);
                setDescription(data.description);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGroup();
    }, [id]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await updateStudyGroup(id, { name, description });
            alert("Group updated successfully.");
            router.push(`/study-groups/${id}`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 flex justify-center">
            <Card className="p-6 max-w-3xl w-full space-y-4">
                <h1 className="text-2xl font-bold">Edit Group</h1>

                {/* Group Name Field */}
                <div className="space-y-2">
                    <label htmlFor="groupName" className="text-sm font-medium text-gray-700">
                        Group Name
                    </label>
                    <Input
                        id="groupName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter group name"
                    />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                    <label htmlFor="groupDescription" className="text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <Input
                        id="groupDescription"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter group description"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push(`/study-groups/${id}`)}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleUpdate} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
